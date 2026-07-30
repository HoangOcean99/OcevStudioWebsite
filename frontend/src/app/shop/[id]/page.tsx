"use client";

import { useAppStore } from "@/store/useAppStore";
import { PRODUCTS_DATA, BundleItem } from "@/data/productsData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useState, use } from "react";
import { ShoppingBag, ArrowLeft, Star, Heart, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { notFound } from "next/navigation";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const { t } = useTranslation('productDetail');
  const { t: tCommon } = useTranslation('common');
  const { addToCart, toggleWishlist, isInWishlist } = useAppStore();
  
  const product = PRODUCTS_DATA.find(p => p.id === id);
  
  if (!product) {
    return notFound();
  }

  const isFavorite = isInWishlist(product.id);
  const [mainSize, setMainSize] = useState<string>(product.sizes[0] || "M");
  const [bundleSizes, setBundleSizes] = useState<Record<string, string>>({});
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [addedBundleSuccess, setAddedBundleSuccess] = useState(false);
  
  // Calculate original total of items if bundle
  const bundleItemsTotal = product.bundleItems?.reduce((sum, item) => sum + item.price, 0) || 0;
  const isCombo = !!product.bundleItems && product.bundleItems.length > 0;

  const handleAddBundleToCart = () => {
    // Add each bundle item to cart
    product.bundleItems?.forEach(item => {
      // Calculate a discounted price proportionally if needed, or we just add them at full price
      // and let the cart figure out discounts. 
      // For simplicity in Option B, we can add them at their original price,
      // and maybe the cart logic will group them.
      // Alternatively, we just add the individual items.
      const size = bundleSizes[item.id] || item.sizes[0] || "M";
      addToCart({
        id: item.id,
        name: `${product.name} - ${item.name}`,
        price: item.price * (product.price / bundleItemsTotal), // Apply combo discount ratio
        imageUrl: item.imageUrl,
        description: `Part of ${product.name} combo`,
      }, size);
    });
    
    setAddedBundleSuccess(true);
    setTimeout(() => setAddedBundleSuccess(false), 2000);
  };

  const handleAddSingleItem = (item: BundleItem) => {
    const size = bundleSizes[item.id] || item.sizes[0] || "M";
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      description: `Individual piece from ${product.name}`,
    }, size);
    // Could add local feedback here
  };
  
  const handleAddMainProduct = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      description: product.description,
    }, mainSize);
    
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back Link */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {tCommon("back")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="relative w-full aspect-[4/5] bg-gray-100 dark:bg-zinc-900 rounded-3xl overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md text-gray-700 dark:text-white hover:scale-110 active:scale-95 transition-all shadow-lg z-10"
              >
                <Heart className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">
              <span>{product.category}</span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-gray-700 dark:text-gray-300 font-bold">{product.rating}</span>
                <span className="text-gray-400">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {(product.originalPrice || bundleItemsTotal > product.price) && (
                <span className="text-lg text-gray-400 line-through font-medium">
                  ${(product.originalPrice || bundleItemsTotal).toFixed(2)}
                </span>
              )}
              {isCombo && (
                <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-lg ml-2">
                  Combo Saving
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* If not a combo, show normal add to cart */}
            {!isCombo && (
              <div className="mb-8 p-6 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-gray-100 dark:border-zinc-800">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{t("selectSize")}</h3>
                <div className="flex gap-2 mb-6">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setMainSize(s)}
                      className={`w-12 h-12 rounded-xl text-sm font-bold flex items-center justify-center border-2 transition-all ${
                        mainSize === s
                          ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                          : "border-gray-200 bg-white text-gray-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAddMainProduct}
                  className={`w-full py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    addedSuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-black text-white dark:bg-white dark:text-black hover:scale-[1.02]"
                  }`}
                >
                  {addedSuccess ? (
                    <><Check className="w-5 h-5" /> Added to Cart</>
                  ) : (
                    <><ShoppingBag className="w-5 h-5" /> {t("addToCart")}</>
                  )}
                </button>
              </div>
            )}

            {/* Combo Items Section */}
            {isCombo && (
              <div className="space-y-6">
                
                {/* Buy Combo Action */}
                <div className="p-6 bg-orange-50 dark:bg-orange-950/20 rounded-3xl border border-orange-200 dark:border-orange-900/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-black text-lg text-orange-900 dark:text-orange-100">{t("buyCompleteSet")}</h3>
                      <p className="text-xs text-orange-700/70 dark:text-orange-300/70">{t("totalBundlePrice")}: ${product.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={handleAddBundleToCart}
                      className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        addedBundleSuccess
                          ? "bg-emerald-600 text-white"
                          : "bg-orange-600 text-white hover:bg-orange-700 hover:scale-[1.02] shadow-lg shadow-orange-500/30"
                      }`}
                    >
                      {addedBundleSuccess ? (
                        <><Check className="w-4 h-4" /> Added</>
                      ) : (
                        <><ShoppingBag className="w-4 h-4" /> {t("addBundleToCart")}</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{t("includedInSet")}</h3>
                  <div className="space-y-4">
                    {product.bundleItems?.map(item => (
                      <div key={item.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-zinc-800">
                        <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-white dark:bg-black flex-shrink-0">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-gray-500 font-semibold mt-0.5">${item.price.toFixed(2)}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2 gap-2">
                            {/* Size selector for individual item */}
                            <div className="flex gap-1">
                              {item.sizes.map(s => {
                                const selected = (bundleSizes[item.id] || item.sizes[0] || "M") === s;
                                return (
                                  <button
                                    key={s}
                                    onClick={() => setBundleSizes(prev => ({...prev, [item.id]: s}))}
                                    className={`w-7 h-7 rounded-lg text-[10px] font-bold flex items-center justify-center border transition-all ${
                                      selected
                                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                                        : "border-gray-200 bg-white text-gray-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300"
                                    }`}
                                  >
                                    {s}
                                  </button>
                                );
                              })}
                            </div>
                            
                            <button
                              onClick={() => handleAddSingleItem(item)}
                              className="px-3 py-1.5 bg-white border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 text-xs font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                            >
                              {t("addToCart")}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
