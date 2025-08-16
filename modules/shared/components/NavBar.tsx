"use client";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { LoginButton } from "@/modules/auth/components/LoginButton";
import { useAuthStore } from "@/stores/auth-store";

export const NavBar = () => {
  const { isAuthenticated } = useAuthStore();

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

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <GoogleAuthButton />
          ) : (
            <>
              <LoginButton />
              <span className="text-sm text-muted-foreground">or</span>
              <GoogleAuthButton />
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};
