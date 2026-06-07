import { getIO } from '../../sockets/socketManager';
import { marketSubClient } from '../../config/redis';
import { prisma } from '../../config/db';
import { Alert } from '@prisma/client';

interface PriceUpdateJob {
  symbol: string;
  price: number;
}

export class AlertService {
  private activeAlerts: Alert[] = [];

  constructor() {
    console.log('[AlertService] Initializing Redis Pub/Sub Subscriber...');
    
    // Load active alerts from database
    this.loadActiveAlerts().catch(err => console.error('[AlertService] Failed to load alerts:', err));
    
    // Subscribe to the market price updates channel
    marketSubClient.subscribe('market:price_updates', (err: any, count: any) => {
      if (err) {
        console.error('[AlertService] Failed to subscribe to market updates:', err);
      } else {
        console.log(`[AlertService] Subscribed to ${count} channel(s).`);
      }
    });

    // Listen for messages published to the channel
    marketSubClient.on('message', async (channel: string, message: string) => {
      if (channel === 'market:price_updates') {
        try {
          const update: PriceUpdateJob = JSON.parse(message);
          await this.evaluateAlerts(update);
        } catch (err) {
          console.error('[AlertService] Error processing pub/sub message:', err);
        }
      }
    });
  }

  private async loadActiveAlerts() {
    try {
      this.activeAlerts = await prisma.alert.findMany({
        where: { isTriggered: false }
      });
      console.log(`[AlertService] Loaded ${this.activeAlerts.length} active alerts into memory.`);
    } catch (e) {
      console.error('[AlertService] DB not ready or failed to load alerts.');
    }
  }

  // Create a new alert
  public async createAlert(userId: string, symbol: string, condition: 'ABOVE' | 'BELOW', targetPrice: number): Promise<Alert> {
    const newAlert = await prisma.alert.create({
      data: {
        userId,
        symbol: symbol.toUpperCase(),
        condition,
        targetPrice,
        isTriggered: false
      }
    });

    this.activeAlerts.push(newAlert);
    
    console.log(`[AlertService] Created alert for ${symbol} ${condition} ${targetPrice}`);
    return newAlert;
  }

  // Evaluate alerts against a new price update
  private async evaluateAlerts(update: PriceUpdateJob) {
    const { symbol, price } = update;
    
    // Find active alerts for this symbol
    const relevantAlerts = this.activeAlerts.filter(a => a.symbol === symbol);

    for (const alert of relevantAlerts) {
      let triggered = false;
      
      if (alert.condition === 'ABOVE' && price >= alert.targetPrice) {
        triggered = true;
      } else if (alert.condition === 'BELOW' && price <= alert.targetPrice) {
        triggered = true;
      }

      if (triggered) {
        // Update DB
        await prisma.alert.update({
          where: { id: alert.id },
          data: { isTriggered: true }
        });

        // Remove from memory cache
        this.activeAlerts = this.activeAlerts.filter(a => a.id !== alert.id);
        
        console.log(`[AlertService] Alert TRIGGERED! User ${alert.userId}: ${symbol} went ${alert.condition} ${alert.targetPrice} (Current: ${price})`);
        
        // Notify the user via Socket.io private room
        try {
          const io = getIO();
          io.to(`user:${alert.userId}`).emit('alert_triggered', {
            alertId: alert.id,
            symbol,
            price,
            condition: alert.condition,
            targetPrice: alert.targetPrice,
            message: `${symbol} is now ₹${price.toFixed(2)}, which is ${alert.condition.toLowerCase()} your target of ₹${alert.targetPrice.toFixed(2)}.`
          });
        } catch (err) {
          console.error('[AlertService] Failed to emit alert notification:', err);
        }
      }
    }
  }

  public async getUserAlerts(userId: string) {
    return prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const alertService = new AlertService();
