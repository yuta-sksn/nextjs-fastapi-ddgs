import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next.js - DuckDuckGo Search (FastAPI)",
  description: "Next.js から FastAPI 経由 DuckDuckGo 検索を行うサンプル",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body suppressHydrationWarning={true} className={inter.className}>{children}</body>
    </html>
  );
}
