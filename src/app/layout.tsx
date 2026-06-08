import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { CartProvider } from "@/context/CartContext";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SudoToast } from "@/components/SudoToast";
import { LivePurchaseFeed } from "@/components/LivePurchaseFeed";

const mono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

const pixel = localFont({
  src: "./fonts/PixelatedEleganceRegular-ovawB.ttf",
  variable: "--font-pixel",
  weight: "400",
});

// metadataBase makes every relative OG/Twitter image URL absolute. Falls
// back to localhost in dev so previews still work when running locally.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://sudo.supply");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "sudo.supply \u2014 open-source macro pads for AI agents",
  description:
    "Open-source macro pads with a companion app for macOS (Windows coming soon). Approve, reject, and control AI agents across Claude, ChatGPT, and Grok. The pad is plain USB-HID and works anywhere.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "sudo.supply",
    title: "sudo.supply \u2014 open-source macro pads for AI agents",
    description:
      "Open hardware, hand-assembled. Press buttons on purpose. Macro pads + a macOS companion app (Windows coming soon) for Claude, ChatGPT, and Grok.",
    // No explicit image URL \u2014 Next picks up the conventional
    // src/app/opengraph-image.tsx automatically.
  },
  twitter: {
    card: "summary_large_image",
    title: "sudo.supply \u2014 open-source macro pads for AI agents",
    description:
      "Open hardware, hand-assembled. Press buttons on purpose.",
  },
};

const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#2ea468",
    colorBackground: "#0a0a0a",
    colorInputBackground: "#141414",
    colorInputText: "#f2f2f2",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-mono), monospace",
  },
  elements: {
    card: "border border-[#222] shadow-none rounded-3xl",
    formButtonPrimary:
      "bg-[#2ea468] text-black hover:brightness-110 font-semibold rounded-full",
    footerActionLink: "text-[#2ea468] hover:text-[#2ea468]",
    headerTitle: "font-sans font-bold",
    headerSubtitle: "text-[#8a8a8a]",
    socialButtonsBlockButton:
      "border-[#222] rounded-2xl text-white [&_.cl-socialButtonsBlockButtonText]:text-white",
    socialButtonsProviderIcon: "brightness-0 invert",
    formFieldInput: "border-[#222] rounded-2xl bg-[#141414]",
  },
};

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const isClerkConfigured = /^pk_(test|live)_/.test(clerkKey) && !clerkKey.includes("placeholder") && !clerkKey.includes("...") && clerkKey.length >= 24;

function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!isClerkConfigured) return <>{children}</>;
  return <ClerkProvider appearance={clerkAppearance}>{children}</ClerkProvider>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${mono.variable} ${pixel.variable} antialiased`}>
          <CartProvider>
            <Nav />
            <main className="relative z-10 min-h-screen">{children}</main>
            <Footer />
            <SudoToast />
            <LivePurchaseFeed />
            <SpeedInsights />
            <Analytics />
          </CartProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
