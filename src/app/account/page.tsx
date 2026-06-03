import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OrderHistory } from "./OrderHistory";
import { AccountHeader } from "./AccountHeader";
import { AccountWelcome } from "./AccountWelcome";

export const metadata = {
  title: "account · sudo.supply",
};

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const isClerkConfigured =
  /^pk_(test|live)_/.test(clerkKey) &&
  !clerkKey.includes("placeholder") &&
  !clerkKey.includes("...") &&
  clerkKey.length >= 24;

export default async function AccountPage() {
  // When auth isn't configured (e.g. scaffolded from .env.example), calling
  // currentUser() throws because Clerk never initialised. Bounce to /sign-in,
  // which shows the "set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" notice.
  if (!isClerkConfigured) redirect("/sign-in");

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const name = user.firstName ?? user.username ?? "user";
  const email = user.emailAddresses[0]?.emailAddress ?? "";

  return (
    <div className="pt-32 pb-16 max-w-[900px] mx-auto px-4 sm:px-8">
      <p className="text-xs uppercase tracking-[0.3em] mb-3 text-accent font-mono">Account</p>
      <AccountWelcome name={name}>
        <AccountHeader name={name} email={email} imageUrl={user.imageUrl} />
        <OrderHistory userId={user.id} />
      </AccountWelcome>
    </div>
  );
}
