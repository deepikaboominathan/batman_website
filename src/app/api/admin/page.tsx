
import type { Metadata } from "next";
import AdminDashboard, { AdminLogin } from "@/components/AdminDashboard";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import "./admin.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  // Verify admin authentication on the server
  const authed = await isAdminAuthenticated();

  return (
    <main className="ad-root">
      {authed ? <AdminDashboard /> : <AdminLogin />}
    </main>
  );
}
