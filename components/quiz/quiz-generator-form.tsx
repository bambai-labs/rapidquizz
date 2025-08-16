"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateQuiz } from '@/lib/quiz-generator';
import { useAuthStore } from '@/stores/auth-store';
import { useQuizGeneratorStore } from '@/stores/quiz-generator-store';
import { QuizGeneratorSchema } from '@/types/quiz';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Sparkles, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

interface QuizGeneratorFormProps {
  onQuizGenerated?: () => void;
}

export function QuizGeneratorFormComponent({ onQuizGenerated }: QuizGeneratorFormProps) {
  const { user } = useAuthStore();
  const { isGenerating, addGeneratedQuiz, setIsGenerating, setError } = useQuizGeneratorStore();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(QuizGeneratorSchema),
    defaultValues: {
      subject: '',
      topics: [''],
      difficulty: 'medium',
      questionCount: 5,
      timeLimit: 30,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'topics' as never,
  });

  const difficulty = watch('difficulty');

  const onSubmit = async (data: any) => {
    if (!user) return;

    setIsGenerating(true);
    setError(null);

    try {
      const quiz = await generateQuiz(data, user.id);
      addGeneratedQuiz(quiz);
      onQuizGenerated?.();
    } catch (error) {
      setError('Failed to generate quiz. Please try again.');
      console.error('Quiz generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addTopic = () => {
    append('');
  };

  const removeTopic = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Generate Quiz
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Subject */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g., Mathematics, Science, History"
              {...register('subject')}
              className={errors.subject ? 'border-destructive' : ''}
            />
            {errors.subject && (
              <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
            )}
          </motion.div>

          {/* Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <Label>Topics</Label>
            <AnimatePresence>
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder={`Topic ${index + 1}`}
                    {...register(`topics.${index}` as const)}
                    className={errors.topics?.[index] ? 'border-destructive' : ''}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeTopic(index)}
                      className="shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            <Button
              type="button"
              variant="outline"
              onClick={addTopic}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Topic
            </Button>
            
            {errors.topics && (
              <p className="text-sm text-destructive">{errors.topics.message}</p>
            )}
          </motion.div>

          {/* Difficulty and Question Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select onValueChange={(value: any) => setValue('difficulty', value)} defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="questionCount">Number of Questions</Label>
              <Input
                id="questionCount"
                type="number"
                min="1"
                max="20"
                {...register('questionCount', { valueAsNumber: true })}
                className={errors.questionCount ? 'border-destructive' : ''}
              />
              {errors.questionCount && (
                <p className="text-sm text-destructive mt-1">{errors.questionCount.message}</p>
              )}
            </div>
          </motion.div>

          {/* Time Limit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Label htmlFor="timeLimit">Time Limit (minutes, optional)</Label>
            <Input
              id="timeLimit"
              type="number"
              min="1"
              max="120"
              placeholder="30"
              {...register('timeLimit', { valueAsNumber: true })}
              className={errors.timeLimit ? 'border-destructive' : ''}
            />
            {errors.timeLimit && (
              <p className="text-sm text-destructive mt-1">{errors.timeLimit.message}</p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Generating Quiz...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate Quiz
                </div>
              )}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}