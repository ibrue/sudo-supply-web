import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { AdminNav } from "./AdminNav";

export const metadata = {
  title: "admin · sudo.supply",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();
  if (!admin) redirect("/");

  return (
    <div className="pt-32 pb-16 max-w-[1280px] mx-auto px-4 sm:px-8">
      <AdminNav />
      {children}
    </div>
  );
}
