"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { X, Heart, Info } from "lucide-react";
import { useState, useEffect } from "react";

export interface OutfitData {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

interface OutfitCardProps {
  outfit: OutfitData;
  active: boolean;
  onSwipe: (direction: "left" | "right", id: string) => void;
  zIndex: number;
}

export default function OutfitCard({ outfit, active, onSwipe, zIndex }: OutfitCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Threshholds for determining a swipe
  const swipeThreshold = 100;

  const handleDragEnd = (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > swipeThreshold || velocity > 500) {
      animate(x, 500, { duration: 0.3 });
      setTimeout(() => onSwipe("right", outfit.id), 300);
    } else if (offset < -swipeThreshold || velocity < -500) {
      animate(x, -500, { duration: 0.3 });
      setTimeout(() => onSwipe("left", outfit.id), 300);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
    }
  };

  const handleButtonSwipe = (direction: "left" | "right") => {
    const val = direction === "right" ? 500 : -500;
    animate(x, val, { duration: 0.3 });
    setTimeout(() => onSwipe(direction, outfit.id), 300);
  };

  return (
    <motion.div
      className="absolute inset-0 w-full h-full"
      style={{
        x,
        rotate,
        opacity,
        zIndex,
      }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={active ? { scale: 0.98 } : {}}
      initial={{ scale: 0.9, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-100">
        {/* Image Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${outfit.imageUrl})` }}
        >
          {/* Overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-1 shadow-sm">{outfit.name}</h2>
              <p className="text-lg font-medium opacity-90">{outfit.price.toLocaleString("vi-VN")} ₫</p>
            </div>
            <button className="p-3 bg-white/20 backdrop-blur-md rounded-full pointer-events-auto hover:bg-white/30 transition-colors">
              <Info className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-sm opacity-80 line-clamp-2">{outfit.description}</p>
        </div>

        {/* Swipe Buttons Overlay (only visible on top card) */}
        {active && (
          <div className="absolute bottom-28 left-0 right-0 flex justify-center gap-6 px-6 pointer-events-none">
            <button
              onClick={() => handleButtonSwipe("left")}
              className="pointer-events-auto p-4 bg-white rounded-full shadow-lg text-red-500 hover:scale-110 hover:bg-red-50 transition-all active:scale-95"
            >
              <X className="w-8 h-8" />
            </button>
            <button
              onClick={() => handleButtonSwipe("right")}
              className="pointer-events-auto p-4 bg-white rounded-full shadow-lg text-green-500 hover:scale-110 hover:bg-green-50 transition-all active:scale-95"
            >
              <Heart className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
