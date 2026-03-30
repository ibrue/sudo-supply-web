import { currentUser } from "@clerk/nextjs/server";

export async function isAdmin(): Promise<boolean> {
  try {
    const user = await currentUser();
    if (!user) return false;
    return (user.publicMetadata as Record<string, unknown>)?.role === "admin";
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error("Forbidden");
  }
}
