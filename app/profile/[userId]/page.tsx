"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Award, BookOpen, Calendar, Clock, History, Medal, Star, Trophy, User } from "lucide-react"
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Define user type
type UserProfile = {
  id: string
  username: string
  display_name?: string
  avatar_url?: string
  total_points: number
  created_at: string
}

// Define game score type
type GameScore = {
  id: string
  created_at: string
  category: string
  difficulty: string
  score: number
  total_questions: number
  user_id: string
}

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("stats")
  const [scores, setScores] = useState<GameScore[]>([])
  const [loadingScores, setLoadingScores] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', params.userId)
          .single()

        if (userError) throw userError
        
        if (!userData) {
          setError('User not found')
          setIsLoading(false)
          return
        }

        setUser(userData as UserProfile)

        // Fetch scores for this user
        const { data: scoresData, error: scoresError } = await supabase
          .from('game_scores')
          .select('*')
          .eq('user_id', params.userId)
          .order('created_at', { ascending: false })

        if (scoresError) throw scoresError
        setScores(scoresData || [])
        setLoadingScores(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('Failed to load user data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [params.userId])

  if (isLoading) {
    return <div className="container mx-auto p-8">Loading user profile...</div>
  }

  if (error || !user) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || 'User not found'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')}>Return to Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate user stats
  const totalGames = scores.length
  const totalQuestions = scores.reduce((sum, game) => sum + game.total_questions, 0)
  const correctAnswers = scores.reduce((sum, game) => sum + game.score, 0)
  const accuracy = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100 * 10) / 10 : 0
  const perfectGames = scores.filter(game => game.score === game.total_questions).length

  // Calculate category performance
  const categoryPerformance = scores.reduce((acc, game) => {
    if (!acc[game.category]) {
      acc[game.category] = { correct: 0, total: 0 }
    }
    acc[game.category].correct += game.score
    acc[game.category].total += game.total_questions
    return acc
  }, {} as Record<string, { correct: number; total: number }>)

  // Convert to sorted array with percentages
  const topCategories = Object.entries(categoryPerformance)
    .map(([name, stats]) => ({ 
      name, 
      percentage: Math.round((stats.correct / stats.total) * 100) 
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3)
  
  // Calculate difficulty breakdown
  const difficultyBreakdown = scores.reduce((acc, game) => {
    if (!acc[game.difficulty]) {
      acc[game.difficulty] = { correct: 0, total: 0 }
    }
    acc[game.difficulty].correct += game.score
    acc[game.difficulty].total += game.total_questions
    return acc
  }, {} as Record<string, { correct: number; total: number }>)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-3">
        {/* User Profile Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-user.jpg" alt={user.display_name || user.username} />
                  <AvatarFallback>{(user.display_name?.[0] || user.username[0]).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{user.display_name || user.username}</CardTitle>
              <CardDescription>Trivia Enthusiast</CardDescription>
              <div className="flex justify-center gap-2 mt-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  Level {Math.floor(totalGames / 10) + 1}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {user.total_points} pts
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">{user.username}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">Joined {new Date(user.created_at || Date.now()).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">{totalGames} games played</div>
                </div>
              </div>

              {topCategories.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h3 className="text-sm font-medium">Top Categories</h3>
                  <div className="space-y-1.5">
                    {topCategories.map(category => (
                      <CategoryBadge 
                        key={category.name} 
                        name={category.name} 
                        score={`${category.percentage}%`} 
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-medium">Achievements</h3>
                <div className="space-y-2">
                  {perfectGames > 0 && (
                    <AchievementBadge
                      icon={<Award className="h-4 w-4" />}
                      name="Perfect Score"
                      description="Answered all questions correctly"
                    />
                  )}
                  {totalGames >= 10 && (
                    <AchievementBadge
                      icon={<Medal className="h-4 w-4" />}
                      name="Dedicated Player"
                      description="Played at least 10 games"
                    />
                  )}
                  {Object.keys(categoryPerformance).length >= 5 && (
                    <AchievementBadge
                      icon={<BookOpen className="h-4 w-4" />}
                      name="Knowledge Seeker"
                      description="Played in 5+ different categories"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="history">Game History</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="mt-6 space-y-6">
              {loadingScores ? (
                <div>Loading stats...</div>
              ) : scores.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Stats Available</CardTitle>
                    <CardDescription>This user hasn't played any games yet!</CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <>
                  {topCategories.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Overview</CardTitle>
                        <CardDescription>Trivia performance across categories</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {topCategories.map(category => (
                            <div key={category.name}>
                              <div className="flex justify-between mb-1 text-sm">
                                <span>{category.name}</span>
                                <span className="font-medium">{category.percentage}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div 
                                  className="bg-primary h-2.5 rounded-full" 
                                  style={{ width: `${category.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid gap-6 sm:grid-cols-2">
                    {Object.keys(difficultyBreakdown).length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Difficulty Breakdown</CardTitle>
                          <CardDescription>Performance by difficulty level</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {Object.entries(difficultyBreakdown).map(([difficulty, stats]) => {
                              const percentage = Math.round((stats.correct / stats.total) * 100)
                              let colorClass = "bg-blue-500"
                              
                              if (difficulty === "easy") colorClass = "bg-green-500"
                              else if (difficulty === "medium") colorClass = "bg-yellow-500"
                              else if (difficulty === "hard") colorClass = "bg-red-500"
                              
                              return (
                                <div key={difficulty}>
                                  <div className="flex justify-between mb-1 text-sm">
                                    <span>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
                                    <span className="font-medium">{percentage}%</span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2.5">
                                    <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                        <CardDescription>Trivia journey in numbers</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <StatCard title="Total Games" value={totalGames.toString()} />
                          <StatCard title="Questions Answered" value={totalQuestions.toString()} />
                          <StatCard title="Correct Answers" value={correctAnswers.toString()} />
                          <StatCard title="Accuracy" value={`${accuracy}%`} />
                          <StatCard title="Categories Played" value={Object.keys(categoryPerformance).length.toString()} />
                          <StatCard title="Perfect Games" value={perfectGames.toString()} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Games</CardTitle>
                  <CardDescription>Recent trivia games</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingScores ? (
                    <div>Loading game history...</div>
                  ) : scores.length === 0 ? (
                    <div>This user hasn't played any games yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {scores.slice(0, 10).map(score => {
                        const date = new Date(score.created_at)
                        const percentage = Math.round((score.score / score.total_questions) * 100)
                        
                        return (
                          <GameHistoryItem
                            key={score.id}
                            date={date.toLocaleString()}
                            category={score.category || "Mixed Categories"}
                            difficulty={score.difficulty.charAt(0).toUpperCase() + score.difficulty.slice(1)}
                            score={`${score.score}/${score.total_questions}`}
                            percentage={percentage}
                          />
                        )
                      })}
                    </div>
                  )}
                </CardContent>
                {scores.length > 10 && (
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Games
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements & Badges</CardTitle>
                  <CardDescription>Rewards for trivia accomplishments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <BadgeCard
                      icon={<Trophy className="h-8 w-8" />}
                      title="Trivia Master"
                      description="Reach Level 10"
                      progress={Math.min(100, Math.floor((totalGames / 100) * 100))}
                      completed={totalGames >= 100}
                    />
                    <BadgeCard
                      icon={<Award className="h-8 w-8" />}
                      title="Perfect Score"
                      description="Get all questions right"
                      progress={perfectGames > 0 ? 100 : 0}
                      completed={perfectGames > 0}
                    />
                    <BadgeCard
                      icon={<Star className="h-8 w-8" />}
                      title="Rising Star"
                      description="Win 5 games in a row"
                      progress={Math.min(100, (totalGames / 5) * 100)}
                      completed={totalGames >= 5}
                    />
                    <BadgeCard
                      icon={<Clock className="h-8 w-8" />}
                      title="Speed Demon"
                      description="Complete a game in under 2 minutes"
                      progress={60}
                    />
                    <BadgeCard
                      icon={<BookOpen className="h-8 w-8" />}
                      title="Knowledge Seeker"
                      description="Play in 5 different categories"
                      progress={Math.min(100, (Object.keys(categoryPerformance).length / 5) * 100)}
                      completed={Object.keys(categoryPerformance).length >= 5}
                    />
                    <BadgeCard
                      icon={<History className="h-8 w-8" />}
                      title="Dedicated Player"
                      description="Play 10 games"
                      progress={Math.min(100, (totalGames / 10) * 100)}
                      completed={totalGames >= 10}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}

function CategoryBadge({ name, score }: { name: string; score: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{name}</span>
      <Badge variant="outline">{score}</Badge>
    </div>
  )
}

function AchievementBadge({ icon, name, description }: { icon: React.ReactNode; name: string; description: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="bg-primary/10 p-1.5 rounded-full">{icon}</div>
      <div>
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="border rounded-lg p-3">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  )
}

function GameHistoryItem({ date, category, difficulty, score, percentage }: 
  { date: string; category: string; difficulty: string; score: string; percentage: number }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-medium">{category}</h4>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
        <Badge variant={
          difficulty.toLowerCase() === "easy" 
            ? "outline" 
            : difficulty.toLowerCase() === "medium" 
              ? "secondary" 
              : "destructive"
        }>
          {difficulty}
        </Badge>
      </div>
      <div className="flex justify-between items-center">
        <div className="font-medium">{score}</div>
        <div className="w-2/3">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                percentage >= 80 ? "bg-green-500" : percentage >= 60 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BadgeCard({ icon, title, description, progress, completed = false }: 
  { icon: React.ReactNode; title: string; description: string; progress: number; completed?: boolean }) {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center text-center">
      <div className={`p-3 rounded-full mb-3 ${completed ? "bg-primary/20" : "bg-muted"}`}>{icon}</div>
      <h4 className="font-medium mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      <div className="w-full bg-muted rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full ${completed ? "bg-primary" : "bg-primary/60"}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-xs font-medium">{completed ? "Completed" : `${progress}% Complete`}</div>
    </div>
  )
}