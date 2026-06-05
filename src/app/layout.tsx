import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "500",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vesta.lappom.fr"),
  title: "Vesta — Our list for two",
  description:
    "A private space to plan dates, outings, and couple moments together.",
  applicationName: "Vesta",
  openGraph: {
    title: "Vesta — Our list for two",
    description:
      "A private space to plan dates, outings, and couple moments together.",
    url: "https://vesta.lappom.fr",
    siteName: "Vesta",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vesta — Our list for two",
    description:
      "A private space to plan dates, outings, and couple moments together.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable} h-full`}>
      <body className="min-h-full font-sans">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
