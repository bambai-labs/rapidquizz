'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  Crown,
  Gift,
  Heart,
  PartyPopper,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
  }, [])

  const proFeatures = [
    {
      icon: <Crown className="w-6 h-6 text-yellow-500" />,
      title: 'Quizzes ilimitados',
      description: 'Crea tantos quizzes como necesites',
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      title: 'IA mejorada',
      description: 'Preguntas más inteligentes y precisas',
    },
    {
      icon: <Gift className="w-6 h-6 text-pink-500" />,
      title: 'Soporte prioritario',
      description: 'Ayuda cuando la necesites',
    },
    {
      icon: <Star className="w-6 h-6 text-purple-500" />,
      title: 'Funciones premium',
      description: 'Acceso a todas las herramientas avanzadas',
    },
  ]

  // Animación de confetti
  const confettiElements = Array.from({ length: 50 }, (_, i) => (
    <motion.div
      key={i}
      className={`absolute w-2 h-2 ${
        [
          'bg-yellow-400',
          'bg-pink-400',
          'bg-blue-400',
          'bg-purple-400',
          'bg-green-400',
        ][Math.floor(Math.random() * 5)]
      } rounded-full`}
      initial={{
        x:
          typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
        y: -20,
        rotate: 0,
        opacity: 1,
      }}
      animate={{
        y: typeof window !== 'undefined' ? window.innerHeight + 20 : 800,
        rotate: 360,
        opacity: 0,
      }}
      transition={{
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
        ease: 'linear',
      }}
    />
  ))

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {confettiElements}
        </div>
      )}

      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-pink-400/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/2 left-1/2 w-24 h-24 bg-blue-400/10 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-20 container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Success Animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 10,
              delay: 0.2,
            }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <CheckCircle className="w-32 h-32 text-green-400 mx-auto" />
              </motion.div>

              {/* Sparkles around the check */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 45}deg) translateY(-60px)`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Success Title */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-6"
          >
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ¡Bienvenido a Pro!
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <PartyPopper className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">
                Tu suscripción ha sido exitosa
              </h2>
              <PartyPopper className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ¡Felicidades! Ahora tienes acceso a todas las funcionalidades
              premium de QuizCraft. Estás listo para crear quizzes increíbles
              sin límites.
            </p>
          </motion.div>

          {/* Pro Benefits Cards */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {proFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="bg-card border hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.5,
                      }}
                      className="mb-4"
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-8 py-4 text-lg shadow-xl"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  ¡Crear mi primer Quiz Pro!
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/quiz">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold px-8 py-4 text-lg"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Explorar funciones Pro
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Thank you message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="mt-16 p-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border"
          >
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">
                ¡Gracias por confiar en QuizCraft!
              </h3>
              <p className="text-muted-foreground text-lg">
                Estamos emocionados de verte crear quizzes increíbles. Si tienes
                alguna pregunta, nuestro equipo de soporte prioritario está aquí
                para ayudarte.
              </p>
              <div className="flex items-center justify-center mt-4 gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-muted-foreground">
                  Hecho con amor por el equipo de QuizCraft
                </span>
                <Heart className="w-5 h-5 text-red-400" />
              </div>
            </motion.div>
          </motion.div>

          {/* Auto redirect notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
            className="mt-8"
          >
            <p className="text-muted-foreground text-sm">
              Te redirigiremos automáticamente al dashboard en unos segundos...
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
