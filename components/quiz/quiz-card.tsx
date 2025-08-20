'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Quiz } from '@/types/quiz'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { BookOpen, Calendar, Clock, Edit } from 'lucide-react'

interface QuizCardProps {
  quiz: Quiz
  onStartQuiz: (quiz: Quiz) => void
  onEditQuiz: (quiz: Quiz) => void
}

export function QuizCard({ quiz, onStartQuiz, onEditQuiz }: QuizCardProps) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    hard: 'bg-red-100 text-red-800 border-red-200',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg line-clamp-2">{quiz.title}</CardTitle>
            <Badge className={`ml-2 ${difficultyColors[quiz.difficulty]}`}>
              {quiz.difficulty}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">{quiz.subject}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {quiz.topics.map((topic, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{quiz.questions.length} questions</span>
            </div>
            {quiz.timeLimit && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{quiz.timeLimit} min</span>
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>Created {format(quiz.createdAt, 'MMM dd, yyyy')}</span>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            onClick={() => onStartQuiz(quiz)}
            className="w-full"
            size="sm"
          >
            Start Quiz
          </Button>
          <Button
            onClick={() => onEditQuiz(quiz)}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Quiz
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
