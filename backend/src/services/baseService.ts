import { Model, Document } from 'mongoose';

export class BaseService<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findAll(query: any = {}, page: number = 1, pageSize: number = 10) {
    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword as string,
            $options: 'i',
          },
        }
      : {};

    const count = await this.model.countDocuments({ ...keyword });
    const items = await this.model.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    return { items, page, pages: Math.ceil(count / pageSize), total: count };
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }

  async create(data: Partial<T>) {
    const item = new this.model(data);
    return await item.save();
  }

  async update(id: string, data: Partial<T>) {
    const item = await this.model.findById(id);
    if (!item) {
      throw new Error('Item not found');
    }
    
    Object.assign(item, data);
    return await item.save();
  }

  async delete(id: string) {
    const item = await this.model.findById(id);
    if (!item) {
      throw new Error('Item not found');
    }
    await item.deleteOne();
    return true;
  }
}
