'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getQuizResponses } from '@/lib/quiz-database'
import { useAuthStore } from '@/stores/auth-store'
import { Result } from '@/types/result.type'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { ArrowLeft, Calendar, Clock, Trophy, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'

// Specific type for database responses
interface DatabaseQuizResult {
  id: string
  user_id: string | null
  participant_name: string | null
  score: number
  total_questions: number
  time_spent: number
  completed_at: string
  created_at: string
  // User information
  user_profile?: {
    email: string
    raw_user_meta_data?: {
      name?: string
      username?: string
    }
  }
}

interface QuizResponsesPageProps {
  params: Promise<{
    id: string
  }>
}

export default function QuizResponsesPage({ params }: QuizResponsesPageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user } = useAuthStore()
  const [responses, setResponses] = useState<DatabaseQuizResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quizTitle, setQuizTitle] = useState<string>('')
  const [activeTab, setActiveTab] = useState('my-responses')

  useEffect(() => {
    const loadResponses = async () => {
      if (!user) {
        router.push('/login')
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const result: Result<DatabaseQuizResult[]> = await getQuizResponses(
          resolvedParams.id,
          user.id,
        )

        if (result.success && result.data) {
          setResponses(result.data)
        } else {
          setError(result.errorMessage || 'Error loading responses')
        }
      } catch (err: any) {
        setError('Unexpected error loading responses')
      } finally {
        setIsLoading(false)
      }
    }

    loadResponses()
  }, [user, resolvedParams.id, router])

  const handleBackToQuiz = () => {
    router.push('/dashboard')
  }

  const handleViewDetails = (resultId: string) => {
    router.push(`/quiz/${resolvedParams.id}/responses/${resultId}`)
  }

  const getUserDisplayName = (response: DatabaseQuizResult): string => {
    // Debug logging to help identify the issue
    console.log('getUserDisplayName (responses) called with:', {
      user_id: response.user_id,
      participant_name: response.participant_name,
      user_profile: response.user_profile,
    })

    // If it's the current user, show their information
    if (user && response.user_id === user.id) {
      return user.name || user.username || user.email?.split('@')[0] || 'You'
    }

    // For anonymous users with participant name
    if (!response.user_id && response.participant_name) {
      return response.participant_name
    }

    // For other authenticated users, show limited information for privacy
    const metadata = response.user_profile?.raw_user_meta_data
    return (
      metadata?.name ||
      metadata?.username ||
      response.user_profile?.email?.split('@')[0] ||
      'Anonymous User'
    )
  }

  // Separate responses into my responses and others' responses
  const myResponses = responses.filter(
    (response) => user && response.user_id === user.id,
  )
  const otherResponses = responses.filter(
    (response) => !user || response.user_id !== user.id,
  )

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Function to render response list
  const renderResponseList = (
    responseList: DatabaseQuizResult[],
    emptyMessage: string,
  ) => {
    if (responseList.length === 0) {
      return (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No attempts yet</h3>
              <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {responseList.map((response, index) => (
          <Card key={response.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold">
                      Attempt #{responseList.length - index}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(response.completed_at), 'PPp', {
                        locale: enUS,
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span
                        className={`font-semibold ${getScoreColor(
                          response.score,
                          response.total_questions,
                        )}`}
                      >
                        {response.score}/{response.total_questions}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        (
                        {Math.round(
                          (response.score / response.total_questions) * 100,
                        )}
                        %)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {formatTime(response.time_spent)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm">
                        User: {getUserDisplayName(response)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(response.id)}
                >
                  View details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-destructive mb-2">
                  Error
                </h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={handleBackToQuiz}>Back to Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBackToQuiz} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold mb-2">Quiz Responses</h1>
          <p className="text-muted-foreground">
            All attempts made on this quiz
          </p>
        </div>

        {/* General statistics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              General Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {responses.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total attempts
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {(() => {
                    if (responses.length === 0) return 0

                    // Calcular el promedio de porcentajes individuales
                    const validResponses = responses.filter(
                      (r) => r.total_questions > 0,
                    )
                    if (validResponses.length === 0) return 0

                    const averagePercentage =
                      validResponses.reduce((sum, r) => {
                        const percentage = (r.score / r.total_questions) * 100
                        return sum + percentage
                      }, 0) / validResponses.length

                    // Asegurar que el resultado esté entre 0 y 100
                    return Math.round(
                      Math.min(100, Math.max(0, averagePercentage)),
                    )
                  })()}
                  %
                </div>
                <div className="text-sm text-muted-foreground">
                  Average score
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {responses.length > 0
                    ? formatTime(
                        Math.round(
                          responses.reduce((sum, r) => sum + r.time_spent, 0) /
                            responses.length,
                        ),
                      )
                    : '0m 0s'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Average time
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Response Lists */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="my-responses"
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              My Responses ({myResponses.length})
            </TabsTrigger>
            <TabsTrigger
              value="other-responses"
              className="flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Other Responses ({otherResponses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-responses" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Quiz Attempts</h2>
                <div className="text-sm text-muted-foreground">
                  {myResponses.length} attempt
                  {myResponses.length !== 1 ? 's' : ''}
                </div>
              </div>
              {renderResponseList(
                myResponses,
                "You haven't taken this quiz yet.",
              )}
            </div>
          </TabsContent>

          <TabsContent value="other-responses" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Other Users' Attempts</h2>
                <div className="text-sm text-muted-foreground">
                  {otherResponses.length} attempt
                  {otherResponses.length !== 1 ? 's' : ''} by other users
                </div>
              </div>
              {renderResponseList(
                otherResponses,
                'No other users have taken this quiz yet.',
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
