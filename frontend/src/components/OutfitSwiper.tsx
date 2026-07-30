"use client";

import { useState } from "react";
import OutfitCard, { OutfitData } from "./OutfitCard";

// Mock data to test the UI before connecting to the backend
const MOCK_OUTFITS: OutfitData[] = [
  {
    id: "1",
    name: "Urban Streetwear Set",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop",
    description: "A perfect blend of comfort and style for your daily city adventures. Features an oversized hoodie and cargo pants.",
  },
  {
    id: "2",
    name: "Summer Floral Dress",
    price: 89.50,
    imageUrl: "https://images.unsplash.com/photo-1515347619362-67fd3b762510?q=80&w=1000&auto=format&fit=crop",
    description: "Lightweight and breathable fabric with vibrant floral patterns. Perfect for beach days or casual outings.",
  },
  {
    id: "3",
    name: "Classic Denim Jacket",
    price: 145.00,
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop",
    description: "Timeless vintage wash denim jacket. A versatile layering piece for any season.",
  },
  {
    id: "4",
    name: "Minimalist Knit Sweater",
    price: 95.00,
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop",
    description: "Cozy wool-blend sweater in neutral tones. Offers warmth without compromising on elegance.",
  }
];

import { useAppStore } from "../store/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";

export default function OutfitSwiper() {
  const { t } = useTranslation('swipe');
  const [outfits, setOutfits] = useState<OutfitData[]>(MOCK_OUTFITS);
  const addToCart = useAppStore((state) => state.addToCart);
  const addPassedOutfit = useAppStore((state) => state.addPassedOutfit);

  const handleSwipe = (direction: "left" | "right", id: string) => {
    const outfit = outfits.find(o => o.id === id);
    if (direction === "right" && outfit) {
      addToCart(outfit);
    } else {
      addPassedOutfit(id);
    }
    
    // Remove the outfit from the stack after swipe
    setOutfits((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto h-[600px] relative">
      {outfits.length > 0 ? (
        outfits.map((outfit, index) => {
          // Determine if this is the top card
          const isTop = index === outfits.length - 1;
          
          return (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              active={isTop}
              onSwipe={handleSwipe}
              zIndex={index}
            />
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300">
          <h2 className="text-2xl font-semibold text-gray-500 mb-2">{t("allCaughtUp")}</h2>
          <p className="text-gray-400 text-center px-6">{t("checkBackLater")}</p>
          <button 
            onClick={() => setOutfits(MOCK_OUTFITS)}
            className="mt-6 px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            {t("resetDemo")}
          </button>
        </div>
      )}
    </div>
  );
}
