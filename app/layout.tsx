import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Ozon Niche Lab — аналитика ниш для селлеров",
  description:
    "Кабинет для селлеров Ozon и других МП: скоринг ниш, прогнозы и объяснения — куда выходить следующим шагом.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={cn(inter.variable)}>
      <body className="min-h-dvh bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
