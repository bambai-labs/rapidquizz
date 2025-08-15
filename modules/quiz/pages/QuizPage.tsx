import { QuizInterface } from "@/components/quiz/quiz-interface";

export const QuizPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <QuizInterface />
      </div>
    </div>
  );
};
