import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogIn, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export const LoginButton = () => {
  const router = useRouter();
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      <Button
        onClick={() => router.push("/login")}
        className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-700 hover:via-purple-800 hover:to-indigo-800 text-white font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 border-0 px-6 py-2.5 rounded-full group overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <div className="relative flex items-center gap-2 z-10">
          <LogIn className="w-4 h-4" />
          <span>Login</span>
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="opacity-70 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Sparkles className="w-3 h-3" />
          </motion.div>
        </div>
      </Button>
    </motion.div>
  );
};
