import { Quiz, QuizGeneratorForm, QuizQuestion } from '@/types/quiz';

// Mock quiz generation - In a real app, this would call an AI service or API
export async function generateQuiz(formData: QuizGeneratorForm, userId: string): Promise<Quiz> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const sampleQuestions: Partial<QuizQuestion>[] = [
    {
      question: `What is a fundamental concept in ${formData.subject}?`,
      options: [
        "Basic principle",
        "Advanced technique", 
        "Complex theory",
        "Simple rule"
      ],
      correctAnswer: 0,
      explanation: "This represents a foundational understanding of the subject."
    },
    {
      question: `Which of the following best describes ${formData.topics[0]}?`,
      options: [
        "Primary concept",
        "Secondary idea",
        "Tertiary notion", 
        "Quaternary element"
      ],
      correctAnswer: 0,
      explanation: "This is the most accurate description of the topic."
    },
    {
      question: `How does ${formData.subject} relate to practical applications?`,
      options: [
        "Through direct implementation",
        "Via theoretical frameworks",
        "By abstract reasoning",
        "Using complex models"
      ],
      correctAnswer: 0,
      explanation: "Practical implementation is the most direct relationship."
    },
    {
      question: `What is the importance of understanding ${formData.topics[0]} in ${formData.subject}?`,
      options: [
        "Essential for mastery",
        "Helpful but optional",
        "Completely unnecessary",
        "Only for experts"
      ],
      correctAnswer: 0,
      explanation: "Understanding core topics is essential for subject mastery."
    },
    {
      question: `Which approach is most effective when studying ${formData.subject}?`,
      options: [
        "Systematic learning",
        "Random exploration",
        "Memorization only",
        "Passive reading"
      ],
      correctAnswer: 0,
      explanation: "Systematic learning provides the best foundation."
    }
  ];

  const questions: QuizQuestion[] = sampleQuestions
    .slice(0, formData.questionCount)
    .map((q, index) => ({
      id: `q-${Date.now()}-${index}`,
      question: q.question!,
      options: q.options!,
      correctAnswer: q.correctAnswer!,
      explanation: q.explanation,
    }));

  const quiz: Quiz = {
    id: `quiz-${Date.now()}`,
    title: `${formData.subject} - ${formData.topics.join(', ')} Quiz`,
    subject: formData.subject,
    topics: formData.topics,
    questions,
    createdAt: new Date(),
    createdBy: userId,
    difficulty: formData.difficulty,
    timeLimit: formData.timeLimit,
  };

  return quiz;
}