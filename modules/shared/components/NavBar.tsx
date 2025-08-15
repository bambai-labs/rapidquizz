"use client";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

export const NavBar = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          <GraduationCap className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">QuizCraft</h1>
        </motion.div>

        <GoogleAuthButton />
      </div>
    </motion.header>
  );
};
