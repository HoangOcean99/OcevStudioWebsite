import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { productService } from './services/productService';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ─────────────────────────────────────────────────────────────────────────────
// Product data — mirrors frontend src/data/productsData.ts
// ─────────────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  // ── 1. Urban Ninja Complete Set (TECHWEAR) ──────────────────────────────────
  {
    name: "Urban Ninja Complete Set",
    description:
      "Bộ trang phục techwear hoàn chỉnh dành cho đô thị hiện đại. Màu sắc được phối sẵn theo phong cách Stealth Black — mua bộ để có giá tốt nhất, hoặc tự ghép theo màu yêu thích.",
    price: 219.00,
    originalPrice: 303.00,
    category: "techwear",
    imageUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000&auto=format&fit=crop",
    secondaryImageUrl:
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop",
    badge: "HOT",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviewsCount: 64,
    isAvailable: true,
    colorThemes: [
      {
        name: "Stealth Black",
        description: "Tông đen tuyền tactical — ẩn mình trong đô thị",
        previewHex: "#111111",
        images: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
        ],
        itemColors: {
          "urban-ninja-jacket":    { name: "Stealth Black", hex: "#111111", imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop" },
          "urban-ninja-pants":     { name: "Stealth Black", hex: "#111111", imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop" },
          "urban-ninja-boots":     { name: "Matte Black",   hex: "#1C1C1C", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop" },
          "urban-ninja-cap":       { name: "Stealth Black", hex: "#111111", imageUrl: "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1000&auto=format&fit=crop" },
          "urban-ninja-chest-rig": { name: "Gunmetal",      hex: "#2C2C2C", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop" },
        },
      },
      {
        name: "Earth Military",
        description: "Tông đất quân sự — hoà mình cùng thiên nhiên",
        previewHex: "#6B7144",
        images: [
          "https://images.unsplash.com/photo-1574130291800-1a2e6a84c7fc?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop",
        ],
        itemColors: {
          "urban-ninja-jacket":    { name: "Olive Drab",    hex: "#6B7144", imageUrl: "https://images.unsplash.com/photo-1574130291800-1a2e6a84c7fc?q=80&w=1000&auto=format&fit=crop" },
          "urban-ninja-pants":     { name: "Khaki",         hex: "#C3B091", imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop" },
          "urban-ninja-boots":     { name: "Ranger Olive",  hex: "#556B2F", imageUrl: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1000&auto=format&fit=crop" },
          "urban-ninja-cap":       { name: "Olive",         hex: "#808000", imageUrl: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=1000&auto=format&fit=crop" },
          "urban-ninja-chest-rig": { name: "Olive Drab",    hex: "#6B7144", imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop" },
        },
      },
      {
        name: "Deep Ocean",
        description: "Tông xanh đại dương sâu — lạnh lùng và tinh tế",
        previewHex: "#1B2A4A",
        images: [
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop",
        ],
        itemColors: {
          "urban-ninja-jacket":    { name: "Midnight Navy", hex: "#1B2A4A", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop" },
          "urban-ninja-pants":     { name: "Slate Grey",    hex: "#708090", imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop" },
          "urban-ninja-boots":     { name: "Matte Black",   hex: "#1C1C1C", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop" },
          "urban-ninja-cap":       { name: "Ash Grey",      hex: "#B2BEB5", imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop" },
          "urban-ninja-chest-rig": { name: "Gunmetal",      hex: "#2C2C2C", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop" },
        },
      },
    ],
    bundleItems: [

      {
        id: "urban-ninja-jacket",
        name: "Gore-Tex Shell Jacket",
        type: "outerwear",
        price: 89.00,
        imageUrl:
          "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
        ],
        sizes: ["S", "M", "L", "XL"],
        hasSize: true,
        description:
          "Áo khoác vỏ gore-tex chống nước, chống gió. Đường cắt tactical với nhiều túi ẩn. Lớp lót fleece mỏng nhẹ giữ ấm tối ưu.",
        presetColor: { name: "Stealth Black", hex: "#111111" },
        availableColors: [
          {
            name: "Stealth Black",
            hex: "#111111",
            imageUrl:
              "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Olive Drab",
            hex: "#6B7144",
            imageUrl:
              "https://images.unsplash.com/photo-1574130291800-1a2e6a84c7fc?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Midnight Navy",
            hex: "#1B2A4A",
            imageUrl:
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "urban-ninja-pants",
        name: "Tactical Cargo Pants",
        type: "bottom",
        price: 65.00,
        imageUrl:
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        hasSize: true,
        description:
          "Quần cargo tactical với 8 túi đa năng. Chất liệu ripstop stretch bền bỉ, thoáng khí. Ống quần dạng tapered fit phù hợp nhiều dáng người.",
        presetColor: { name: "Stealth Black", hex: "#111111" },
        availableColors: [
          {
            name: "Stealth Black",
            hex: "#111111",
            imageUrl:
              "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Khaki",
            hex: "#C3B091",
            imageUrl:
              "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Slate Grey",
            hex: "#708090",
            imageUrl:
              "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "urban-ninja-boots",
        name: "Combat Boots Pro",
        type: "shoes",
        price: 75.00,
        imageUrl:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1000&auto=format&fit=crop",
        ],
        sizes: ["38", "39", "40", "41", "42", "43", "44"],
        hasSize: true,
        description:
          "Boots chiến thuật cổ cao chống nước. Đế EVA siêu nhẹ, đế ngoài cao su chống trơn trượt. Phù hợp địa hình đô thị và ngoài trời.",
        presetColor: { name: "Matte Black", hex: "#1C1C1C" },
        availableColors: [
          {
            name: "Matte Black",
            hex: "#1C1C1C",
            imageUrl:
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Tan Brown",
            hex: "#8B6914",
            imageUrl:
              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Ranger Olive",
            hex: "#556B2F",
            imageUrl:
              "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1000&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "urban-ninja-cap",
        name: "Stealth Operator Cap",
        type: "hat",
        price: 24.00,
        imageUrl:
          "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1000&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1000&auto=format&fit=crop",
        ],
        sizes: ["Free Size"],
        hasSize: false,
        description:
          "Mũ lưỡi trai 6-panel phong cách operator. Vải ripstop nhẹ, thêm logo woven bằng chỉ reflective. Điều chỉnh size bằng dây kéo phía sau.",
        presetColor: { name: "Stealth Black", hex: "#111111" },
        availableColors: [
          {
            name: "Stealth Black",
            hex: "#111111",
            imageUrl:
              "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Ash Grey",
            hex: "#B2BEB5",
            imageUrl:
              "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Olive",
            hex: "#808000",
            imageUrl:
              "https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=1000&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "urban-ninja-chest-rig",
        name: "Tactical Chest Rig",
        type: "accessories",
        price: 50.00,
        imageUrl:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop",
        ],
        sizes: ["Free Size"],
        hasSize: false,
        description:
          "Chest rig tactical đa ngăn với hệ thống MOLLE. Dây đai điều chỉnh đa chiều, phù hợp nhiều dáng người. Chất liệu 500D Cordura bền bỉ.",
        presetColor: { name: "Gunmetal", hex: "#2C2C2C" },
        availableColors: [
          {
            name: "Gunmetal",
            hex: "#2C2C2C",
            imageUrl:
              "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Olive Drab",
            hex: "#6B7144",
            imageUrl:
              "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Coyote Tan",
            hex: "#81613C",
            imageUrl:
              "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&w=1000&auto=format&fit=crop",
          },
        ],
      },
    ],
  },

  // ── 2. Sculpted Monolith Set (MINIMALIST) ─────────────────────────────────
  {
    name: "Sculpted Monolith Set",
    description:
      "Bộ blazer cấu trúc kết hợp quần wide-leg thanh lịch. Được phối trong tông trắng tinh khiết — biểu tượng của tối giản hiện đại.",
    price: 230.00,
    originalPrice: 284.00,
    category: "minimalist",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    secondaryImageUrl:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
    badge: "BESTSELLER",
    sizes: ["S", "M", "L"],
    rating: 4.9,
    reviewsCount: 52,
    isAvailable: true,
    colorThemes: [
      {
        name: "Pure White",
        description: "Tông trắng tinh khiết — tối giản hoàn hảo",
        previewHex: "#F9F9F7",
        images: [
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
        ],
        itemColors: {
          "monolith-blazer":   { name: "Pure White", hex: "#F9F9F7", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" },
          "monolith-trousers": { name: "Pure White", hex: "#F9F9F7", imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop" },
          "monolith-heels":    { name: "Pure White", hex: "#F9F9F7", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop" },
        },
      },
      {
        name: "All Black",
        description: "Tông đen tuyền — quyền lực và sang trọng",
        previewHex: "#1A1A1A",
        images: [
          "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop",
        ],
        itemColors: {
          "monolith-blazer":   { name: "Chalk Black", hex: "#1A1A1A", imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop" },
          "monolith-trousers": { name: "Chalk Black", hex: "#1A1A1A", imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop" },
          "monolith-heels":    { name: "Chalk Black", hex: "#1A1A1A", imageUrl: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1000&auto=format&fit=crop" },
        },
      },
      {
        name: "Stone Beige",
        description: "Tông đất nhẹ nhàng — ấm áp và tinh tế",
        previewHex: "#C9B99A",
        images: [
          "https://images.unsplash.com/photo-1594938298603-c8148c4b4878?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop",
        ],
        itemColors: {
          "monolith-blazer":   { name: "Stone Beige", hex: "#C9B99A", imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4b4878?q=80&w=1000&auto=format&fit=crop" },
          "monolith-trousers": { name: "Stone Beige", hex: "#C9B99A", imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop" },
          "monolith-heels":    { name: "Pure White",  hex: "#F9F9F7", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop" },
        },
      },
    ],
    bundleItems: [
      {
        id: "monolith-blazer",
        name: "Sculpted Cropped Blazer",
        type: "outerwear",
        price: 135.00,
        imageUrl:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
        ],
        sizes: ["S", "M", "L"],
        hasSize: true,
        description:
          "Blazer crop double-breasted cấu trúc đôi. Chất liệu crepe wool blend cao cấp, đường may thủ công tinh tế.",
        presetColor: { name: "Pure White", hex: "#F9F9F7" },
        availableColors: [
          {
            name: "Pure White",
            hex: "#F9F9F7",
            imageUrl:
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Chalk Black",
            hex: "#1A1A1A",
            imageUrl:
              "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Stone Beige",
            hex: "#C9B99A",
            imageUrl:
              "https://images.unsplash.com/photo-1594938298603-c8148c4b4878?q=80&w=1000&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "monolith-trousers",
        name: "Tailored Wide-Leg Trousers",
        type: "bottom",
        price: 95.00,
        imageUrl:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
        ],
        sizes: ["S", "M", "L"],
        hasSize: true,
        description:
          "Quần wide-leg dáng chuẩn, cạp cao tôn dáng. Chất liệu crepe mỏng nhẹ rũ tự nhiên, phù hợp cả công sở lẫn sự kiện.",
        presetColor: { name: "Pure White", hex: "#F9F9F7" },
        availableColors: [
          {
            name: "Pure White",
            hex: "#F9F9F7",
            imageUrl:
              "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Chalk Black",
            hex: "#1A1A1A",
            imageUrl:
              "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Stone Beige",
            hex: "#C9B99A",
            imageUrl:
              "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "monolith-heels",
        name: "Sculptural Block Heels",
        type: "shoes",
        price: 54.00,
        imageUrl:
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop",
        ],
        sizes: ["36", "37", "38", "39", "40", "41"],
        hasSize: true,
        description:
          "Giày block heel 6cm với phom sculptural tối giản. Upper da PU cao cấp, đế ngoài chống trơn.",
        presetColor: { name: "Pure White", hex: "#F9F9F7" },
        availableColors: [
          {
            name: "Pure White",
            hex: "#F9F9F7",
            imageUrl:
              "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Chalk Black",
            hex: "#1A1A1A",
            imageUrl:
              "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1000&auto=format&fit=crop",
          },
        ],
      },
    ],
  },

  // ── 3. Cyber Recon Outfit (CYBERPUNK) ────────────────────────────────────
  {
    name: "Cyber Recon Outfit",
    description:
      "Bộ trang phục cyberpunk cấu trúc mạnh mẽ với phom avant-garde. Tông dark purple được phối cùng chi tiết phản quang — nổi bật trong đêm.",
    price: 198.00,
    originalPrice: 262.00,
    category: "cyberpunk",
    imageUrl:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop",
    secondaryImageUrl:
      "https://images.unsplash.com/photo-1515347619362-67fd3b762510?q=80&w=1000&auto=format&fit=crop",
    badge: "NEW",
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviewsCount: 28,
    isAvailable: true,
    colorThemes: [
      {
        name: "Neon Night",
        description: "Tông tím neon — nổi bật trong màn đêm đô thị",
        previewHex: "#3B1F6E",
        images: [
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop",
        ],
        itemColors: {
          "cyber-recon-hoodie": { name: "Deep Purple",  hex: "#3B1F6E", imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop" },
          "cyber-recon-pants":  { name: "Deep Purple",  hex: "#3B1F6E", imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop" },
          "cyber-recon-boots":  { name: "Gloss Black",  hex: "#080808", imageUrl: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1000&auto=format&fit=crop" },
        },
      },
      {
        name: "Void",
        description: "Tông đen tuyền hư không — bí ẩn tuyệt đối",
        previewHex: "#0D0D0D",
        images: [
          "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1609609803847-4c0f9e49a8e4?q=80&w=1000&auto=format&fit=crop",
        ],
        itemColors: {
          "cyber-recon-hoodie": { name: "Void Black",  hex: "#0D0D0D", imageUrl: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop" },
          "cyber-recon-pants":  { name: "Void Black",  hex: "#0D0D0D", imageUrl: "https://images.unsplash.com/photo-1609609803847-4c0f9e49a8e4?q=80&w=1000&auto=format&fit=crop" },
          "cyber-recon-boots":  { name: "Gloss Black", hex: "#080808", imageUrl: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1000&auto=format&fit=crop" },
        },
      },
      {
        name: "Electric Storm",
        description: "Tông xanh điện tử — năng lượng và tương lai",
        previewHex: "#0047AB",
        images: [
          "https://images.unsplash.com/photo-1551854838-212c50b4c184?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1609609803847-4c0f9e49a8e4?q=80&w=1000&auto=format&fit=crop",
        ],
        itemColors: {
          "cyber-recon-hoodie": { name: "Electric Blue",  hex: "#0047AB", imageUrl: "https://images.unsplash.com/photo-1551854838-212c50b4c184?q=80&w=1000&auto=format&fit=crop" },
          "cyber-recon-pants":  { name: "Void Black",     hex: "#0D0D0D", imageUrl: "https://images.unsplash.com/photo-1609609803847-4c0f9e49a8e4?q=80&w=1000&auto=format&fit=crop" },
          "cyber-recon-boots":  { name: "Chrome Silver",  hex: "#C0C0C0", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop" },
        },
      },
    ],
    bundleItems: [
      {
        id: "cyber-recon-hoodie",
        name: "Cyber Graphic Oversized Hoodie",
        type: "top",
        price: 88.00,
        imageUrl:
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop",
        ],
        sizes: ["S", "M", "L", "XL"],
        hasSize: true,
        description:
          "Hoodie oversize 400gsm với họa tiết cyberpunk. Đường cắt drop-shoulder, túi kangaroo ẩn. Chi tiết phản quang dọc tay áo.",
        presetColor: { name: "Deep Purple", hex: "#3B1F6E" },
        availableColors: [
          {
            name: "Deep Purple",
            hex: "#3B1F6E",
            imageUrl:
              "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Void Black",
            hex: "#0D0D0D",
            imageUrl:
              "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Electric Blue",
            hex: "#0047AB",
            imageUrl:
              "https://images.unsplash.com/photo-1551854838-212c50b4c184?q=80&w=1000&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "cyber-recon-pants",
        name: "Multi-Pocket Cyber Cargo",
        type: "bottom",
        price: 79.00,
        imageUrl:
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
        ],
        sizes: ["S", "M", "L", "XL"],
        hasSize: true,
        description:
          "Quần cargo cyberpunk với 10 túi đa năng. Ống quần có thể tháo rời ở gối, điều chỉnh kiểu shorts hoặc full-length.",
        presetColor: { name: "Deep Purple", hex: "#3B1F6E" },
        availableColors: [
          {
            name: "Deep Purple",
            hex: "#3B1F6E",
            imageUrl:
              "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Void Black",
            hex: "#0D0D0D",
            imageUrl:
              "https://images.unsplash.com/photo-1609609803847-4c0f9e49a8e4?q=80&w=1000&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "cyber-recon-boots",
        name: "Cyberpunk Platform Boots",
        type: "shoes",
        price: 95.00,
        imageUrl:
          "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1000&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1000&auto=format&fit=crop",
        ],
        sizes: ["37", "38", "39", "40", "41", "42", "43"],
        hasSize: true,
        description:
          "Boots platform đế chunky cao 5cm phong cách cyberpunk. Dây cột hệ thống ring-buckle, vật liệu vegan leather chống ẩm.",
        presetColor: { name: "Gloss Black", hex: "#080808" },
        availableColors: [
          {
            name: "Gloss Black",
            hex: "#080808",
            imageUrl:
              "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1000&auto=format&fit=crop",
          },
          {
            name: "Chrome Silver",
            hex: "#C0C0C0",
            imageUrl:
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
          },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      'mongodb://localhost:27017/ocev-studio';

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Delete all existing products and re-insert fresh
    const Model = productService['model'];
    const deleted = await Model.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.deletedCount} existing products`);

    for (const product of PRODUCTS) {
      await productService.create(product as any);
      console.log(`✅ Created: ${product.name}`);
    }

    console.log('\n🎉 Seeding complete! Total products:', PRODUCTS.length);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seed();
