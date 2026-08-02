"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const { googleLogin, error } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.idToken;
      const { displayName, photoURL } = result.user;
      
      if (!token) {
        throw new Error("Không thể lấy Google Token");
      }
      
      await googleLogin(token, displayName || undefined, photoURL || undefined);
      router.push("/shop"); // Or whatever page makes sense
    } catch (err: any) {
      console.error(err);
      // If it's a firebase popup closed by user, we can ignore or set a custom error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-purple-600/20 via-orange-500/10 to-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Back to Store Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800 backdrop-blur-md"
      >
        <ArrowLeft className="w-4 h-4" /> Về trang chủ
      </Link>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md bg-zinc-900/90 border border-zinc-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <span className="font-black text-3xl tracking-widest text-white uppercase">
              OCEV<span className="text-gray-500 font-light">STUDIO</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold tracking-tight text-gray-200">Chào mừng trở lại</h2>
          <p className="text-xs text-gray-400">Đăng nhập để xem tủ đồ và sản phẩm yêu thích của bạn</p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={isLoading}
          className="w-full py-3 bg-white text-black font-extrabold rounded-2xl text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            <path fill="none" d="M1 1h22v22H1z"/>
          </svg>
          Đăng nhập bằng Google
        </button>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
            {error}
          </div>
        )}

      </div>
    </div>
  );
}
