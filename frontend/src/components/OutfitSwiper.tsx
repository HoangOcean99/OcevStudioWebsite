"use client";

import { useState, useMemo } from "react";
import OutfitCard, { OutfitData } from "./OutfitCard";
import { useAppStore } from "../store/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";

export default function OutfitSwiper() {
  const { t } = useTranslation('swipe');
  const { products, addToCart, addPassedOutfit } = useAppStore();

  // Map real products to OutfitData format, shuffle for variety
  const initialOutfits = useMemo<OutfitData[]>(() => {
    const available = products.filter(p => p.isAvailable !== false);
    // Take up to 8 products
    const pool = available.slice(0, 8);
    return pool.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      description: p.description,
    }));
  }, [products]);

  const [outfits, setOutfits] = useState<OutfitData[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Sync once when products load
  if (!initialized && initialOutfits.length > 0) {
    setOutfits(initialOutfits);
    setInitialized(true);
  }

  const handleSwipe = (direction: "left" | "right", id: string) => {
    const outfit = outfits.find(o => o.id === id);
    if (direction === "right" && outfit) {
      addToCart(outfit);
    } else {
      addPassedOutfit(id);
    }
    setOutfits((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto h-[600px] relative">
      {outfits.length > 0 ? (
        outfits.map((outfit, index) => {
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
        <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50 dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-gray-300 dark:border-zinc-700">
          <h2 className="text-2xl font-semibold text-gray-500 mb-2">{t("allCaughtUp")}</h2>
          <p className="text-gray-400 text-center px-6">{t("checkBackLater")}</p>
          <button
            onClick={() => setOutfits(initialOutfits)}
            className="mt-6 px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            {t("resetDemo")}
          </button>
        </div>
      )}
    </div>
  );
}
