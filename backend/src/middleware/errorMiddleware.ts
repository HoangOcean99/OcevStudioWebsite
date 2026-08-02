import { Request, Response, NextFunction } from 'express';

// Fallback for missing routes
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // If the status code is still 200 (which is the default), we set it to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);

  res.json({
    message: err.message,
    // Hide stack trace in production for security
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
