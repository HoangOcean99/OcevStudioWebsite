import { Request, Response } from 'express';
import { BaseService } from '../services/baseService';
import { Document } from 'mongoose';
import asyncHandler from 'express-async-handler';

export class BaseController<T extends Document> {
  protected service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
  }

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.pageNumber) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    
    const result = await this.service.findAll(req.query, page, pageSize);
    res.json(result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const item = await this.service.findById(req.params.id as string);
    if (item) {
      res.json(item);
    } else {
      res.status(404);
      throw new Error('Not found');
    }
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const createdItem = await this.service.create(req.body);
    res.status(201).json(createdItem);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    try {
      const updatedItem = await this.service.update(req.params.id as string, req.body);
      res.json(updatedItem);
    } catch (error: any) {
      if (error.message === 'Item not found') {
        res.status(404);
        throw new Error('Not found');
      }
      throw error;
    }
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    try {
      await this.service.delete(req.params.id as string);
      res.json({ message: 'Removed successfully' });
    } catch (error: any) {
      if (error.message === 'Item not found') {
        res.status(404);
        throw new Error('Not found');
      }
      throw error;
    }
  });
}
