import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import Link from "next/link";

export const metadata = {
  title: "admin — sudo.supply",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();
  if (!admin) redirect("/");

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-8 text-sm animate-fade-in">
        <span className="text-text-muted">~/admin</span>
        <Link href="/admin" className="hover-accent text-text-muted hover:text-text transition-colors">
          dashboard
        </Link>
        <Link href="/admin/products" className="hover-accent text-text-muted hover:text-text transition-colors">
          products
        </Link>
        <Link href="/admin/orders" className="hover-accent text-text-muted hover:text-text transition-colors">
          orders
        </Link>
        <Link href="/admin/bulk" className="hover-accent text-text-muted hover:text-text transition-colors">
          bulk inquiries
        </Link>
        <Link href="/admin/pricing" className="hover-accent text-text-muted hover:text-text transition-colors">
          pricing
        </Link>
      </div>
      {children}
    </div>
  );
}
