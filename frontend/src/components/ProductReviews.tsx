"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, MoreHorizontal, User, Filter, ChevronDown, Check, PenSquare, ImagePlus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import api from "../lib/api";
import { useTranslation } from "@/hooks/useTranslation";

interface Review {
  _id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  createdAt: string;
  content: string;
  likes: number;
  images?: string[];
  productType?: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuthStore();
  const { t } = useTranslation("reviews");
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ averageRating: 5, totalReviews: 0 });
  const [filter, setFilter] = useState<number | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalIndex, setModalIndex] = useState<number>(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      let url = `/reviews/product/${productId}`;
      if (filter !== "all") {
        url += `?filter=${filter}`;
      }
      const res = await api.get(url);
      setReviews(res.data.reviews || []);
      if (filter === "all") {
        setStats(res.data.stats || { averageRating: 5, totalReviews: 0 });
      }
    } catch (error) {
      console.error("Error fetching reviews", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, filter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg(t("loginToReview") || "Bạn cần đăng nhập để đánh giá.");
      return;
    }
    if (!content.trim()) {
      setErrorMsg("Vui lòng nhập nội dung đánh giá.");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg("");
    
    try {
      let uploadedImages: string[] = [];
      if (selectedImages.length > 0) {
        const formData = new FormData();
        selectedImages.forEach(file => formData.append("images", file));
        formData.append("productId", productId);
        
        const uploadRes = await api.post("/upload/reviews", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        uploadedImages = uploadRes.data.urls || [];
      }

      if (editingId) {
        await api.put(`/reviews/${editingId}`, {
          rating,
          content,
          images: uploadedImages
        });
        setEditingId(null);
      } else {
        await api.post("/reviews", {
          productId,
          rating,
          content,
          images: uploadedImages
        });
      }
      setSubmitSuccess(true);
      setShowForm(false);
      setContent("");
      setRating(5);
      setSelectedImages([]);
      setPreviewUrls([]);
      // Refresh list
      setFilter("all");
      fetchReviews();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Đã xảy ra lỗi khi gửi đánh giá.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (reviewId: string) => {
    try {
      await api.put(`/reviews/${reviewId}/like`);
      // Update locally
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, likes: r.likes + 1 } : r));
    } catch (error) {
      console.error("Error liking review", error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (selectedImages.length + filesArray.length > 5) {
        setErrorMsg("Chỉ được tải lên tối đa 5 ảnh.");
        return;
      }
      setSelectedImages(prev => [...prev, ...filesArray]);
      const newUrls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.delete(`/reviews/${deleteConfirmId}`);
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review", error);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingId(review._id);
    setRating(review.rating);
    setContent(review.content);
    setPreviewUrls(review.images || []);
    setSelectedImages([]);
    setShowForm(true);
    setActiveMenu(null);
    
    setTimeout(() => {
      document.getElementById("review-form")?.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    }, 100);
  };

  const openImageModal = (images: string[], index: number) => {
    setModalImages(images);
    setModalIndex(index);
    setShowImageModal(true);
  };

  const averageRating = stats.averageRating;
  const totalReviews = stats.totalReviews;

  return (
    <div className="mt-20 pt-16 border-t border-gray-100 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
            {t("title") || "Đánh giá sản phẩm"}
          </h2>
          {!showForm && (
            <button 
              onClick={() => {
                setEditingId(null);
                setRating(5);
                setContent("");
                setPreviewUrls([]);
                setSelectedImages([]);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-sm hover:scale-105 transition-transform"
            >
              <PenSquare className="w-4 h-4" />
              {t("writeReview") || "Viết đánh giá"}
            </button>
          )}
        </div>
        
        {/* Review Form */}
        {showForm && (
          <div id="review-form" className="mb-12 bg-white dark:bg-zinc-900/80 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-lg">
            <h3 className="font-bold text-lg mb-4">{editingId ? "Sửa đánh giá" : "Đánh giá của bạn"}</h3>
            {errorMsg && <p className="text-red-500 text-sm mb-4 font-medium">{errorMsg}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{t("selectRating") || "Chọn sao"}</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= rating ? "fill-orange-500 text-orange-500" : "fill-gray-200 text-gray-200 dark:fill-zinc-700 dark:text-zinc-700"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={t("reviewPlaceholder") || "Chia sẻ cảm nhận của bạn về sản phẩm này..."}
                className="w-full h-32 bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none resize-none"
              />
              
              <div className="flex flex-col gap-3">
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 rounded-full text-sm font-bold transition-colors w-fit">
                  <ImagePlus className="w-4 h-4" />
                  {t("addImages") || "Thêm hình ảnh"}
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageSelect} disabled={isSubmitting} />
                </label>
                <span className="text-xs text-gray-400">{t("maxImages") || "Tối đa 5 ảnh"}</span>
                
                {previewUrls.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {previewUrls.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700 group">
                        <img src={url} className="w-full h-full object-cover" alt="Preview" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/50 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-full font-bold text-sm bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                  {t("cancel") || "Hủy"}
                </button>
                <button type="submit" disabled={!content.trim() || isSubmitting} className="px-6 py-2.5 rounded-full font-bold text-sm bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100">
                  {isSubmitting ? (t("submitting") || "Đang gửi...") : (editingId ? (t("updateReview") || "Cập nhật") : (t("submitReview") || "Gửi đánh giá"))}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Success message */}
        {submitSuccess && !showForm && (
          <div className="mb-8 p-4 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-xl font-medium flex items-center gap-2 border border-green-200 dark:border-green-900/50">
            <Check className="w-5 h-5" />
            {t("successMessage") || "Cảm ơn bạn đã gửi đánh giá!"}
          </div>
        )}

        {/* Rating Summary */}
        <div className="flex flex-col md:flex-row gap-8 mb-12 bg-gray-50 dark:bg-zinc-900/50 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800">
          {/* Average */}
          <div className="flex flex-col items-center justify-center min-w-[200px] border-b md:border-b-0 md:border-r border-gray-200 dark:border-zinc-800 pb-8 md:pb-0 md:pr-8">
            <div className="text-5xl font-black text-gray-900 dark:text-white mb-2 text-center">
              {totalReviews === 0 ? (
                <span className="text-2xl">{t("noReviewsYet") || "Chưa có đánh giá"}</span>
              ) : (
                <>{averageRating}<span className="text-2xl text-gray-400">/5</span></>
              )}
            </div>
            
            {totalReviews > 0 && (
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(averageRating) ? "fill-orange-500 text-orange-500" : "fill-gray-200 text-gray-200 dark:fill-zinc-700 dark:text-zinc-700"}`}
                  />
                ))}
              </div>
            )}
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              {totalReviews} {t("reviewsCount") || "Đánh giá"}
            </p>
          </div>

          {/* Filters */}
          <div className="flex-1 flex flex-col justify-center gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-2 ${
                  filter === "all" 
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black" 
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:border-zinc-600"
                }`}
              >
                {t("all") || "Tất Cả"} ({filter === "all" ? reviews.length : totalReviews})
              </button>
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setFilter(star)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-2 flex items-center gap-1 ${
                    filter === star
                      ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:border-zinc-600"
                  }`}
                >
                  {star} {t("star") || "Sao"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-black dark:border-zinc-800 dark:border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm font-medium">Đang tải đánh giá...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="p-6 bg-white dark:bg-zinc-900/80 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                      {review.userAvatar ? (
                        <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{review.userName}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${star <= review.rating ? "fill-orange-500 text-orange-500" : "fill-gray-200 text-gray-200 dark:fill-zinc-700 dark:text-zinc-700"}`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {user && user._id === review.userId && (
                    <div className="relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === review._id ? null : review._id)}
                        className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      {activeMenu === review._id && (
                        <div className="absolute right-0 top-full mt-1 z-10 w-36 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden py-1">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            {t("editReview") || "Sửa đánh giá"}
                          </button>
                          <button
                            onClick={() => {
                              setDeleteConfirmId(review._id);
                              setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            {t("deleteReview") || "Xóa đánh giá"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {review.productType && (
                  <div className="text-[11px] font-medium text-gray-400 mb-3 uppercase tracking-wider bg-gray-50 dark:bg-zinc-800/50 inline-block px-2 py-1 rounded-md">
                    {t("type") || "Phân loại"}: {review.productType}
                  </div>
                )}

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-line">
                  {review.content}
                </p>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => openImageModal(review.images!, idx)}
                        className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-800 cursor-zoom-in hover:opacity-80 transition-opacity"
                      >
                        <img src={img} alt="Review attachment" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                  <button onClick={() => handleLike(review._id)} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    {t("helpful") || "Hữu ích"} ({review.likes})
                  </button>
                </div>
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                {t("noReviewsYetBody") || "Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!"}
              </div>
            )}
          </div>
        )}
        
        {/* Image Modal */}
        {showImageModal && modalImages.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setShowImageModal(false)}>
            <button 
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation();
                setShowImageModal(false);
              }}
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative w-full max-w-5xl h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img 
                src={modalImages[modalIndex]} 
                className="max-w-full max-h-full object-contain rounded-lg"
                alt="Enlarged review" 
              />
              
              {modalImages.length > 1 && (
                <>
                  <button 
                    className="absolute left-0 md:left-4 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalIndex(prev => (prev - 1 + modalImages.length) % modalImages.length);
                    }}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    className="absolute right-0 md:right-4 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalIndex(prev => (prev + 1) % modalImages.length);
                    }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                    {modalImages.map((_, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setModalIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === modalIndex ? 'bg-white w-4' : 'bg-white/30 hover:bg-white/60'}`} 
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{t("deleteConfirmTitle") || "Xóa đánh giá?"}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">{t("deleteConfirmMessage") || "Bạn có chắc chắn muốn xóa đánh giá này không? Hình ảnh và dữ liệu sẽ không thể khôi phục."}</p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-5 py-2.5 rounded-full font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 transition-colors"
                >
                  {t("cancel") || "Hủy"}
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-5 py-2.5 rounded-full font-bold text-sm bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all active:scale-95"
                >
                  {t("deleteConfirmBtn") || "Xóa"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
