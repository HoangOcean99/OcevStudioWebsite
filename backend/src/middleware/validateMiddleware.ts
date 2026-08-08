import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400);
        // Pass a formatted string or the first error message to the global handler
        const errorsList = error.issues || [];
        next(new Error(`Validation failed: ${errorsList.map((e: any) => e.message).join(', ')}`));
      } else {
        next(error);
      }
    }
  };
};
