import { NavBar } from "@/modules/shared/components/NavBar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuizCraft - Interactive Quiz Generator for Educators",
  description:
    "Create engaging, interactive quizzes with stunning animations and instant feedback. Perfect for educators who want to make learning fun and memorable.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
