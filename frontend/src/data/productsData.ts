export interface BundleItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  type?: 'hat' | 'accessories' | 'shoes' | 'bottom' | 'top' | 'outerwear';
  description?: string;
  hasSize?: boolean;
  colorImages?: Record<string, string | string[]>;
  images?: string[];
  sizes: string[];
}

export interface Product {
  id: string;
  name: string;
  category: 'outerwear' | 'tops' | 'bottoms' | 'sets' | 'accessories';
  price: number;
  originalPrice?: number;
  imageUrl: string;
  secondaryImageUrl?: string;
  images?: string[];
  description: string;
  badge?: 'NEW' | 'HOT' | 'SALE' | 'LIMITED' | 'BESTSELLER';
  sizes: string[];
  colors?: { name: string; hex: string }[];
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
  bundleItems?: BundleItem[];
}

export const PRODUCTS_DATA: Product[] = [
  {
    id: "6a6efefaaf47fac2785da2aa",
    name: "Ocev Cyber-Graphic Oversized Hoodie",
    category: "tops",
    price: 119.00,
    originalPrice: 149.00,
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop",
    secondaryImageUrl: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop",
    description: "Heavyweight 450gsm French Terry cotton hoodie with custom cybernetic high-density screenprint. Drop-shoulder relaxed fit engineered for modern streetwear enthusiasts.",
    badge: "HOT",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    colors: [
      { name: "Obsidian Black", hex: "#121212" },
      { name: "Acid Wash Grey", hex: "#555555" }
    ],
    rating: 4.9,
    reviewsCount: 38,
    isAvailable: true
  },
  {
    id: "6a6efefaaf47fac2785da2ad",
    name: "Tactical Multi-Pocket Cargo Trousers",
    category: "bottoms",
    price: 135.00,
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
    secondaryImageUrl: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop",
    description: "Water-resistant ripstop nylon utility trousers featuring 8 modular pockets, adjustable ankle straps, and ergonomic knee darting.",
    badge: "NEW",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    rating: 4.8,
    reviewsCount: 24,
    isAvailable: true
  },
  {
    id: "6a6efefaaf47fac2785da2ae",
    name: "Urban Matrix Distressed Leather Jacket",
    category: "outerwear",
    price: 289.00,
    originalPrice: 349.00,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
    secondaryImageUrl: "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1000&auto=format&fit=crop",
    description: "Hand-finished distressed eco-leather biker jacket with custom gunmetal hardware, asymmetric zipper closure, and quilted satin lining.",
    badge: "LIMITED",
    sizes: ["M", "L", "XL", "2XL"],
    rating: 5.0,
    reviewsCount: 19,
    isAvailable: true
  },
  {
    id: "6a6efefaaf47fac2785da2af",
    name: "Minimalist Sculpted Cropped Blazer Set",
    category: "sets",
    price: 195.00,
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    secondaryImageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
    description: "Structured double-breasted short blazer paired with tailored wide-leg trousers. Elegant futuristic tailoring crafted from premium crepe wool blend.",
    badge: "BESTSELLER",
    sizes: ["S", "M", "L"],
    rating: 4.9,
    reviewsCount: 52,
    isAvailable: true,
    bundleItems: [
      {
        id: "prod-4-blazer",
        name: "Sculpted Cropped Blazer",
        price: 135.00,
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
        sizes: ["S", "M", "L"],
      },
      {
        id: "prod-4-trousers",
        name: "Tailored Wide-Leg Trousers",
        price: 95.00,
        imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
        sizes: ["S", "M", "L"],
      }
    ]
  },
  {
    id: "6a6efefaaf47fac2785da2b0",
    name: "Ocev Signature Chrome Chain Crossbody",
    category: "accessories",
    price: 79.00,
    originalPrice: 95.00,
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop",
    secondaryImageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop",
    description: "Matte vegan leather bag featuring our signature laser-engraved steel chain buckle and magnetic flap closure. Compact yet roomy for essentials.",
    badge: "SALE",
    sizes: ["S"],
    rating: 4.7,
    reviewsCount: 41,
    isAvailable: true
  },
  {
    id: "6a6efefaaf47fac2785da2b1",
    name: "Monochrome Mesh Layered Maxi Dress",
    category: "sets",
    price: 158.00,
    imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop",
    secondaryImageUrl: "https://images.unsplash.com/photo-1515347619362-67fd3b762510?q=80&w=1000&auto=format&fit=crop",
    description: "Avant-garde semi-sheer mesh maxi dress over an opaque stretch inner slip. Features raw-edge hems and thumbhole sleeves.",
    badge: "NEW",
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviewsCount: 15,
    isAvailable: true,
    bundleItems: [
      {
        id: "prod-6-mesh",
        name: "Semi-Sheer Mesh Maxi Overlay",
        price: 98.00,
        imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop",
        sizes: ["S", "M", "L"],
      },
      {
        id: "prod-6-slip",
        name: "Opaque Stretch Inner Slip",
        price: 75.00,
        imageUrl: "https://images.unsplash.com/photo-1515347619362-67fd3b762510?q=80&w=1000&auto=format&fit=crop",
        sizes: ["S", "M", "L"],
      }
    ]
  },
  {
    id: "6a6efefaaf47fac2785da2b2",
    name: "Acid Wash Oversized Vintage Tee",
    category: "tops",
    price: 58.00,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop",
    secondaryImageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
    description: "260gsm combed cotton short sleeve T-shirt with heavy vintage enzyme wash effect and subtle tonal Ocev crest embroidery on chest.",
    badge: "BESTSELLER",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    rating: 4.9,
    reviewsCount: 88,
    isAvailable: true
  },
  {
    id: "6a6efefaaf47fac2785da2b3",
    name: "Tech-Fleece Padded Bomber Jacket",
    category: "outerwear",
    price: 215.00,
    originalPrice: 260.00,
    imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop",
    secondaryImageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop",
    description: "Thermal insulated flight jacket with windproof matte shell, heavy ribbed cuffs, and dual internal utility sleeve pockets.",
    badge: "SALE",
    sizes: ["M", "L", "XL"],
    rating: 4.8,
    reviewsCount: 30,
    isAvailable: true
  },
  {
    id: "6a6efefaaf47fac2785da2b4",
    name: "Ocev Cyberpunk Platform Sneakers",
    category: "accessories",
    price: 185.00,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    description: "Futuristic platform sneakers with shock-absorbing soles, reflective cybernetic accents, and a laceless magnetic closure system.",
    badge: "NEW",
    sizes: ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"],
    rating: 4.9,
    reviewsCount: 12,
    isAvailable: true
  }
];
