import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header"; // Correctly import the default export
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
import React from "react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header /> {/* Use the Header component */}
        <main className="light text-foreground bg-background">{children}</main>
      </body>
    </html>
  );
}
