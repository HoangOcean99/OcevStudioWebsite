import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Upload Image
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No image file provided');
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const folder = req.body.folder || 'ocevstudio/products';

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: 'auto',
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Image upload failed' });
  }
});

// Upload Multiple Images for Reviews (Only requires protect, not admin)
router.post('/reviews', protect, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400);
      throw new Error('No image files provided');
    }

    const { productId } = req.body;
    const folder = productId ? `ocevstudio/reviews/${productId}` : 'ocevstudio/reviews';
    
    const uploadPromises = req.files.map((file) => {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      return cloudinary.uploader.upload(dataURI, {
        folder: folder,
        resource_type: 'auto',
      });
    });

    const results = await Promise.all(uploadPromises);
    const urls = results.map(result => result.secure_url);

    res.json({
      urls,
      success: true
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Images upload failed' });
  }
});

// Delete Image
router.delete('/', protect, admin, async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      res.status(400);
      throw new Error('No public_id provided');
    }

    const result = await cloudinary.uploader.destroy(public_id);
    res.json({ success: true, result });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Image deletion failed' });
  }
});

export default router;
