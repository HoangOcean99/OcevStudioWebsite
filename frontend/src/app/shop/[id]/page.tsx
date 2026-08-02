"use client";

import { useAppStore } from "@/store/useAppStore";
import { BundleItem } from "@/data/productsData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useState, use, useEffect } from "react";
import { ShoppingBag, ArrowLeft, Star, Heart, Check, Sparkles, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { notFound } from "next/navigation";

// Helper to ensure URL is valid for Next.js Image
const getValidImageUrl = (url: string | undefined): string => {
  if (!url) return "https://placehold.co/400x500/eeeeee/999999?text=No+Image";
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    return url;
  }
  return "https://placehold.co/400x500/eeeeee/999999?text=Invalid+URL";
};

// Reusable modern image slider
const ImageSlider = ({ images, altPrefix }: { images: string[], altPrefix: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length <= 1) {
    return (
      <Image
        src={getValidImageUrl(images[0])}
        alt={`${altPrefix}`}
        fill
        className="object-cover"
        priority
      />
    );
  }

  return (
    <div className="relative w-full h-full group/slider">
      <Image
        src={getValidImageUrl(images[currentIndex])}
        alt={`${altPrefix} - ${currentIndex + 1}`}
        fill
        className="object-cover transition-opacity duration-300"
        priority={currentIndex === 0}
      />

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/70 dark:bg-black/70 hover:bg-white dark:hover:bg-black backdrop-blur-md rounded-full shadow-md text-gray-800 dark:text-white opacity-0 group-hover/slider:opacity-100 transition-all z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/70 dark:bg-black/70 hover:bg-white dark:hover:bg-black backdrop-blur-md rounded-full shadow-md text-gray-800 dark:text-white opacity-0 group-hover/slider:opacity-100 transition-all z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-10">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`w-1.5 h-1.5 rounded-full backdrop-blur-sm transition-all duration-300 ${idx === currentIndex ? 'bg-black dark:bg-white scale-125' : 'bg-black/30 dark:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { t } = useTranslation('productDetail');
  const { t: tCommon } = useTranslation('common');
  const { addToCart, toggleWishlist, isInWishlist, products, isLoadingProducts } = useAppStore();

  const product = products.find(p => p.id === id);

  const isFavorite = product ? isInWishlist(product.id) : false;
  const [mainSize, setMainSize] = useState<string>("M");
  const [bundleSizes, setBundleSizes] = useState<Record<string, string>>({});
  const [selectedCustomItems, setSelectedCustomItems] = useState<string[]>([]);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [addedBundleSuccess, setAddedBundleSuccess] = useState(false);
  const [addedCustomBundleSuccess, setAddedCustomBundleSuccess] = useState(false);
  const [selectedColor, setSelectedColor] = useState<{ name: string, hex: string } | null>(null);

  // Initialize selected color
  useEffect(() => {
    if (product?.colors?.length && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
  }, [product, selectedColor]);

  // Calculate original total of items if bundle
  const bundleItemsTotal = product?.bundleItems?.reduce((sum, item) => sum + (item.price || 0), 0) || 0;
  const isCombo = !!product?.bundleItems && product.bundleItems.length > 0;
  const safePrice = product?.price > 0 ? product.price : (isCombo ? bundleItemsTotal * 0.8 : 0);

  // Custom Bundle calculations
  const selectedCustomItemsData = product?.bundleItems?.filter(i => selectedCustomItems.includes(i.id)) || [];
  const customItemsBaseTotal = selectedCustomItemsData.reduce((sum, item) => sum + (item.price || 0), 0);
  const customItemsCount = selectedCustomItems.length;
  // Discount rules: 2 items = 10%, 3 items = 15%, 4+ items = 20%
  const customDiscountPercent = customItemsCount >= 4 ? 0.20 : customItemsCount === 3 ? 0.15 : customItemsCount === 2 ? 0.10 : 0;
  const customDiscountAmount = customItemsBaseTotal * customDiscountPercent;
  const customFinalTotal = customItemsBaseTotal - customDiscountAmount;

  const toggleCustomItem = (id: string) => {
    setSelectedCustomItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  if (isLoadingProducts) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  const handleAddBundleToCart = () => {
    // Add each bundle item to cart
    product.bundleItems?.forEach(item => {
      const size = bundleSizes[item.id] || item.sizes?.[0] || "No Size";
      const finalImage = (selectedColor && item.colorImages) ? (item.colorImages[selectedColor.name] || item.imageUrl) : item.imageUrl;
      addToCart({
        id: item.id,
        name: `${product.name} - ${item.name} (${selectedColor?.name || ''})`,
        price: (item.price || 0) * (safePrice / (bundleItemsTotal || 1)), // Apply combo discount ratio
        imageUrl: finalImage,
        description: `Part of ${product.name} combo`,
      }, size);
    });

    setAddedBundleSuccess(true);
    setTimeout(() => setAddedBundleSuccess(false), 2000);
  };

  const handleAddSingleItem = (item: BundleItem) => {
    const size = bundleSizes[item.id] || item.sizes?.[0] || "No Size";
    const finalImage = (selectedColor && item.colorImages) ? (item.colorImages[selectedColor.name] || item.imageUrl) : item.imageUrl;
    addToCart({
      id: item.id,
      name: `${item.name} (${selectedColor?.name || ''})`,
      price: item.price || 0,
      imageUrl: finalImage,
      description: item.description || "Premium quality item",
    }, size);
    toggleCart();
  };

  const handleAddMainProduct = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: safePrice,
      imageUrl: product.imageUrl,
      description: product.description,
    }, mainSize);

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleAddCustomBundleToCart = () => {
    if (selectedCustomItems.length === 0) return;

    selectedCustomItemsData.forEach(item => {
      const size = bundleSizes[item.id] || item.sizes?.[0] || "No Size";
      const finalImage = (selectedColor && item.colorImages) ? (item.colorImages[selectedColor.name] || item.imageUrl) : item.imageUrl;
      // Convert arrays back to single image if needed
      const validImage = Array.isArray(finalImage) ? finalImage[0] : finalImage;

      addToCart({
        id: item.id + '-custom',
        name: `${item.name} (${selectedColor?.name || ''})`,
        price: (item.price || 0) * (1 - customDiscountPercent),
        imageUrl: validImage,
        description: item.description || "Custom selection",
      }, size);
    });

    setAddedCustomBundleSuccess(true);
    setTimeout(() => {
      setAddedCustomBundleSuccess(false);
      setSelectedCustomItems([]);
    }, 2000);
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
            <div className="relative w-full aspect-[4/5] bg-gray-100 dark:bg-zinc-900 rounded-3xl overflow-hidden group">

              {/* Main Product Image Slider */}
              <ImageSlider
                images={product.images && product.images.length > 0 ? product.images : [product.imageUrl]}
                altPrefix={product.name || "Product"}
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
                <span className="text-gray-400">({product.reviewsCount} đánh giá)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                ${safePrice.toFixed(2)}
              </span>
              {(product.originalPrice || bundleItemsTotal > safePrice) && (
                <span className="text-lg text-gray-400 line-through font-medium">
                  ${(product.originalPrice || bundleItemsTotal).toFixed(2)}
                </span>
              )}
              {isCombo && (
                <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-lg ml-2">
                  Tiết Kiệm Combo
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Color</h3>
                <div className="flex gap-3">
                  {product.colors.map(color => {
                    const isSelected = selectedColor?.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        title={color.name}
                        className={`group relative flex items-center justify-center w-12 h-12 rounded-full transition-all ${isSelected
                          ? "border-2 border-gray-900 dark:border-white scale-110"
                          : "border-2 border-transparent hover:border-gray-300 dark:hover:border-zinc-600"
                          }`}
                      >
                        <div
                          className="w-9 h-9 rounded-full border border-gray-300 dark:border-zinc-700 shadow-inner group-hover:shadow-md transition-shadow"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
                {selectedColor && (
                  <p className="text-xs font-semibold mt-2 text-gray-500">{selectedColor.name}</p>
                )}
              </div>
            )}

            {/* Buy Complete Set Button for Top Right */}
            {isCombo && (
              <div className="mb-8 p-6 bg-orange-50 dark:bg-orange-950/20 rounded-3xl border border-orange-200 dark:border-orange-900/50">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-black text-lg text-orange-900 dark:text-orange-100">{t("buyCompleteSet")}</h3>
                    <p className="text-xs text-orange-700/70 dark:text-orange-300/70">{t("totalBundlePrice")}: ${safePrice.toFixed(2)} (Save 20%)</p>
                  </div>

                  {/* Size Selectors for Complete Set */}
                  <div className="flex flex-col gap-3 py-2 border-y border-orange-200/50 dark:border-orange-900/30">
                    <p className="text-[10px] font-bold text-orange-800 dark:text-orange-200 uppercase tracking-wider">Chọn Kích Thước Cho Từng Món:</p>
                    {product.bundleItems?.filter(item => item.hasSize !== false).map(item => {
                      const itemSizes = item.sizes?.length ? item.sizes : ['S', 'M', 'L', 'XL'];
                      return (
                        <div key={`top-${item.id}`} className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-orange-900/80 dark:text-orange-100/80 truncate max-w-[140px]">{item.name}</span>
                          <div className="flex gap-1">
                            {itemSizes.map(s => {
                              const selected = (bundleSizes[item.id] || itemSizes[0]) === s;
                              return (
                                <button
                                  key={s}
                                  onClick={() => setBundleSizes(prev => ({ ...prev, [item.id]: s }))}
                                  className={`w-7 h-7 rounded-lg text-[10px] font-bold flex items-center justify-center border transition-all ${
                                    selected
                                      ? "border-orange-600 bg-orange-600 text-white dark:border-orange-500 dark:bg-orange-500 shadow-sm"
                                      : "border-orange-200 bg-orange-50/50 text-orange-700 hover:bg-orange-100 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-300"
                                  }`}
                                >
                                  {s}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleAddBundleToCart}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-black text-sm uppercase tracking-wider transition-all shadow-xl
                      ${addedBundleSuccess 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white hover:scale-[1.02] active:scale-95'
                      }`}
                  >
                    {addedBundleSuccess ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                    {addedBundleSuccess ? t("added") : t("addCompleteSet")}
                  </button>
                </div>
              </div>
            )}

            {/* Bouncing Scroll Down Button */}
            {isCombo && (
              <button 
                onClick={() => {
                  document.getElementById('custom-bundle-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex flex-col items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-800 transition-colors py-4 opacity-80 hover:opacity-100 group"
              >
                <span>Khám phá các món lẻ</span>
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </button>
            )}

            {/* If not a combo, show normal add to cart */}
            {!isCombo && (
              <div className="mb-8 p-6 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-gray-100 dark:border-zinc-800">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{t("selectSize")}</h3>
                <div className="flex gap-2 mb-6">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setMainSize(s)}
                      className={`w-12 h-12 rounded-xl text-sm font-bold flex items-center justify-center border-2 transition-all ${mainSize === s
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
                  className={`w-full py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${addedSuccess
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

            {/* Old Combo Action Box was removed */}
          </div>
        </div>

        {/* Custom Bundle Builder Section (Moved out of right column) */}
        {isCombo && (
          <div id="custom-bundle-section" className="mt-20 pt-10 border-t border-gray-100 dark:border-zinc-900">
            <div className="mb-10 text-center sm:text-left flex flex-col lg:flex-row items-center justify-between gap-6 bg-gray-50 dark:bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800">
              <div className="flex-1">
                <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-4">
                  Mua Lẻ Từng Món
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">Các Món Trong Bộ Này</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm mb-1">Bạn có thể chọn mua riêng lẻ từng phụ kiện hoặc tự ghép thành một combo mới.</p>
                <p className="text-indigo-600 dark:text-indigo-400 max-w-2xl text-[11px] font-bold italic">* Mẹo: Tích chọn càng nhiều món ở dưới, tính giá giảm càng sâu (lên đến 20%)!</p>
              </div>

              {/* Custom Bundle Action Button */}
              <div className="flex flex-col items-center lg:items-end w-full lg:w-auto bg-white dark:bg-black p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                <div className="flex items-end gap-3 mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tổng cộng</p>
                  <span className="text-3xl font-black text-gray-900 dark:text-white">${customFinalTotal.toFixed(2)}</span>
                  {customDiscountAmount > 0 && (
                    <span className="text-sm font-bold text-green-500 line-through mb-1">${customItemsBaseTotal.toFixed(2)}</span>
                  )}
                </div>
                {customDiscountPercent > 0 && (
                  <p className="text-xs font-black text-green-500 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                    Đã Áp Dụng Giảm {customDiscountPercent * 100}%!
                  </p>
                )}
                <button
                  onClick={handleAddCustomBundleToCart}
                  disabled={selectedCustomItems.length === 0}
                  className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-xl min-w-[220px]
                    ${addedCustomBundleSuccess
                      ? 'bg-green-500 text-white'
                      : selectedCustomItems.length === 0
                        ? 'bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105 active:scale-95'
                    }`}
                >
                  {addedCustomBundleSuccess ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  {addedCustomBundleSuccess ? "Đã Thêm Vào Giỏ!" : `Thêm ${customItemsCount} Món Đã Chọn`}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {product.bundleItems?.map(item => {
                const finalImagesData = (selectedColor && item.colorImages) ? item.colorImages[selectedColor.name] : null;
                const itemImages = Array.isArray(finalImagesData) ? finalImagesData : [finalImagesData || item.imageUrl];

                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-col sm:flex-row bg-white dark:bg-zinc-900/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)] border border-gray-100 dark:border-zinc-800/60 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image Section (Carousel) */}
                    <div className="relative w-full sm:w-2/5 aspect-[4/5] sm:aspect-[2/3] bg-gray-100 dark:bg-zinc-950 overflow-hidden flex-shrink-0">
                      <div className="absolute inset-0">
                        <ImageSlider
                          images={itemImages}
                          altPrefix={item.name || "Bundle Item"}
                        />
                      </div>

                      {/* Price Tag Overlay */}
                      <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 z-20">
                        <span className="text-sm font-black text-gray-900 dark:text-white">${item.price.toFixed(2)}</span>
                      </div>

                      {/* Selection Checkbox Overlay */}
                      <button
                        onClick={() => toggleCustomItem(item.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md shadow-lg border-2 flex items-center justify-center transition-all z-20 hover:scale-110 active:scale-95"
                        style={{ borderColor: selectedCustomItems.includes(item.id) ? '#4f46e5' : 'transparent' }}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${selectedCustomItems.includes(item.id) ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-zinc-800'}`}>
                          {selectedCustomItems.includes(item.id) && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-1 bg-white dark:bg-zinc-900/80">
                      <div>
                        {item.type && (
                          <span className="inline-block px-2 py-1 mb-3 text-[10px] font-black uppercase bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-lg tracking-widest">{item.type}</span>
                        )}
                        <h4 className="font-bold text-lg mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{item.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed whitespace-pre-wrap">{item.description}</p>
                      </div>

                      <div className="mt-auto space-y-4">
                        {/* Size selector */}
                        {item.hasSize !== false && (
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Chọn Kích Thước</p>
                            <div className="flex gap-1.5 flex-wrap">
                              {(item.sizes?.length ? item.sizes : ['S', 'M', 'L', 'XL']).map(s => {
                                const selected = (bundleSizes[item.id] || (item.sizes?.length ? item.sizes[0] : 'S')) === s;
                                return (
                                  <button
                                    key={s}
                                    onClick={() => setBundleSizes(prev => ({ ...prev, [item.id]: s }))}
                                    className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center border-2 transition-all ${selected
                                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-md scale-105"
                                      : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-gray-400 dark:hover:border-zinc-600 hover:bg-white dark:hover:bg-zinc-800"
                                      }`}
                                  >
                                    {s}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Selection Toggle Button */}
                        <button
                          onClick={() => toggleCustomItem(item.id)}
                          className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-sm border-2 mt-2 ${selectedCustomItems.includes(item.id)
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                            : 'border-transparent bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                          {selectedCustomItems.includes(item.id) ? (
                            <><Check className="w-4 h-4" /> Đã Chọn</>
                          ) : (
                            <>Chọn Vào Combo</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
