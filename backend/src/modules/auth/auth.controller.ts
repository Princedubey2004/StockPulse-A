import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/db';
import { config } from '../../config/env';
import { z } from 'zod';
import { AuthRequest } from '../../middleware/authMiddleware';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const generateTokens = (user: { id: string; email: string }) => {
  const accessToken = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const { accessToken, refreshToken } = generateTokens(user);

    // Normally we would save the refresh token here, but due to Prisma setup constraints, we'll keep it stateless
    // await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    res.status(201).json({
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors });
    }
    console.error('[AuthController] Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors });
    }
    console.error('[AuthController] Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, config.jwtSecret) as { id: string; email: string };
    
    // Check if user still exists
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    const tokens = generateTokens(user);
    
    res.json(tokens);
  } catch (error) {
    console.error('[AuthController] Refresh error:', error);
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  // In a stateless JWT setup without DB persistence, we just return success
  // and rely on the client to discard the tokens.
  res.json({ success: true });
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('[AuthController] Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
