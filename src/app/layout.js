import { Inter } from "next/font/google";
import "./globals.css";

// 1. Initialize Google Font (Inter)
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WikiNITT",
  description: "Your campus wiki",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 2. Apply font class and suppress hydration warnings */}
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}