"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { ArrowLeft, Lock, Mail, User, Sparkles, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferredSize, setPreferredSize] = useState("M");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      register(name || "New Member", email || "user@ocevstudio.com", preferredSize);
      router.push("/shop");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans py-12">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-600/20 via-orange-500/10 to-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />

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
          <h2 className="text-xl font-bold tracking-tight text-gray-200">Create Member Account</h2>
          <p className="text-xs text-gray-400">Join to get personalized outfit recommendations and instant checkout</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Lee"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

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
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Size Preference Selection */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                Your Preferred Fit Size
              </label>
              <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto-fit Swiper
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["S", "M", "L", "XL"].map((sz) => (
                <button
                  type="button"
                  key={sz}
                  onClick={() => setPreferredSize(sz)}
                  className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                    preferredSize === sz
                      ? "bg-white text-black border-white scale-105 shadow-md"
                      : "bg-zinc-950 text-gray-400 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-white text-black font-extrabold rounded-2xl text-xs hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? "Creating Account..." : "Create Account & Start Shopping"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-gray-400 pt-2">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-white hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
