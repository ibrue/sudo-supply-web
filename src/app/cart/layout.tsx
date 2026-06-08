import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "your bag · sudo.supply",
  description: "Review the items in your bag and check out securely.",
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
