"use client";
import { HomePage } from "@/modules/home/pages/HomePage";
import { LandingPage } from "@/modules/landing/pages/LandingPage";
import { QuizPage } from "@/modules/quiz/pages/QuizPage";
import { QuizResultsPage } from "@/modules/quiz/pages/QuizResultsPage";
import { useAuthStore } from "@/stores/auth-store";
import { useQuizStore } from "@/stores/quiz-store";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const { isQuizActive, results } = useQuizStore();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  if (results) {
    return <QuizResultsPage />;
  }

  if (isQuizActive) {
    return <QuizPage />;
  }

  return <HomePage />;
}
