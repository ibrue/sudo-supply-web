import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Wrap mock pages in a full-viewport overlay so they escape the global
// Nav/Footer and feel like standalone design mockups.
export default function MockLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden">
      {children}
    </div>
  );
}
