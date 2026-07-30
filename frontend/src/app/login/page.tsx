"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { ArrowLeft, Lock, Mail, Sparkles, Check } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("alex@ocevstudio.com");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email);
      router.push("/shop");
    }, 600);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login("alex@ocevstudio.com", "Alex Ocean");
      router.push("/shop");
    }, 500);
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
        <ArrowLeft className="w-4 h-4" /> Back to Store
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
          <h2 className="text-xl font-bold tracking-tight text-gray-200">Welcome Back</h2>
          <p className="text-xs text-gray-400">Sign in to access your curated outfits and wishlist</p>
        </div>

        {/* Demo Login Quick Button */}
        <button
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold rounded-2xl text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <Sparkles className="w-4 h-4 fill-black" /> Instant Demo Login (Alex Ocean)
        </button>

        <div className="flex items-center gap-4 my-4">
          <div className="h-px bg-zinc-800 flex-1" />
          <span className="text-[10px] uppercase font-bold text-gray-500">or sign in with email</span>
          <div className="h-px bg-zinc-800 flex-1" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                Password
              </label>
              <a href="#" className="text-[11px] text-gray-400 hover:text-white transition-colors">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-white text-black font-extrabold rounded-2xl text-xs hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? "Signing in..." : "Sign In to Account"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-gray-400 pt-2">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-white hover:underline">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}
