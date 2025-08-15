"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { QuizGeneratorFormComponent } from '@/components/quiz/quiz-generator-form';
import { QuizCard } from '@/components/quiz/quiz-card';
import { QuizInterface } from '@/components/quiz/quiz-interface';
import { QuizResults } from '@/components/quiz/quiz-results';
import { useAuthStore } from '@/stores/auth-store';
import { useQuizStore } from '@/stores/quiz-store';
import { useQuizGeneratorStore } from '@/stores/quiz-generator-store';
import { Quiz } from '@/types/quiz';

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const { isQuizActive, results, setCurrentQuiz, startQuiz } = useQuizStore();
  const { generatedQuizzes } = useQuizGeneratorStore();
  
  const [showGenerator, setShowGenerator] = useState(false);

  const handleStartQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    startQuiz();
  };

  const handleQuizGenerated = () => {
    setShowGenerator(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                QuizCraft
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-muted-foreground mb-8"
              >
                Create engaging, interactive quizzes with stunning animations and instant feedback. Perfect for educators who want to make learning fun and memorable.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <GoogleAuthButton />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid md:grid-cols-3 gap-6 text-left"
              >
                <div className="p-6 rounded-lg bg-card border">
                  <h3 className="font-semibold mb-2">AI-Powered Generation</h3>
                  <p className="text-sm text-muted-foreground">Generate quizzes instantly based on your subject and topics</p>
                </div>
                <div className="p-6 rounded-lg bg-card border">
                  <h3 className="font-semibold mb-2">Interactive Experience</h3>
                  <p className="text-sm text-muted-foreground">Engaging animations and real-time feedback</p>
                </div>
                <div className="p-6 rounded-lg bg-card border">
                  <h3 className="font-semibold mb-2">Instant Results</h3>
                  <p className="text-sm text-muted-foreground">Detailed analytics and performance insights</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  if (results) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4 py-8">
            <QuizResults />
          </div>
        </div>
      </>
    );
  }

  if (isQuizActive) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4 py-8">
            <QuizInterface />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">Welcome back, {user?.name}!</h2>
            <p className="text-muted-foreground mb-6">Create and manage your interactive quizzes</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {showGenerator ? (
              <motion.div
                key="generator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <QuizGeneratorFormComponent onQuizGenerated={handleQuizGenerated} />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowGenerator(true)}
                    className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    Create New Quiz
                  </motion.button>
                </div>

                {generatedQuizzes.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">Your Quizzes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {generatedQuizzes.map((quiz) => (
                        <QuizCard
                          key={quiz.id}
                          quiz={quiz}
                          onStartQuiz={handleStartQuiz}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}