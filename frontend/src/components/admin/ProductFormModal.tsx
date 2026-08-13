"use client";
import { useState, useEffect } from "react";
import { X, Loader2, Plus, Trash2, Package, Layers } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";
import ImageUploader from "./ImageUploader";

export interface AdminProduct {
  _id?: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  imageUrl?: string;
  secondaryImageUrl?: string;
  description?: string;
  badge?: string;
  sizes?: string[];
  sourceLink?: string;
  isAvailable?: boolean;
  bundleItems?: any[];
  colorThemes?: any[];
}

interface ProductFormModalProps {
  open: boolean;
  initial: AdminProduct | null;
  onClose: () => void;
}

const CATEGORIES = ["đồ nam", "đồ nữ", "đồ đôi"];
const BADGES = ["NEW", "HOT", "SALE", "LIMITED", "BESTSELLER"];

const inputClass =
  "w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors";

const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5";

const generateObjectId = () => {
  const timestamp = (Math.floor(new Date().getTime() / 1000)).toString(16);
  const objectId = timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
      return (Math.floor(Math.random() * 16)).toString(16);
  }).toLowerCase();
  return objectId;
};

export default function ProductFormModal({ open, initial, onClose }: ProductFormModalProps) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    _id: "",
    name: "",
    category: "đồ nam",
    price: "",
    originalPrice: "",
    stock: "",
    imageUrl: "",
    description: "",
    sizes: "",
    sourceLink: "",
    badge: "",
    isAvailable: true,
  });
  const [advancedMode, setAdvancedMode] = useState(false);
  const [bundleItems, setBundleItems] = useState<any[]>([]);
  const [colorThemes, setColorThemes] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      setForm({
        _id: initial?._id || generateObjectId(),
        name: initial?.name || "",
        category: initial?.category || "đồ nam",
        price: initial?.price != null ? String(initial.price) : "",
        originalPrice: initial?.originalPrice != null ? String(initial.originalPrice) : "",
        stock: initial?.stock != null ? String(initial.stock) : "",
        imageUrl: initial?.imageUrl || "",
        description: initial?.description || "",
        sizes: (initial?.sizes || []).join(", "),
        sourceLink: initial?.sourceLink || "",
        badge: initial?.badge || "",
        isAvailable: initial?.isAvailable !== false,
      });
      setBundleItems(initial?.bundleItems || []);
      setColorThemes(initial?.colorThemes || []);
      setAdvancedMode(Boolean(initial?.bundleItems?.length || initial?.colorThemes?.length));
    } else {
      setBundleItems([]);
      setColorThemes([]);
      setAdvancedMode(false);
    }
  }, [open, initial]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }
    let finalImageUrl = form.imageUrl.trim();
    if (advancedMode && !finalImageUrl && colorThemes.length > 0 && colorThemes[0].images?.length > 0) {
      finalImageUrl = colorThemes[0].images[0];
    }

    if (!finalImageUrl) {
      toast.error("Vui lòng nhập URL hình ảnh (hoặc thêm ảnh vào Bản phối)");
      return;
    }

    const payload: any = {
      _id: form._id,
      name: form.name.trim(),
      category: form.category,
      price: form.price !== "" ? Number(form.price) : 0,
      originalPrice: form.originalPrice !== "" ? Number(form.originalPrice) : undefined,
      stock: form.stock !== "" ? Number(form.stock) : 0,
      imageUrl: finalImageUrl,
      description: form.description.trim(),
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      sourceLink: form.sourceLink.trim() || undefined,
      badge: form.badge || undefined,
      isAvailable: form.isAvailable,
    };

    if (advancedMode) {
      payload.bundleItems = bundleItems.map(item => ({
        ...item,
        sizes: Array.isArray(item.sizes) 
          ? item.sizes 
          : typeof item.sizes === 'string'
            ? item.sizes.split(",").map((s: string) => s.trim()).filter(Boolean)
            : []
      }));
      payload.colorThemes = colorThemes;
    }

    setSaving(true);
    try {
      if (initial?._id) {
        await api.put(`/products/${initial._id}`, payload);
        toast.success("Đã cập nhật sản phẩm");
      } else {
        await api.post("/products", payload);
        toast.success("Đã thêm sản phẩm mới");
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lưu sản phẩm thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-2xl w-full ${advancedMode ? 'max-w-[85vw]' : 'max-w-2xl'} max-h-[95vh] overflow-y-auto transition-all duration-300`}>
        <div className="sticky top-0 z-10 bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white">
            {initial ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm"}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className={`grid gap-8 ${advancedMode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            
            {/* Left Column: Basic Info & Color Themes */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Tên sản phẩm *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Urban Ninja Complete Set" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Danh mục *</label>
                  <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Huy hiệu</label>
                  <select name="badge" value={form.badge} onChange={handleChange} className={inputClass}>
                    <option value="">- Không -</option>
                    {BADGES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Giá bán (VNĐ) *</label>
                  <input type="number" min="0" step="0.01" name="price" value={form.price} onChange={handleChange} placeholder="219.00" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Giá gốc (VNĐ)</label>
                  <input type="number" min="0" step="0.01" name="originalPrice" value={form.originalPrice} onChange={handleChange} placeholder="303.00" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Tồn kho</label>
                  <input type="number" min="0" name="stock" value={form.stock} onChange={handleChange} placeholder="50" className={inputClass} />
                </div>

                {!advancedMode && (
                  <div>
                    <label className={labelClass}>Size (phân cách dấu phẩy)</label>
                    <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="S, M, L, XL" className={inputClass} />
                  </div>
                )}

                {!advancedMode && (
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Link gốc sản phẩm (Nguồn mua)</label>
                    <input name="sourceLink" value={form.sourceLink} onChange={handleChange} placeholder="https://..." className={inputClass} />
                  </div>
                )}

                {!advancedMode && (
                  <div className="sm:col-span-2">
                    <ImageUploader 
                      folder={`OcevProduct/${form._id}`}
                      label="Hình ảnh chính (Đại diện) *"
                      value={form.imageUrl}
                      onChange={(url) => setForm({ ...form, imageUrl: url })}
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className={labelClass}>Mô tả</label>
                  <textarea rows={3} name="description" value={form.description} onChange={handleChange} placeholder="Mô tả ngắn về sản phẩm..." className={inputClass} />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={form.isAvailable}
                    onChange={handleChange}
                    className="w-4 h-4 accent-black dark:accent-white"
                  />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sản phẩm đang được bán</label>
                </div>
                
                {/* Advanced Mode Toggle */}
                <div className="sm:col-span-2 flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Chế độ nâng cao (Combo)</p>
                    <p className="text-xs text-gray-500 mt-0.5">Xây dựng trang phục nhiều mảnh với giao diện trực quan.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdvancedMode(!advancedMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      advancedMode ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-zinc-700"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-black transition-transform ${advancedMode ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>

              {/* Color Themes Builder (Left Column, below basic info) */}
              {advancedMode && (
                <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold flex items-center gap-2"><Layers className="w-4 h-4"/> Các Bản Phối (Color Themes)</h3>
                    <button type="button" onClick={() => setColorThemes([...colorThemes, { name: "", description: "", previewHex: "#000000", itemColors: {} }])} className="text-xs font-bold bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-zinc-700"><Plus className="w-3 h-3"/> Thêm Bản Phối</button>
                  </div>
                  <div className="space-y-4">
                    {colorThemes.map((theme, index) => (
                      <div key={index} className="p-4 bg-gray-50/50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-xl relative">
                        <button type="button" onClick={() => setColorThemes(colorThemes.filter((_, i) => i !== index))} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-1.5 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                        <div className="grid grid-cols-2 gap-4 pr-10">
                          <div>
                            <label className={labelClass}>Tên Bản Phối</label>
                            <input value={theme.name} onChange={e => { const newThemes = [...colorThemes]; newThemes[index].name = e.target.value; setColorThemes(newThemes); }} placeholder="Stealth Black" className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>Màu Đại Diện (HEX)</label>
                            <div className="flex gap-2">
                              <input type="color" value={theme.previewHex || "#000000"} onChange={e => { const newThemes = [...colorThemes]; newThemes[index].previewHex = e.target.value; setColorThemes(newThemes); }} className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 dark:border-zinc-700 p-0.5" />
                              <input value={theme.previewHex || ""} onChange={e => { const newThemes = [...colorThemes]; newThemes[index].previewHex = e.target.value; setColorThemes(newThemes); }} className={inputClass} />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <label className={labelClass}>Mô tả</label>
                            <input value={theme.description} onChange={e => { const newThemes = [...colorThemes]; newThemes[index].description = e.target.value; setColorThemes(newThemes); }} className={inputClass} />
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center justify-between mb-2">
                              <label className={labelClass}>Các URL Hình Ảnh (Ảnh của Bản Phối)</label>
                              <button type="button" onClick={() => {
                                const newThemes = [...colorThemes];
                                if (!newThemes[index].images) newThemes[index].images = [];
                                newThemes[index].images.push("");
                                setColorThemes(newThemes);
                              }} className="text-[10px] font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"><Plus className="w-3 h-3"/> Thêm Ảnh</button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {theme.images?.map((imgUrl: string, imgIdx: number) => (
                                <ImageUploader 
                                  key={imgIdx}
                                  folder={`OcevProduct/${form._id}`}
                                  label={`Ảnh ${imgIdx + 1}`}
                                  value={imgUrl}
                                  onChange={(url, isDeleted) => { 
                                    const newThemes = [...colorThemes]; 
                                    if (isDeleted) {
                                      newThemes[index].images = newThemes[index].images.filter((_:any, i:number) => i !== imgIdx);
                                    } else {
                                      newThemes[index].images[imgIdx] = url; 
                                    }
                                    setColorThemes(newThemes); 
                                  }}
                                />
                              ))}
                              {(!theme.images || theme.images.length === 0) && <p className="col-span-full text-[11px] text-gray-400 italic">Chưa có ảnh nào.</p>}
                            </div>
                          </div>
                          
                          <div className="col-span-2 mt-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
                            <label className={labelClass}>Gán màu cho các món đồ (Item Colors)</label>
                            <div className="space-y-3 mt-2">
                              {bundleItems.map(item => {
                                if (!item.id) return null;
                                const currentMapping = theme.itemColors?.[item.id];
                                return (
                                  <div key={item.id} className="flex items-center justify-between bg-white dark:bg-zinc-950 p-3 rounded-lg border border-gray-100 dark:border-zinc-800 shadow-sm">
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-gray-900 dark:text-white">{item.name || item.id}</span>
                                      <span className="text-[10px] text-gray-500 font-mono">{item.id}</span>
                                    </div>
                                    <select
                                      value={currentMapping?.name || ""}
                                      onChange={e => {
                                        const selectedColorName = e.target.value;
                                        const newThemes = [...colorThemes];
                                        if (!newThemes[index].itemColors) newThemes[index].itemColors = {};
                                        
                                        if (!selectedColorName) {
                                          delete newThemes[index].itemColors[item.id];
                                        } else {
                                          let colorObj = item.availableColors?.find((c:any) => c.name === selectedColorName);
                                          if (!colorObj && item.presetColor?.name === selectedColorName) colorObj = item.presetColor;
                                          
                                          if (colorObj) {
                                            newThemes[index].itemColors[item.id] = { name: colorObj.name, hex: colorObj.hex, imageUrl: colorObj.imageUrl || "" };
                                          }
                                        }
                                        setColorThemes(newThemes);
                                      }}
                                      className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                                    >
                                      <option value="">- Chọn màu -</option>
                                      {item.presetColor?.name && <option value={item.presetColor.name}>{item.presetColor.name} (Mặc định)</option>}
                                      {item.availableColors?.map((c:any, i:number) => (
                                        <option key={i} value={c.name}>{c.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                );
                              })}
                              {bundleItems.filter(i => i.id).length === 0 && <p className="text-xs text-gray-400">Vui lòng thêm món đồ (cần có ID) ở cột bên phải trước.</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {colorThemes.length === 0 && <p className="text-xs text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">Chưa có bản phối nào</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Bundle Items Builder */}
            {advancedMode && (
              <div className="lg:pl-6 lg:border-l border-gray-100 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold flex items-center gap-2"><Package className="w-4 h-4"/> Các Món Đồ (Bundle Items)</h3>
                  <button type="button" onClick={() => setBundleItems([...bundleItems, { id: "", name: "", type: "top", price: 0, imageUrl: "", sizes: [], sourceLink: "", presetColor: { name: "", hex: "#000000" } }])} className="text-xs font-bold bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 rounded-lg flex items-center gap-1 hover:scale-105 transition-transform"><Plus className="w-3 h-3"/> Thêm Món Đồ</button>
                </div>
                
                <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                  {bundleItems.map((item, index) => (
                    <div key={index} className="p-5 bg-gray-50/50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-xl relative shadow-sm">
                      <button type="button" onClick={() => setBundleItems(bundleItems.filter((_, i) => i !== index))} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                      <div className="grid grid-cols-2 gap-4 pr-10">
                        <div>
                          <label className={labelClass}>ID Món đồ (VD: jacket-1)</label>
                          <input value={item.id} onChange={e => { const newItems = [...bundleItems]; newItems[index].id = e.target.value; setBundleItems(newItems); }} placeholder="jacket-1" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Tên món đồ</label>
                          <input value={item.name} onChange={e => { const newItems = [...bundleItems]; newItems[index].name = e.target.value; setBundleItems(newItems); }} placeholder="Gore-Tex Jacket" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Loại (Type)</label>
                          <select value={item.type} onChange={e => { const newItems = [...bundleItems]; newItems[index].type = e.target.value; setBundleItems(newItems); }} className={inputClass}>
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                            <option value="outerwear">Outerwear</option>
                            <option value="shoes">Shoes</option>
                            <option value="hat">Hat</option>
                            <option value="accessories">Accessories</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Giá (VNĐ)</label>
                          <input type="number" value={item.price} onChange={e => { const newItems = [...bundleItems]; newItems[index].price = Number(e.target.value); setBundleItems(newItems); }} className={inputClass} />
                        </div>
                        <div className="col-span-2">
                          <label className={labelClass}>Link gốc sản phẩm (Nguồn mua)</label>
                          <input type="text" value={item.sourceLink || ""} onChange={e => { const newItems = [...bundleItems]; newItems[index].sourceLink = e.target.value; setBundleItems(newItems); }} placeholder="https://..." className={inputClass} />
                        </div>
                        <div className="col-span-2">
                          <ImageUploader 
                            folder={`OcevProduct/${form._id}`}
                            label="Hình ảnh chính (của món đồ)"
                            value={item.imageUrl || ""}
                            onChange={url => { const newItems = [...bundleItems]; newItems[index].imageUrl = url; setBundleItems(newItems); }}
                          />
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center justify-between mb-2">
                            <label className={labelClass}>Các URL Hình Ảnh phụ (Của món đồ)</label>
                            <button type="button" onClick={() => {
                              const newItems = [...bundleItems];
                              if (!newItems[index].images) newItems[index].images = [];
                              newItems[index].images.push("");
                              setBundleItems(newItems);
                            }} className="text-[10px] font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"><Plus className="w-3 h-3"/> Thêm Ảnh</button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {item.images?.map((imgUrl: string, imgIdx: number) => (
                              <ImageUploader 
                                key={imgIdx}
                                folder={`OcevProduct/${form._id}`}
                                label={`Ảnh phụ ${imgIdx + 1}`}
                                value={imgUrl}
                                onChange={(url, isDeleted) => { 
                                  const newItems = [...bundleItems]; 
                                  if (isDeleted) {
                                    newItems[index].images = newItems[index].images.filter((_:any, i:number) => i !== imgIdx);
                                  } else {
                                    newItems[index].images[imgIdx] = url; 
                                  }
                                  setBundleItems(newItems); 
                                }}
                              />
                            ))}
                            {(!item.images || item.images.length === 0) && <p className="col-span-full text-[11px] text-gray-400 italic">Chưa có ảnh phụ nào.</p>}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className={labelClass}>Sizes (phân cách bằng dấu phẩy)</label>
                          <input value={Array.isArray(item.sizes) ? item.sizes.join(", ") : item.sizes || ""} onChange={e => { const newItems = [...bundleItems]; newItems[index].sizes = e.target.value; setBundleItems(newItems); }} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Tên Màu Mặc định</label>
                          <input value={item.presetColor?.name || ""} onChange={e => { const newItems = [...bundleItems]; if(!newItems[index].presetColor) newItems[index].presetColor = {}; newItems[index].presetColor.name = e.target.value; setBundleItems(newItems); }} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Mã Màu (HEX)</label>
                          <div className="flex gap-2">
                            <input type="color" value={item.presetColor?.hex || "#000000"} onChange={e => { const newItems = [...bundleItems]; if(!newItems[index].presetColor) newItems[index].presetColor = {}; newItems[index].presetColor.hex = e.target.value; setBundleItems(newItems); }} className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 dark:border-zinc-700 p-0.5" />
                            <input value={item.presetColor?.hex || ""} onChange={e => { const newItems = [...bundleItems]; if(!newItems[index].presetColor) newItems[index].presetColor = {}; newItems[index].presetColor.hex = e.target.value; setBundleItems(newItems); }} className={inputClass} />
                          </div>
                        </div>

                        <div className="col-span-2 mt-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
                          <div className="flex items-center justify-between mb-3">
                            <label className={labelClass}>Các màu có sẵn (Available Colors)</label>
                            <button type="button" onClick={() => {
                              const newItems = [...bundleItems];
                              if (!newItems[index].availableColors) newItems[index].availableColors = [];
                              newItems[index].availableColors.push({ name: "", hex: "#000000", imageUrl: "" });
                              setBundleItems(newItems);
                            }} className="text-[10px] font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"><Plus className="w-3 h-3"/> Thêm Màu</button>
                          </div>
                          <div className="space-y-3">
                            {item.availableColors?.map((color: any, cIdx: number) => (
                              <div key={cIdx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white dark:bg-zinc-950 p-3 rounded-lg border border-gray-100 dark:border-zinc-800 shadow-sm">
                                <input type="color" value={color.hex || "#000000"} onChange={e => { const newItems = [...bundleItems]; newItems[index].availableColors[cIdx].hex = e.target.value; setBundleItems(newItems); }} className="w-8 h-8 rounded shrink-0 cursor-pointer p-0 border-0" title="Mã màu HEX" />
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                  <input placeholder="Tên màu (VD: Trắng)" value={color.name || ""} onChange={e => { const newItems = [...bundleItems]; newItems[index].availableColors[cIdx].name = e.target.value; setBundleItems(newItems); }} className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors w-full" />
                                  <ImageUploader 
                                    folder={`OcevProduct/${form._id}`}
                                    label="Ảnh áo màu này"
                                    value={color.imageUrl || ""}
                                    onChange={url => { const newItems = [...bundleItems]; newItems[index].availableColors[cIdx].imageUrl = url; setBundleItems(newItems); }}
                                  />
                                </div>
                                <button type="button" onClick={() => { const newItems = [...bundleItems]; newItems[index].availableColors = newItems[index].availableColors.filter((_:any, i:number) => i !== cIdx); setBundleItems(newItems); }} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            ))}
                            {(!item.availableColors || item.availableColors.length === 0) && <p className="text-[11px] text-gray-400 italic">Món đồ này chỉ có một màu mặc định.</p>}
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                  {bundleItems.length === 0 && <p className="text-xs text-gray-400 text-center py-10 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">Bạn chưa thêm món đồ nào vào combo này.</p>}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl text-sm font-bold hover:scale-[1.01] transition-transform disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {initial ? "Lưu Thay Đổi" : "Thêm Sản Phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
