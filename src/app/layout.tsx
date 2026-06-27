import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MobileTabBar from "@/components/MobileTabBar";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TrainerDex — Pokémon GO Trainer Hub",
    template: "%s — TrainerDex",
  },
  description:
    "All your Pokémon GO info in one place: live events, raid guides, IV references, community days, and more. Updated hourly.",
  applicationName: "TrainerDex",
  keywords: ["Pokémon GO", "POGO", "raids", "events", "IV calculator", "PvP", "community day"],
  authors: [{ name: "TrainerDex" }],
  // PWA / installability
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TrainerDex",
  },
  // Open Graph
  openGraph: {
    type: "website",
    siteName: "TrainerDex",
    title: "TrainerDex — Pokémon GO Trainer Hub",
    description: "Live events, raids, IV tools, and more — all in one place.",
  },
  // Icons
  icons: {
    icon: [
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png",   sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/icons/favicon-32.png",
  },
  other: {
    // Disable automatic phone number detection on iOS
    "format-detection": "telephone=no",
  },
};

// Viewport is exported separately per Next.js App Router convention
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0ea5e9" },
    { media: "(prefers-color-scheme: dark)",  color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

// Set the theme before first paint to avoid a flash of the wrong palette.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground pb-14 sm:pb-0">
        {children}
        <MobileTabBar />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
