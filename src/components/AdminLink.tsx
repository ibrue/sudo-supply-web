"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export function AdminLink() {
  const { user } = useUser();
  const isAdmin = (user?.publicMetadata as Record<string, unknown>)?.role === "admin";

  if (!isAdmin) return null;

  return (
    <Link href="/admin" className="hover-accent text-accent transition-colors">
      ~/admin
    </Link>
  );
}
