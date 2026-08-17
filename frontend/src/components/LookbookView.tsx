"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/productsData";
import { Search, Play, ShoppingBag } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";

interface LookbookViewProps {
  outfit: Product | undefined;
}

export default function LookbookView({ outfit }: LookbookViewProps) {
  const { setQuickViewProduct } = useAppStore();
  const { t } = useTranslation('common');

  if (!outfit) {
    return (
      <div className="text-center py-24 text-gray-500">
        Không tìm thấy trang phục Lookbook nào phù hợp.
      </div>
    );
  }

  // Lấy các sản phẩm lẻ trong bộ
  const items = outfit.bundleItems || [];
  const item1 = items[0];
  const item2 = items[1];
  const item3 = items[2];

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 mb-12">
      {/* LEFT COLUMN: Main Feature */}
      <div className="w-full lg:w-[35%] flex flex-col h-auto lg:h-[800px]">
        <div className="relative w-full h-[600px] lg:h-full rounded-2xl overflow-hidden bg-zinc-900 group">
          <Image
            src={outfit.imageUrl}
            alt={outfit.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-8 inset-x-6 flex flex-col items-center text-center text-white z-10">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-1">LOOKBOOK FEATURE:</h2>
            <h3 className="text-2xl font-light font-serif mb-6">{outfit.name}</h3>
            <button className="px-8 py-3 bg-white text-black font-bold rounded-full text-sm hover:scale-105 transition-transform w-full shadow-lg">
              MUA TRỌN BỘ
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Bento Box / Grid */}
      <div className="w-full lg:w-[65%] grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 h-auto lg:h-[800px] lg:overflow-y-auto scrollbar-none pb-4 lg:pb-10">
        
        {/* ROW 1 */}
        {/* Logo / Title Box */}
        <div className="col-span-1 md:col-span-1 h-[140px] rounded-2xl bg-[#0f1115] flex items-center justify-center border border-zinc-800 shadow-md">
          <h1 className="text-2xl font-light text-white tracking-tighter">OcevStudio</h1>
        </div>

        {/* Story Box */}
        <div className="col-span-1 md:col-span-2 row-span-1 h-[140px] rounded-2xl bg-white border border-gray-100 p-5 flex flex-col justify-center shadow-sm">
          <h3 className="text-sm font-bold text-black uppercase mb-2">CÂU CHUYỆN CHẤT LIỆU</h3>
          <div className="flex gap-4 items-center">
            <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0">
              <Image src="https://images.unsplash.com/photo-1596489370014-419b489a38ee?q=80&w=300&auto=format&fit=crop" alt="Fabric" fill className="object-cover" />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Công nghệ vải kỹ thuật số mô phỏng bề mặt chống nước tuyệt đối, kết hợp với sợi siêu nhẹ.
            </p>
          </div>
        </div>

        {/* ROW 2 */}
        {/* Item 1 Card */}
        {item1 && (
          <div className="col-span-1 md:col-span-1 h-[320px] relative rounded-2xl bg-zinc-900 overflow-hidden group border border-zinc-800 shadow-md">
            <Image src={item1.imageUrl} alt={item1.name} fill className="object-cover transition-opacity duration-500 group-hover:opacity-80" />
            <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[9px] uppercase border border-white/20 rounded-md">#GORE-TEX</div>

            <div className="absolute top-10 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[9px] text-white/80 cursor-pointer hover:bg-white hover:text-black transition-colors">
               <Search className="w-3 h-3" /> Thử Đồ AI
            </div>
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 to-transparent pt-12">
              <h4 className="text-white text-xs font-bold uppercase truncate">{item1.name}</h4>
              <p className="text-gray-400 text-xs">{item1.price.toLocaleString("vi-VN")} ₫</p>
            </div>
          </div>
        )}

        {/* Item 2 Card */}
        {item2 && (
          <div className="col-span-1 md:col-span-1 h-[320px] relative rounded-2xl bg-zinc-900 overflow-hidden group border border-zinc-800 shadow-md">
            <Image src={item2.imageUrl} alt={item2.name} fill className="object-cover transition-opacity duration-500 group-hover:opacity-80" />
            <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[9px] uppercase border border-white/20 rounded-md">#POCKETS</div>

            <div className="absolute top-10 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[9px] text-white/80 cursor-pointer hover:bg-white hover:text-black transition-colors">
               <Search className="w-3 h-3" /> Thử Đồ AI
            </div>
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 to-transparent pt-12">
              <h4 className="text-white text-xs font-bold uppercase truncate">{item2.name}</h4>
              <p className="text-gray-400 text-xs">{item2.price.toLocaleString("vi-VN")} ₫</p>
            </div>
          </div>
        )}

        {/* Item 3 Card */}
        {item3 ? (
          <div className="col-span-1 md:col-span-1 h-[320px] relative rounded-2xl bg-zinc-900 overflow-hidden group border border-zinc-800 shadow-md">
             <Image src={item3.imageUrl} alt={item3.name} fill className="object-cover transition-opacity duration-500 group-hover:opacity-80" />
            <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[9px] uppercase border border-white/20 rounded-md">#UTILITY</div>

            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 to-transparent pt-12">
              <h4 className="text-white text-xs font-bold uppercase truncate">{item3.name}</h4>
              <p className="text-gray-400 text-xs">{item3.price.toLocaleString("vi-VN")} ₫</p>
            </div>
          </div>
        ) : (
          <div className="col-span-1 md:col-span-1 h-[320px] flex flex-col justify-end">
            <button className="w-full py-4 bg-[#1a1c23] text-white font-bold rounded-2xl text-sm hover:bg-black transition-colors shadow-lg border border-zinc-800">
              MUA TRỌN BỘ
            </button>
          </div>
        )}

        {/* ROW 3 */}
        {/* Video Box */}
        <div className="col-span-1 md:col-span-2 h-[220px] rounded-2xl bg-zinc-50 border border-gray-100 p-4 flex flex-col justify-between shadow-sm">
           <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-zinc-900 mb-3 group cursor-pointer">
              <Image src={outfit.secondaryImageUrl || outfit.imageUrl} alt="Video Thumbnail" fill className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
                   <Play className="w-5 h-5 fill-white ml-1" />
                </div>
              </div>
           </div>
           <div>
             <h3 className="text-sm font-bold text-black uppercase mb-0.5">VIDEO PHỎNG VẤN</h3>
             <p className="text-[10px] text-gray-500 leading-snug line-clamp-2">
               Thám hiểm quá trình thiết kế đằng sau bộ sưu tập mới nhất với giám đốc sáng tạo. Khám phá vật liệu kỹ thuật số.
             </p>
           </div>
        </div>

        {/* Street Style Gallery */}
        <div className="col-span-1 md:col-span-1 h-[220px] flex flex-col justify-end">
           <h3 className="text-lg font-serif font-bold text-black mb-2 uppercase tracking-wide">STREET STYLE</h3>
           <div className="grid grid-cols-2 gap-2 h-full">
              <div className="relative rounded-xl overflow-hidden row-span-2 bg-gray-200">
                 <Image src={outfit.imageUrl} alt="Street style" fill className="object-cover grayscale hover:grayscale-0 transition-all" />
              </div>
              <div className="relative rounded-xl overflow-hidden bg-gray-200">
                 <Image src={item2?.imageUrl || outfit.imageUrl} alt="Street style" fill className="object-cover grayscale hover:grayscale-0 transition-all" />
              </div>
              <div className="relative rounded-xl overflow-hidden bg-gray-200">
                 <Image src={item1?.imageUrl || outfit.imageUrl} alt="Street style" fill className="object-cover grayscale hover:grayscale-0 transition-all" />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
