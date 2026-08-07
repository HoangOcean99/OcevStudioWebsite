import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface JwtPayload {
  id: string;
  role: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as JwtPayload;

      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isBanned) {
        res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa' });
        return;
      }
      (req as any).user = user;

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token && !res.headersSent) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as JwtPayload;
      const user = await User.findById(decoded.id).select('-password');
      if (user && !user.isBanned) {
        (req as any).user = user;
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }
  }
  next();
};

export const admin = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;
  if (user && (user.role === 'admin' || user.role === 'staff')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin or staff' });
  }
};
