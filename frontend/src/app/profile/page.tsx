"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "@/hooks/useTranslation";
import { User, MapPin, Phone, CheckCircle2, Loader2, Shirt, Footprints } from "lucide-react";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import toast from 'react-hot-toast';
import api from "@/lib/api";

export default function ProfilePage() {
  const { t } = useTranslation("profile");
  const { user, setUser } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    address: "",
    shirtSize: "",
    pantsSize: "",
    shoeSize: ""
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        age: user.age ? user.age.toString() : "",
        phone: user.phone || "",
        address: user.address || "",
        shirtSize: user.shirtSize || "",
        pantsSize: user.pantsSize || "",
        shoeSize: user.shoeSize || ""
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");
    try {
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age, 10) : undefined
      };
      
      const response = await api.put("/users/profile", payload);
      setUser(response.data); 
      setSuccessMsg(t("successUpdate"));
      toast.success(t("successUpdate"));
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Error updating profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col font-sans">
        <Navbar />

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-8">
            {t("title")}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Sidebar Profile Info */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-xl flex flex-col items-center text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 dark:border-zinc-800 mb-4 bg-gray-100 dark:bg-zinc-800">
                  <Image 
                    src={user.avatar || "/default-avatar.svg"} 
                    alt={user.name} 
                    fill 
                    sizes="128px"
                    className="object-cover" 
                  />
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                <div className="w-full bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 text-left space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Tuổi: {user.age || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{user.address || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{user.phone || "N/A"}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-zinc-700 my-2 pt-2"></div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shirt className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Áo: {user.shirtSize || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Footprints className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Giày: {user.shoeSize || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Edit Form */}
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-xl">
                <h2 className="text-xl font-black uppercase mb-6">{t("updateInfo")}</h2>
                
                {successMsg && (
                  <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="font-bold text-sm">{successMsg}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t("fullName")}</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        placeholder="Alex Ocev" 
                        className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t("email")}</label>
                      <input 
                        type="email" 
                        value={user.email} 
                        disabled
                        className="w-full bg-gray-100 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-gray-400 rounded-xl px-4 py-3 text-sm cursor-not-allowed" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t("age")}</label>
                      <input 
                        type="number" 
                        name="age" 
                        value={formData.age} 
                        onChange={handleInputChange} 
                        placeholder="25" 
                        min="1"
                        max="120"
                        className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t("phone")}</label>
                      <input 
                        type="text" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        placeholder="+84 987 654 321" 
                        className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t("address")}</label>
                    <textarea 
                      rows={2} 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      placeholder="Neo-Hanoi, Sector 7" 
                      className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t("shirtSize")}</label>
                      <select 
                        name="shirtSize" 
                        value={formData.shirtSize} 
                        onChange={handleInputChange} 
                        className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      >
                        <option value="">- Chọn -</option>
                        <option value="S">Small (S)</option>
                        <option value="M">Medium (M)</option>
                        <option value="L">Large (L)</option>
                        <option value="XL">Extra Large (XL)</option>
                        <option value="2XL">2XL</option>
                        <option value="3XL">3XL</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t("pantsSize")}</label>
                      <select 
                        name="pantsSize" 
                        value={formData.pantsSize} 
                        onChange={handleInputChange} 
                        className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      >
                        <option value="">- Chọn -</option>
                        <option value="S (28-30)">S (28-30)</option>
                        <option value="M (31-32)">M (31-32)</option>
                        <option value="L (33-34)">L (33-34)</option>
                        <option value="XL (35-36)">XL (35-36)</option>
                        <option value="2XL (37-38)">2XL (37-38)</option>
                        <option value="3XL (39-40)">3XL (39-40)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t("shoeSize")}</label>
                      <select 
                        name="shoeSize" 
                        value={formData.shoeSize} 
                        onChange={handleInputChange} 
                        className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      >
                        <option value="">- Chọn -</option>
                        <option value="34">34</option>
                        <option value="35">35</option>
                        <option value="36">36</option>
                        <option value="37">37</option>
                        <option value="38">38</option>
                        <option value="39">39</option>
                        <option value="40">40</option>
                        <option value="41">41</option>
                        <option value="42">42</option>
                        <option value="43">43</option>
                        <option value="44">44</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="mt-6 w-full py-4 bg-black text-white dark:bg-white dark:text-black rounded-xl text-sm font-bold hover:scale-[1.01] transition-transform disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isSaving ? t("saving") : t("saveChanges")}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
