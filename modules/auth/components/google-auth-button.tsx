"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Chrome } from "lucide-react";

export function GoogleAuthButton() {
  const handleAuth = () => {
    // Mock Google OAuth - In a real app, use NextAuth or similar
    const mockUser = {
      id: "user-123",
      name: "John Educator",
      email: "john@example.com",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    };
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={handleAuth}
        variant="outline"
        className="flex items-center gap-2 min-w-[200px]"
      >
        <Chrome className="w-5 h-5" />
        Sign in with Google
      </Button>
    </motion.div>
  );
}
