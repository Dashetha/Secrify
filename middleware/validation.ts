import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

export const validateSecretCreation = (req: Request, res: Response, next: NextFunction) => {
  const { message, password, expiresIn, maxViews } = req.body;

  // Validate message
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ 
      error: 'Message is required and must be a string' 
    });
  }

  if (message.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Message cannot be empty or only whitespace' 
    });
  }

  if (message.length > 10000) {
    return res.status(400).json({ 
      error: 'Message too long. Maximum 10,000 characters allowed.' 
    });
  }

  // Validate password (optional)
  if (password && typeof password !== 'string') {
    return res.status(400).json({ 
      error: 'Password must be a string' 
    });
  }

  if (password && password.length > 100) {
    return res.status(400).json({ 
      error: 'Password too long. Maximum 100 characters allowed.' 
    });
  }

  // Validate expiresIn (optional)
  if (expiresIn) {
    const expiresInNum = parseInt(expiresIn);
    if (isNaN(expiresInNum) || expiresInNum < 1 || expiresInNum > 8760) {
      return res.status(400).json({ 
        error: 'ExpiresIn must be a number between 1 and 8760 hours (1 year)' 
      });
    }
  }

  // Validate maxViews (optional)
  if (maxViews) {
    const maxViewsNum = parseInt(maxViews);
    if (isNaN(maxViewsNum) || maxViewsNum < 1 || maxViewsNum > 100) {
      return res.status(400).json({ 
        error: 'MaxViews must be a number between 1 and 100' 
      });
    }
  }

  next();
};

export const validateSecretAccess = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ 
      error: 'Secret ID is required' 
    });
  }

  if (!validator.isHexadecimal(id) || id.length !== 32) {
    return res.status(400).json({ 
      error: 'Invalid secret ID format' 
    });
  }

  next();
};

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ 
      error: 'Access token is required' 
    });
  }

  if (token.length > 500) {
    return res.status(400).json({ 
      error: 'Invalid token format' 
    });
  }

  next();
};