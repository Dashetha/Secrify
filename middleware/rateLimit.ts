import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Rate limiting for secret creation
export const rateLimitCreate = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 secret creations per windowMs
  message: {
    error: 'Too many secrets created. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for secret viewing
export const rateLimitView = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 secret views per windowMs
  message: {
    error: 'Too many secret view attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for API endpoints
export const rateLimitAPI = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: {
    error: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Custom rate limit for IP-based restrictions
export const ipBasedRateLimit = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: (req: Request) => {
      return req.ip; // Use IP address as key
    },
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        error: 'Too many requests from this IP address. Please try again later.'
      });
    }
  });
};