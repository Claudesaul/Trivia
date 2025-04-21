"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartBars, ChartBar } from "@/components/ui/chart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Award, BookOpen, Calendar, Clock, Edit, History, Medal, Star, Trophy, User } from "lucide-react"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("stats")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-3">
        {/* User Profile Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>Jane Doe</CardTitle>
              <CardDescription>Trivia Enthusiast</CardDescription>
              <div className="flex justify-center gap-2 mt-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  Level 8
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  1,245 pts
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">@janedoe</div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">Joined March 2023</div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">124 games played</div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-medium">Top Categories</h3>
                <div className="space-y-1.5">
                  <CategoryBadge name="Science" score="92%" />
                  <CategoryBadge name="History" score="87%" />
                  <CategoryBadge name="Geography" score="83%" />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-medium">Recent Achievements</h3>
                <div className="space-y-2">
                  <AchievementBadge
                    icon={<Award className="h-4 w-4" />}
                    name="Perfect Score"
                    description="Answered all questions correctly"
                  />
                  <AchievementBadge
                    icon={<Medal className="h-4 w-4" />}
                    name="Speed Demon"
                    description="Completed a game in under 2 minutes"
                  />
                  <AchievementBadge
                    icon={<BookOpen className="h-4 w-4" />}
                    name="Knowledge Seeker"
                    description="Played in 10 different categories"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </CardFooter>
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
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>Your trivia performance across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer categories={["Science", "History", "Geography", "Film", "Music", "Sports"]}>
                      <ChartBars>
                        <ChartBar value={92} name="Science" />
                        <ChartBar value={87} name="History" />
                        <ChartBar value={83} name="Geography" />
                        <ChartBar value={76} name="Film" />
                        <ChartBar value={68} name="Music" />
                        <ChartBar value={54} name="Sports" />
                      </ChartBars>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Difficulty Breakdown</CardTitle>
                    <CardDescription>Your performance by difficulty level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Easy</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Medium</span>
                          <span className="font-medium">78%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "78%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Hard</span>
                          <span className="font-medium">64%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "64%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                    <CardDescription>Your trivia journey in numbers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <StatCard title="Total Games" value="124" />
                      <StatCard title="Questions Answered" value="1,240" />
                      <StatCard title="Correct Answers" value="952" />
                      <StatCard title="Accuracy" value="76.8%" />
                      <StatCard title="Avg. Time/Question" value="8.2s" />
                      <StatCard title="Perfect Games" value="7" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Games</CardTitle>
                  <CardDescription>Your last 10 trivia games</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <GameHistoryItem
                      date="Today, 2:15 PM"
                      category="Science & Nature"
                      difficulty="Medium"
                      score="8/10"
                      percentage={80}
                    />
                    <GameHistoryItem
                      date="Yesterday, 7:30 PM"
                      category="History"
                      difficulty="Hard"
                      score="7/10"
                      percentage={70}
                    />
                    <GameHistoryItem
                      date="Yesterday, 6:45 PM"
                      category="Geography"
                      difficulty="Medium"
                      score="9/10"
                      percentage={90}
                    />
                    <GameHistoryItem
                      date="Mar 12, 2023"
                      category="Film"
                      difficulty="Easy"
                      score="10/10"
                      percentage={100}
                    />
                    <GameHistoryItem
                      date="Mar 10, 2023"
                      category="Music"
                      difficulty="Medium"
                      score="6/10"
                      percentage={60}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Games
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements & Badges</CardTitle>
                  <CardDescription>Rewards for your trivia accomplishments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <BadgeCard
                      icon={<Trophy className="h-8 w-8" />}
                      title="Trivia Master"
                      description="Reach Level 10"
                      progress={80}
                    />
                    <BadgeCard
                      icon={<Award className="h-8 w-8" />}
                      title="Perfect Score"
                      description="Get all questions right"
                      progress={100}
                      completed
                    />
                    <BadgeCard
                      icon={<Star className="h-8 w-8" />}
                      title="Rising Star"
                      description="Win 5 games in a row"
                      progress={60}
                    />
                    <BadgeCard
                      icon={<Clock className="h-8 w-8" />}
                      title="Speed Demon"
                      description="Complete a game in under 2 minutes"
                      progress={100}
                      completed
                    />
                    <BadgeCard
                      icon={<BookOpen className="h-8 w-8" />}
                      title="Knowledge Seeker"
                      description="Play in 10 different categories"
                      progress={100}
                      completed
                    />
                    <BadgeCard
                      icon={<History className="h-8 w-8" />}
                      title="Dedicated Player"
                      description="Play 100 games"
                      progress={100}
                      completed
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function CategoryBadge({ name, score }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{name}</span>
      <Badge variant="outline">{score}</Badge>
    </div>
  )
}

function AchievementBadge({ icon, name, description }) {
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

function StatCard({ title, value }) {
  return (
    <div className="border rounded-lg p-3">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  )
}

function GameHistoryItem({ date, category, difficulty, score, percentage }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-medium">{category}</h4>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
        <Badge variant={difficulty === "Easy" ? "outline" : difficulty === "Medium" ? "secondary" : "destructive"}>
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

function BadgeCard({ icon, title, description, progress, completed = false }) {
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

