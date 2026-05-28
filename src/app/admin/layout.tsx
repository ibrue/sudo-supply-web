import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import Link from "next/link";

export const metadata = {
  title: "admin · sudo.supply",
};

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/bulk", label: "Bulk inquiries" },
  { href: "/admin/pricing", label: "Pricing" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();
  if (!admin) redirect("/");

  return (
    <div className="pt-32 pb-16 max-w-[1280px] mx-auto px-4 sm:px-8">
      <div className="flex flex-wrap items-center gap-1 mb-10 text-sm text-text-muted">
        {navLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-white transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
