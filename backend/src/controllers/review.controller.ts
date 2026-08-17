import { Request, Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';
import cloudinary from '../config/cloudinary';

const getPublicIdFromUrl = (url: string): string | null => {
  try {
    const parts = url.split('/');
    const filename = parts.pop();
    if (!filename) return null;
    const id = filename.split('.')[0];
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    let startIndex = uploadIndex + 1;
    if (parts[startIndex] && parts[startIndex].match(/^v\d+$/)) {
      startIndex++;
    }
    const folderPath = parts.slice(startIndex).join('/');
    return folderPath ? `${folderPath}/${id}` : id;
  } catch (error) {
    return null;
  }
};

// Get reviews for a product
export const getReviewsByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const filter = req.query.filter ? Number(req.query.filter) : null;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    let query: any = { productId };
    if (filter) {
      query.rating = filter;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Review.countDocuments(query);

    // Get stats
    const statsResult = await Review.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        }
      }
    ]);

    const stats = statsResult[0] || { averageRating: 0, totalReviews: 0 };

    res.json({
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: {
        averageRating: Math.round(stats.averageRating * 10) / 10,
        totalReviews: stats.totalReviews
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

// Create a new review
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, rating, content, images, productType } = req.body;
    
    // Ensure user is authenticated
    if (!req.user) {
      res.status(401).json({ message: 'Bạn cần đăng nhập để đánh giá' });
      return;
    }

    const userId = req.user._id;
    const userName = req.user.name;
    const userAvatar = req.user.avatar || '';

    const newReview = new Review({
      productId,
      userId,
      userName,
      userAvatar,
      rating,
      content,
      images,
      productType
    });

    await newReview.save();

    // Update Product average rating and review count
    const statsResult = await Review.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        }
      }
    ]);

    if (statsResult.length > 0) {
      await Product.findOneAndUpdate(
        { _id: productId }, // Or { id: productId } if using custom ID
        { 
          rating: Math.round(statsResult[0].averageRating * 10) / 10,
          reviewsCount: statsResult[0].totalReviews
        }
      ).catch(() => {
        // If searching by custom id field
        return Product.findOneAndUpdate(
          { id: productId },
          { 
            rating: Math.round(statsResult[0].averageRating * 10) / 10,
            reviewsCount: statsResult[0].totalReviews
          }
        );
      });
    }

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error });
  }
};

// Like a review
export const likeReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error liking review', error });
  }
};

// Update a review
export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, content, images } = req.body;
    
    if (!req.user) {
      res.status(401).json({ message: 'Bạn cần đăng nhập' });
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ message: 'Không tìm thấy đánh giá' });
      return;
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Bạn không có quyền sửa đánh giá này' });
      return;
    }

    review.rating = rating;
    review.content = content;
    if (images) {
      // Find deleted images and remove from cloudinary
      if (review.images && review.images.length > 0) {
        const deletedImages = review.images.filter(img => !images.includes(img));
        for (const imgUrl of deletedImages) {
          const publicId = getPublicIdFromUrl(imgUrl);
          if (publicId) {
            cloudinary.uploader.destroy(publicId).catch(err => console.error("Cloudinary delete error:", err));
          }
        }
      }
      review.images = images;
    }
    
    await review.save();

    // Update Product average rating
    const statsResult = await Review.aggregate([
      { $match: { productId: review.productId } },
      { $group: { _id: null, averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
    ]);
    if (statsResult.length > 0) {
      await Product.findOneAndUpdate(
        { _id: review.productId },
        { rating: Math.round(statsResult[0].averageRating * 10) / 10, reviewsCount: statsResult[0].totalReviews }
      ).catch(() => Product.findOneAndUpdate(
        { id: review.productId },
        { rating: Math.round(statsResult[0].averageRating * 10) / 10, reviewsCount: statsResult[0].totalReviews }
      ));
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error });
  }
};

// Delete a review
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!req.user) {
      res.status(401).json({ message: 'Bạn cần đăng nhập' });
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ message: 'Không tìm thấy đánh giá' });
      return;
    }

    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Bạn không có quyền xóa đánh giá này' });
      return;
    }

    // Delete images from Cloudinary
    if (review.images && review.images.length > 0) {
      for (const imgUrl of review.images) {
        const publicId = getPublicIdFromUrl(imgUrl);
        if (publicId) {
          cloudinary.uploader.destroy(publicId).catch(err => console.error("Cloudinary delete error:", err));
        }
      }
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(id);

    // Update Product average rating
    const statsResult = await Review.aggregate([
      { $match: { productId } },
      { $group: { _id: null, averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
    ]);
    if (statsResult.length > 0) {
      await Product.findOneAndUpdate(
        { _id: productId },
        { rating: Math.round(statsResult[0].averageRating * 10) / 10, reviewsCount: statsResult[0].totalReviews }
      ).catch(() => Product.findOneAndUpdate(
        { id: productId },
        { rating: Math.round(statsResult[0].averageRating * 10) / 10, reviewsCount: statsResult[0].totalReviews }
      ));
    } else {
      await Product.findOneAndUpdate(
        { _id: productId },
        { rating: 5.0, reviewsCount: 0 }
      ).catch(() => Product.findOneAndUpdate(
        { id: productId },
        { rating: 5.0, reviewsCount: 0 }
      ));
    }

    res.json({ message: 'Đã xóa đánh giá' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error });
  }
};
