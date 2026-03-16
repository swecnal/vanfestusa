import type { Metadata, Viewport } from "next";
import PageTracker from "@/components/PageTracker";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "VanFest | The ULTIMATE vanlife experience!",
  description: "Miles - Moments - Music - Memories",
  openGraph: {
    title: "VanFest | The ULTIMATE vanlife experience!",
    description: "Miles - Moments - Music - Memories",
    siteName: "VanFest",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          href="https://fonts.googleapis.com/css2?display=swap&family=Poppins:wght@300;400;500;600;700;800;900&family=EB+Garamond:ital,wght@0,400;0,500;0,700;1,400&family=Gothic+A1:wght@300;400;700&family=Orbitron:wght@400;700;900"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <PageTracker />
        {children}
      </body>
    </html>
  );
}
