import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';

export const cache = (durationSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    if (redis.status !== 'ready') {
      return next(); // Fail gracefully if Redis is down
    }

    const key = `ocevstudio:cache:${req.originalUrl}`;

    try {
      const cachedResponse = await redis.get(key);
      if (cachedResponse) {
        res.setHeader('X-Cache', 'HIT');
        res.json(JSON.parse(cachedResponse));
        return;
      }

      res.setHeader('X-Cache', 'MISS');
      
      // Intercept res.json to save to Redis
      const originalJson = res.json.bind(res);
      res.json = ((body: any) => {
        redis.setex(key, durationSeconds, JSON.stringify(body));
        return originalJson(body);
      }) as any;

      next();
    } catch (err) {
      console.warn('[Cache Middleware Error]', err);
      next();
    }
  };
};

export const clearCache = (prefix: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (redis.status === 'ready') {
        const keys = await redis.keys(`ocevstudio:cache:${prefix}*`);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      }
    } catch (err) {
      console.warn('[Cache Clear Error]', err);
    }
    next();
  };
};
