import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-white overflow-hidden">
        {/* Sidebar - hidden on mobile for now, can be improved with a drawer later */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>
        
        <div className="flex-1 flex flex-col min-w-0 h-screen">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
