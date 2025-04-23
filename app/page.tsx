"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Brain, Film, Globe, History, Music, SpaceIcon as Science, Trophy } from "lucide-react"
import { QuestionCountSlider } from "./components/QuestionCountSlider"

interface Category {
  id: number
  name: string
}

interface CategoryCardProps {
  icon: React.ReactNode
  title: string
  questionCount: string
  isCustom?: boolean
  categoryId?: string
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("any")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("any")
  const [questionCount, setQuestionCount] = useState<number>(10)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`)
        }
        const data = await response.json()
        setCategories(data.trivia_categories || [])
        setLoading(false)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleStartGame = () => {
    // Build the URL with query parameters
    let gameUrl = `/game?amount=${questionCount}`
    if (selectedCategory !== "any") gameUrl += `&category=${selectedCategory}`
    if (selectedDifficulty !== "any") gameUrl += `&difficulty=${selectedDifficulty}`
    
    // Navigate to the game page
    window.location.href = gameUrl
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 text-center">
        <div className="max-w-3xl mx-auto px-6 py-12 rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 shadow-lg">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Trivia Challenge
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Test your knowledge with thousands of trivia questions across multiple categories. No account required to
            start playing!
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-6 text-lg"
            onClick={handleStartGame}
          >
            Play Now
          </Button>
        </div>
      </section>

      {/* Game Configuration */}
      <section className="py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Choose your trivia category</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Difficulty</CardTitle>
              <CardDescription>Set your challenge level</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Difficulty</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Number of Questions</CardTitle>
              <CardDescription>How many questions to include</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <QuestionCountSlider value={questionCount} onChange={setQuestionCount} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <CategoryCard icon={<Brain className="h-8 w-8" />} title="General Knowledge" questionCount="1000+" categoryId="9" />
          <CategoryCard icon={<Film className="h-8 w-8" />} title="Film & TV" questionCount="800+" categoryId="11" />
          <CategoryCard icon={<Science className="h-8 w-8" />} title="Science" questionCount="750+" categoryId="17" />
          <CategoryCard icon={<Music className="h-8 w-8" />} title="Music" questionCount="600+" categoryId="12" />
          <CategoryCard icon={<History className="h-8 w-8" />} title="History" questionCount="500+" categoryId="23" />
          <CategoryCard icon={<Globe className="h-8 w-8" />} title="Geography" questionCount="450+" categoryId="22" />
          <CategoryCard icon={<Brain className="h-8 w-8" />} title="Sports" questionCount="400+" categoryId="21" />
          <CategoryCard
            icon={<Trophy className="h-8 w-8" />}
            title="Create Custom Game"
            questionCount="4000+ total questions"
            isCustom={true}
          />
        </div>
      </section>

      {/* Recent High Scores */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">Recent High Scores</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Player</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Difficulty</th>
                <th className="text-left py-3 px-4">Score</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              <HighScoreRow name="TriviaMaster" category="Science" difficulty="Hard" score="9/10" date="1 hour ago" />
              <HighScoreRow name="QuizWhiz" category="History" difficulty="Medium" score="8/10" date="3 hours ago" />
              <HighScoreRow name="BrainiacGamer" category="Film" difficulty="Easy" score="10/10" date="5 hours ago" />
              <HighScoreRow
                name="KnowledgeSeeker"
                category="Geography"
                difficulty="Hard"
                score="7/10"
                date="Yesterday"
              />
              <HighScoreRow name="QuestionQueen" category="Music" difficulty="Medium" score="9/10" date="Yesterday" />
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function CategoryCard({ icon, title, questionCount, isCustom = false, categoryId = "" }: CategoryCardProps) {
  const handleCategoryClick = () => {
    if (isCustom) {
      window.location.href = "/game"
    } else {
      window.location.href = `/game?category=${categoryId}&amount=10`
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="mx-auto bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            {icon}
          </div>
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{questionCount}</p>
          <Button
            variant={isCustom ? "default" : "outline"}
            className={`w-full ${isCustom ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" : ""}`}
            onClick={handleCategoryClick}
          >
            {isCustom ? "Create Custom" : "Play Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface HighScoreRowProps {
  name: string
  category: string
  difficulty: string
  score: string
  date: string
}

function HighScoreRow({ name, category, difficulty, score, date }: HighScoreRowProps) {
  return (
    <tr className="border-b hover:bg-white/50 dark:hover:bg-gray-900/50">
      <td className="py-3 px-4 font-medium">{name}</td>
      <td className="py-3 px-4">{category}</td>
      <td className="py-3 px-4">
        <span
          className={`px-2 py-1 rounded text-xs ${
            difficulty === "Easy"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : difficulty === "Medium"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {difficulty}
        </span>
      </td>
      <td className="py-3 px-4">{score}</td>
      <td className="py-3 px-4 text-muted-foreground">{date}</td>
    </tr>
  )
}

