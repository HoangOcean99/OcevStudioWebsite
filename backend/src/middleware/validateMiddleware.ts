import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
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
        const errorsList = error.errors || error.issues || [];
        next(new Error(`Validation failed: ${errorsList.map((e: any) => e.message).join(', ')}`));
      } else {
        next(error);
      }
    }
  };
};
