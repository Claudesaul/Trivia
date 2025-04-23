"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Database, Github, Globe, Info, Users } from "lucide-react"

interface CategoryCount {
  id: number
  name: string
  count: {
    total_question_count: number
    total_easy_question_count: number
    total_medium_question_count: number
    total_hard_question_count: number
  }
  error?: string
}

export default function AboutPage() {
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const response = await fetch('/api/category-counts')
        if (!response.ok) {
          throw new Error(`Failed to fetch category counts: ${response.status}`)
        }
        const data = await response.json()
        setCategoryCounts(data.categories || [])
        setLoading(false)
      } catch (err) {
        console.error('Error fetching category counts:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        setLoading(false)
      }
    }

    fetchCategoryCounts()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-6">About Trivia Challenge</h1>

        <Tabs defaultValue="project">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="project">Project</TabsTrigger>
            <TabsTrigger value="data">Data Source</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="project" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Project Purpose & Goals
                </CardTitle>
                <CardDescription>Learn about our mission and what we're trying to achieve</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Trivia Challenge was created to provide a free, accessible platform for trivia enthusiasts of all
                  levels. Our goal is to make trivia games available to everyone without barriers like mandatory
                  accounts, paywalls, or complicated interfaces.
                </p>
                <h3 className="text-xl font-bold mt-6">Our Mission</h3>
                <p>
                  We believe knowledge should be fun and accessible. Our mission is to create an engaging platform that
                  helps people learn while having fun, connect with friends through shared experiences, and challenge
                  themselves with interesting questions across a wide range of topics.
                </p>
                <h3 className="text-xl font-bold mt-6">Key Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Instant access to thousands of verified trivia questions</li>
                  <li>Customizable game settings (categories, difficulty, question count)</li>
                  <li>No account required to play</li>
                  <li>Optional accounts to track progress and compete on leaderboards</li>
                  <li>Mobile-friendly design for trivia on the go</li>
                  <li>Regular updates with fresh questions</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Trivia Data Source
                </CardTitle>
                <CardDescription>Information about where our questions come from</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Trivia Challenge uses the Open Trivia Database (OpenTDB) as our primary source of questions. This
                  free, user-contributed trivia question database provides access to thousands of verified questions
                  across multiple categories and difficulty levels.
                </p>
                <h3 className="text-xl font-bold mt-6">About Open Trivia Database</h3>
                <p>
                  The Open Trivia Database provides a completely free JSON API for use in programming projects. The
                  database currently contains over 4,000 verified questions in 24 categories. All questions are
                  available in multiple-choice format, with many also available in boolean (True/False) format.
                </p>
                <p className="mt-4">
                  Questions in the database are contributed and maintained by the community, ensuring a diverse and
                  constantly growing collection of trivia.
                </p>
                <h3 className="text-xl font-bold mt-6">API Integration</h3>
                <p>
                  We use the OpenTDB API to fetch questions based on user preferences. The API allows us to filter
                  questions by category, difficulty, and type, providing a customized experience for each game session.
                </p>
                <p className="mt-4">
                  API Endpoint: <code className="bg-muted px-2 py-1 rounded">https://opentdb.com/api_config.php</code>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Category Breakdown
                </CardTitle>
                <CardDescription>Explore the different categories available in our trivia games</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading categories...</div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {categoryCounts.map((category) => (
                      <CategoryCard 
                        key={category.id} 
                        name={category.name} 
                        count={category.count} 
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Information
                </CardTitle>
                <CardDescription>Meet the people behind Trivia Challenge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold">Our Team</h3>
                  <p className="mt-2">
                    Trivia Challenge was developed as a class project by a team of passionate developers who love trivia
                    and wanted to create a free, accessible platform for everyone to enjoy.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <TeamMemberCard
                    name="Alex Johnson"
                    role="Project Lead & Frontend Developer"
                    bio="Computer Science student with a passion for creating intuitive user interfaces and accessible web applications."
                  />
                  <TeamMemberCard
                    name="Sam Rodriguez"
                    role="Backend Developer"
                    bio="Specializes in API integration and database management. Loves creating efficient systems that can handle complex data."
                  />
                  <TeamMemberCard
                    name="Taylor Kim"
                    role="UI/UX Designer"
                    bio="Focused on creating engaging, accessible designs that make trivia fun and easy for everyone to enjoy."
                  />
                  <TeamMemberCard
                    name="Jordan Smith"
                    role="Full-Stack Developer"
                    bio="Handles both frontend and backend tasks, with a special interest in game mechanics and scoring systems."
                  />
                </div>

                <div className="mt-8 text-center">
                  <p className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Github className="h-4 w-4" />
                    This project is open source. Contribute on GitHub!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface CategoryCardProps {
  name: string
  count: {
    total_question_count: number
    total_easy_question_count: number
    total_medium_question_count: number
    total_hard_question_count: number
  }
}

function CategoryCard({ name, count }: CategoryCardProps) {
  return (
    <div className="flex flex-col p-3 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Brain className="h-4 w-4" />
          </div>
          <span className="font-medium">{name}</span>
        </div>
        <span className="text-sm bg-muted px-2 py-1 rounded-full">{count.total_question_count} questions</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        <div className="flex flex-col items-center p-1 bg-green-50 dark:bg-green-900/20 rounded">
          <span className="font-medium text-green-700 dark:text-green-400">Easy</span>
          <span>{count.total_easy_question_count}</span>
        </div>
        <div className="flex flex-col items-center p-1 bg-yellow-50 dark:bg-yellow-900/20 rounded">
          <span className="font-medium text-yellow-700 dark:text-yellow-400">Medium</span>
          <span>{count.total_medium_question_count}</span>
        </div>
        <div className="flex flex-col items-center p-1 bg-red-50 dark:bg-red-900/20 rounded">
          <span className="font-medium text-red-700 dark:text-red-400">Hard</span>
          <span>{count.total_hard_question_count}</span>
        </div>
      </div>
    </div>
  )
}

interface TeamMemberCardProps {
  name: string
  role: string
  bio: string
}

function TeamMemberCard({ name, role, bio }: TeamMemberCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="h-8 w-8" />
      </div>
      <h4 className="font-bold text-center">{name}</h4>
      <p className="text-sm text-primary text-center mb-2">{role}</p>
      <p className="text-sm text-muted-foreground text-center">{bio}</p>
    </div>
  )
}

