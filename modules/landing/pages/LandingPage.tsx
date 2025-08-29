'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Check,
  Crown,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { LandingNavBar } from '../components/landing-navbar'
import { StartNowCta } from '../components/start-now-cta'

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <LandingNavBar />
      </div>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Quiz Generation Tool
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent leading-tight"
          >
            RapidQuiz
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Transform your content into engaging, interactive quizzes with
            stunning animations and instant feedback. Perfect for educators,
            trainers, and content creators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <StartNowCta />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>
                Free tier available • No credit or debit card required
              </span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">10K+</div>
              <div className="text-sm text-muted-foreground">
                Quizzes Created
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">50K+</div>
              <div className="text-sm text-muted-foreground">
                Students Engaged
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">99%</div>
              <div className="text-sm text-muted-foreground">
                Satisfaction Rate
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Demo Video Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              See RapidQuiz in Action
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Watch how easy it is to create engaging quizzes that captivate
              your audience and boost learning outcomes.
            </p>

            {/* Demo Video */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border-2 border-primary/20 overflow-hidden shadow-2xl">
                <video
                  className="w-full h-full object-cover"
                  controls
                  poster="/RapidQuizDemo.mp4"
                  preload="metadata"
                  autoPlay={true}
                >
                  <source src="/RapidQuizDemo.mp4" type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full blur-sm"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary/20 rounded-full blur-sm"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="what-includes" className="py-20 scroll-mt-72 md:scroll-mt-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose RapidQuiz?
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed to make quiz creation effortless and
              engaging
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                AI-Powered Generation
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate comprehensive quizzes instantly from any topic,
                document, or subject matter using advanced AI technology.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Interactive Experience
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Captivate your audience with smooth animations, real-time
                feedback, and engaging visual elements.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Detailed Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track performance, identify knowledge gaps, and gain insights
                with comprehensive analytics and reporting.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Multi-Format Support
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Create quizzes from text, PDF, and DOCX documents with
                multiple-choice questions.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate quizzes in minutes, not hours. Our optimized AI ensures
                rapid content creation without compromising quality.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Export & Share</h3>
              <p className="text-muted-foreground leading-relaxed">
                Export your quizzes in multiple formats and share them easily
                with students, colleagues, or embed in your platform.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 bg-gradient-to-br from-purple-50 via-white to-indigo-50 scroll-mt-72 md:scroll-mt-8"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your needs and start creating amazing
              quizzes today
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* Free Plan */}
            <motion.div whileHover={{ y: -5 }} className="relative">
              <Card className="h-full transition-all duration-300 hover:shadow-xl">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    Free
                  </CardTitle>
                  <div className="text-4xl font-bold">
                    <span className="text-3xl">$</span>0
                    <span className="text-base font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <CardDescription className="text-base">
                    Perfect for getting started
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      20 quizzes without files per month
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      5 quizzes with files per month
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Basic quiz results</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro Plan */}
            <motion.div whileHover={{ y: -5 }} className="relative">
              <motion.div
                animate={{
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg whitespace-nowrap">
                  <Star className="w-4 h-4" />
                  Most Popular
                  <Sparkles className="w-4 h-4" />
                </div>
              </motion.div>

              <Card className="h-full transition-all duration-300 hover:shadow-xl border-purple-200 shadow-purple-100 shadow-xl scale-105">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    <Crown className="w-6 h-6 text-purple-600" />
                    Pro
                  </CardTitle>
                  <div className="text-4xl font-bold">
                    <span className="text-3xl">$</span>9.99
                    <span className="text-base font-normal text-gray-500">
                      /month
                    </span>
                  </div>
                  <CardDescription className="text-base">
                    Ideal for students, educators and professionals
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Unlimited quizzes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      Unlimited questions per quiz
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Priority support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      Enhanced AI for better questions
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      PDF & DOCX file support
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pt-8">
                  <Link href="/login" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg font-semibold transition-all duration-300">
                      Upgrade to Pro
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>

          {/* Why Choose Pro Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-20 text-center"
          >
            <h3 className="text-3xl font-bold mb-12">
              Why Choose RapidQuiz Pro?
            </h3>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-lg">Advanced AI</h4>
                <p className="text-gray-600">
                  Generate smarter and more precise questions with our enhanced
                  AI technology
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                  <Crown className="w-6 h-6 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-lg">No Limits</h4>
                <p className="text-gray-600">
                  Create as many quizzes as you need without any restrictions
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-lg">Premium Support</h4>
                <p className="text-gray-600">
                  Get priority help from our team of experts whenever you need
                  it
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 scroll-mt-72 md:scroll-mt-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about RapidQuiz
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  What is RapidQuiz and how does it work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  RapidQuiz is an AI-powered quiz generation platform that
                  transforms your content into engaging, interactive quizzes.
                  Simply provide text, upload PDF or DOCX files, or describe a
                  topic, and our advanced AI will generate comprehensive
                  multiple-choice questions with instant feedback and beautiful
                  animations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  What's included in the free plan?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  The free plan includes 20 quizzes without files and 5 quizzes
                  with files per month, basic quiz results, and community
                  support. It's perfect for getting started and trying out
                  RapidQuiz's core features.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  What additional features do I get with Pro?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Pro users get unlimited quizzes, unlimited questions per quiz,
                  priority support, enhanced AI for better question generation,
                  and full PDF & DOCX file support. You can also access advanced
                  analytics and export options.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  What file formats are supported?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  RapidQuiz supports PDF and DOCX file uploads for Pro users.
                  Free users can create quizzes from text input. Our AI can
                  extract content from these files and generate relevant
                  questions automatically.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  Can I export my quizzes?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes! You can export your quizzes in multiple formats and share
                  them easily with students, colleagues, or embed them in your
                  learning management system or website.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  How accurate is the AI-generated content?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Our AI is trained on vast educational datasets and
                  continuously improved. Pro users get access to our enhanced AI
                  model that generates more precise and contextually relevant
                  questions. You can always review and edit questions before
                  publishing.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  Is there a limit on quiz length?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Free users can create quizzes with up to 10 questions. Pro
                  users have no limits and can create quizzes with as many
                  questions as needed, perfect for comprehensive assessments and
                  detailed learning materials.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  Can I cancel my Pro subscription anytime?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, you can cancel your Pro subscription at any time. Your
                  Pro features will remain active until the end of your current
                  billing period, after which you'll be moved to the free plan.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Join thousands of educators and content creators who are already
              using RapidQuiz to engage their audience.
            </p>
            <StartNowCta />
          </motion.div>
        </div>
      </section>
    </div>
  )
}
