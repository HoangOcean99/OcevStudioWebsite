"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const router = useRouter();
  const { isLoggedIn, isLoading, user, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsChecking(false);
        setIsRedirecting(true);
        router.replace("/"); // Đẩy về home nếu chưa đăng nhập
        return;
      }

      if (!isLoggedIn && !isLoading) {
        await checkAuth();
      }
      setIsChecking(false);
    };

    initAuth();
  }, [isLoggedIn, isLoading, router, checkAuth]);

  useEffect(() => {
    if (!isChecking && !isLoading) {
      if (!isLoggedIn) {
        setIsRedirecting(true);
        router.replace("/");
      } else if (requireAdmin && user?.role !== "admin" && user?.role !== "staff") {
        setIsRedirecting(true);
        router.replace("/");
      }
    }
  }, [isChecking, isLoading, isLoggedIn, requireAdmin, user, router]);

  if (isRedirecting) {
    return null;
  }

  if (isChecking || isLoading || !isLoggedIn) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4" />
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (requireAdmin && user?.role !== "admin" && user?.role !== "staff") {
    return null;
  }

  return <>{children}</>;
}
