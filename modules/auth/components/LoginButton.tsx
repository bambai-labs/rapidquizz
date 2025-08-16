import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export const LoginButton = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={() => {}}
        variant="outline"
        className="flex items-center gap-2 min-w-[200px]"
      >
        Login
      </Button>
    </motion.div>
  )
}
