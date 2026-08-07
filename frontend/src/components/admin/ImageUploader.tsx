import { useState, useRef } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string, isDeleted?: boolean) => void;
  label?: string;
  folder?: string;
}

export default function ImageUploader({ value, onChange, label = "Upload Ảnh", folder }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      if (folder) {
        formData.append("folder", folder);
      }
      formData.append("image", file);

      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      onChange(data.url);
      toast.success("Upload ảnh thành công!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload thất bại!");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    try {
      if (!value.includes('cloudinary.com')) {
        onChange("");
        return;
      }
      
      // Extract public_id from cloudinary URL
      // e.g. https://res.cloudinary.com/dvzxyz/image/upload/v12345/ocevstudio/products/abcdef.jpg
      const parts = value.split('/');
      const lastPart = parts[parts.length - 1]; // abcdef.jpg
      const folderPart = parts[parts.length - 2]; // products
      const rootFolderPart = parts[parts.length - 3]; // ocevstudio
      
      const public_id_with_ext = `${rootFolderPart}/${folderPart}/${lastPart}`;
      const public_id = public_id_with_ext.split('.')[0]; // ocevstudio/products/abcdef

      await api.delete("/upload", { data: { public_id } });
      onChange("", true);
      toast.success("Đã xóa ảnh!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xóa ảnh thất bại!");
    }
  };

  return (
    <div className="space-y-2 w-full">
      <label className="block text-[10px] font-bold text-gray-500 uppercase">{label}</label>
      
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/50 aspect-square flex items-center justify-center">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              type="button" 
              onClick={handleDelete}
              className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full aspect-square border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          ) : (
            <>
              <UploadCloud className="w-6 h-6 text-gray-400" />
              <span className="text-xs font-medium text-gray-500">Chọn ảnh (Max 5MB)</span>
            </>
          )}
        </button>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
