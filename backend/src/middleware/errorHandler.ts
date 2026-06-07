import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { config } from '../config/env';

export function errorHandler(err: Error | AppError, req: Request, res: Response, next: NextFunction) {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    // Could parse zod errors in detail here
  }

  // Log error in development or if it's not operational
  if (config.nodeEnv === 'development' || !(err instanceof AppError)) {
    console.error(`[ErrorHandler] ${err.name}: ${err.message}`, err);
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
}
