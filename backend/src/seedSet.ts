import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { productService } from './services/productService';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedSet = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/ocev-studio';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find if demo set exists
    const existingDemo = await productService['model'].findOne({ name: 'URBAN NINJA COMPLETE SET' });
    if (existingDemo) {
      await productService['model'].deleteOne({ _id: existingDemo._id });
      console.log('Deleted existing demo set');
    }

    const bundleItems = [
      {
        id: "bi-1",
        name: "Ninja Mask & Goggles",
        price: 45,
        imageUrl: "https://images.unsplash.com/photo-1579621970220-3fb3911f4228?q=80&w=800&auto=format&fit=crop",
        type: "accessories",
        description: "Tactical mask with anti-fog goggles. Perfect for urban exploration. Adjustable strap fits all sizes.",
        hasSize: false,
        sizes: [],
        colorImages: {
          "Black": "https://images.unsplash.com/photo-1579621970220-3fb3911f4228?q=80&w=800&auto=format&fit=crop",
          "White": "https://images.unsplash.com/photo-1622288432450-277d0f65dd4b?q=80&w=800&auto=format&fit=crop",
        }
      },
      {
        id: "bi-2",
        name: "Cyber-Tech Top",
        price: 120,
        imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
        type: "top",
        description: "Breathable, lightweight, and waterproof. Designed for high mobility with multiple hidden pockets.",
        hasSize: true,
        sizes: ["S", "M", "L", "XL"],
        colorImages: {
          "Black": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
          "White": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
        }
      },
      {
        id: "bi-3",
        name: "Tactical Cargo Pants",
        price: 150,
        imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
        type: "bottom",
        description: "Multi-pocket tactical pants with adjustable ankle straps. Made of reinforced ripstop fabric.",
        hasSize: true,
        sizes: ["28", "30", "32", "34"],
        colorImages: {
          "Black": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
          "White": "https://images.unsplash.com/photo-1623883832431-897914bf4593?q=80&w=800&auto=format&fit=crop",
        }
      },
      {
        id: "bi-4",
        name: "Hover-Sole Boots",
        price: 180,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
        type: "shoes",
        description: "High-top boots featuring our signature hover-sole technology for maximum comfort on concrete.",
        hasSize: true,
        sizes: ["40", "41", "42", "43", "44"],
        colorImages: {
          "Black": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
          "White": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop",
        }
      }
    ];

    const demoProduct = {
      name: "URBAN NINJA COMPLETE SET",
      description: "The ultimate streetwear combo for the modern urban ninja. Features advanced fabrics and modular design.",
      price: 395,
      originalPrice: 495,
      category: "sets",
      imageUrl: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=800&auto=format&fit=crop",
      badge: "LIMITED",
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "White", hex: "#FFFFFF" }
      ],
      sizes: ["S", "M", "L", "XL"], // Default sizes for the set
      bundleItems,
    };

    await productService.create(demoProduct);
    console.log('Successfully created URBAN NINJA COMPLETE SET demo product');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedSet();
