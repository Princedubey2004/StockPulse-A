import { z } from 'zod';

export const addHoldingSchema = z.object({
  body: z.object({
    symbol: z.string().min(1, 'Symbol is required').max(10, 'Symbol too long'),
    quantity: z.number().positive('Quantity must be positive'),
    averagePrice: z.number().positive('Price must be positive')
  })
});
