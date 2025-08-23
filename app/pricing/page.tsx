'use client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { initializePaddle, Paddle } from '@paddle/paddle-js'
import { motion } from 'framer-motion'
import { Check, Crown, Sparkles, Star, Zap } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function PricingPage() {
  const [paddleInstance, setPaddleInstance] = useState<Paddle | undefined>()

  const initiPaddleClient = async () => {
    const paddle = await initializePaddle({
      environment: 'sandbox',
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    })
    setPaddleInstance(paddle)
  }

  const handlePaddleCheckout = async () => {
    if (!paddleInstance) {
      console.error('Paddle instance not initialized')
      return
    }

    paddleInstance.Checkout.open({
      items: [
        {
          priceId: 'pri_01k3aq0naqwwsj59d0gknbp5mg',
          quantity: 1,
        },
      ],
      settings: {
        displayMode: 'overlay',
        theme: 'dark',
        successUrl: `${window.location.origin}/success`,
      },
    })
  }

  useEffect(() => {
    initiPaddleClient()
  }, [])

  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'Perfecto para empezar',
      features: [
        'Hasta 5 quizzes',
        'Hasta 10 preguntas por quiz',
        'Resultados básicos',
      ],
      popular: false,
      buttonText: 'Plan Actual',
      buttonVariant: 'outline' as const,
      disabled: true,
    },
    {
      name: 'Pro',
      price: '9.99',
      description: 'Ideal para educadores y profesionales',
      features: [
        'Quizzes ilimitados',
        'Más de 10 preguntas por quiz',
        'Temporizadores personalizados',
        'Soporte prioritario',
        'IA mejorada para generar preguntas',
        'Admite archivos PDF o DOCX',
      ],
      popular: true,
      buttonText: '¡Actualizar a Pro!',
      buttonVariant: 'default' as const,
      disabled: false,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Planes y Precios
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan perfecto para tus necesidades y lleva tus quizzes al
            siguiente nivel
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              className="relative"
            >
              {plan.popular && (
                <motion.div
                  animate={{
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10"
                >
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Más Popular
                    <Sparkles className="w-4 h-4" />
                  </div>
                </motion.div>
              )}

              <Card
                className={`relative h-full transition-all duration-300 hover:shadow-2xl ${
                  plan.popular
                    ? 'border-purple-200 shadow-purple-100 shadow-xl scale-105'
                    : 'hover:scale-105'
                }`}
              >
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    {plan.name === 'Pro' && (
                      <Crown className="w-6 h-6 text-purple-600" />
                    )}
                    {plan.name}
                  </CardTitle>
                  <div className="text-4xl font-bold">
                    <span className="text-3xl">$</span>
                    {plan.price}
                    <span className="text-base font-normal text-gray-500">
                      /mes
                    </span>
                  </div>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + idx * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </CardContent>

                <CardFooter className="pt-8">
                  <motion.div
                    whileHover={{ scale: plan.disabled ? 1 : 1.02 }}
                    whileTap={{ scale: plan.disabled ? 1 : 0.98 }}
                    className="w-full"
                  >
                    <Button
                      variant={plan.buttonVariant}
                      size="lg"
                      disabled={plan.disabled}
                      className={`w-full font-semibold ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg'
                          : ''
                      }`}
                      onClick={handlePaddleCheckout}
                    >
                      {plan.buttonText}
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ/Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold mb-8">
            ¿Por qué elegir QuizCraft Pro?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">IA Avanzada</h3>
              <p className="text-gray-600">
                Genera preguntas más inteligentes y precisas con nuestra IA
                mejorada
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                <Crown className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-lg">Sin Límites</h3>
              <p className="text-gray-600">
                Crea tantos quizzes como necesites sin restricciones
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">Soporte Premium</h3>
              <p className="text-gray-600">
                Obtén ayuda prioritaria de nuestro equipo de expertos
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
          <p className="text-lg mb-6 opacity-90">
            Únete a miles de educadores que ya confían en QuizCraft Pro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
              >
                Prueba Gratis 7 Días
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-purple-600 hover:text-white hover:bg-white/10 font-semibold"
                >
                  Comenzar Ahora
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
