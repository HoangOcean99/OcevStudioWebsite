"use client";

import { useAppStore } from "../store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SIZES = ["S", "M", "L", "XL"];

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, updateCartItemSize, updateCartItemQuantity, removeFromCart } = useAppStore();
  const router = useRouter();

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white dark:bg-zinc-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> 
                Your Cart
              </h2>
              <button 
                onClick={toggleCart}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                  <p>Your cart is empty.</p>
                  <p className="text-sm mt-2">Swipe right on outfits you like!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="flex gap-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 relative">
                      {/* Image */}
                      <div className="relative w-24 h-32 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start pr-6">
                          <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                          <p className="font-bold">${item.price.toFixed(2)}</p>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Size Selection */}
                        <div className="mt-auto pt-2">
                          <p className="text-xs text-gray-500 mb-1">Select Size:</p>
                          <div className="flex gap-2">
                            {SIZES.map(s => (
                              <button
                                key={s}
                                onClick={() => updateCartItemSize(item.cartItemId, s)}
                                className={`w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center border transition-all ${
                                  item.size === s 
                                    ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white" 
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-700"
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-3 mt-3">
                          <button 
                            onClick={() => updateCartItemQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-xl font-bold">${totalAmount.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => {
                    const missingSizes = cart.some(item => !item.size);
                    if (missingSizes) {
                      alert("Please select a size for all items before checking out.");
                      return;
                    }
                    toggleCart();
                    router.push("/checkout");
                  }}
                  className="w-full py-4 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                  Continue to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
