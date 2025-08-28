'use client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Sparkles, Star } from 'lucide-react'
import Link from 'next/link'

export const StartNowCta = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      <Link href="/login">
        <Button className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-700 hover:via-purple-800 hover:to-indigo-800 text-white font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 border-0 px-8 py-4 text-lg rounded-full group overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <div className="relative flex items-center gap-3 z-10">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>Start Creating Now</span>
            <motion.div
              animate={{
                x: [0, 4, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
            </motion.div>
          </div>
        </Button>
      </Link>
    </motion.div>
  )
}
