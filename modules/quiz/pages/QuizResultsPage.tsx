import { QuizResults } from "@/components/quiz/quiz-results";

export const QuizResultsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <QuizResults />
      </div>
    </div>
  );
};
