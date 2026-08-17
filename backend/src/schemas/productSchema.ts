import { z } from 'zod';

export const productSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Product name is required'),
    category: z.string().min(1, 'Category is required'),
    sizes: z.array(z.string()).optional(),
    stock: z.number().min(0).optional(),
    price: z.number().min(0, 'Price cannot be negative').optional(),
    sizeChartUrl: z.string().url().optional().or(z.literal('')),
  }),
});
