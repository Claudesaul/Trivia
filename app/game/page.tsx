"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, ChevronRight, Clock, XCircle } from "lucide-react"
import { useUser } from "@/context/UserContext"
import { decode } from 'html-entities'

interface TriviaQuestion {
  type: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

export default function GamePage() {
  // State
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [isAnswered, setIsAnswered] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [questions, setQuestions] = useState<TriviaQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([])
  const [scoreSaved, setScoreSaved] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)
  
  // References and context
  const answersRef = useRef<string[]>([])
  const { user } = useUser()

  // Fetch questions when component mounts
  useEffect(() => {
    async function fetchQuestions() {
      try {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search)
        const category = params.get('category')
        const difficulty = params.get('difficulty')
        const amount = params.get('amount') || '5'

        // Build API URL with parameters
        let apiUrl = `/api/trivia?amount=${amount}`
        if (category && category !== 'any') apiUrl += `&category=${category}`
        if (difficulty && difficulty !== 'any') apiUrl += `&difficulty=${difficulty}`

        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('No questions received from the API')
        }
        
        setQuestions(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching questions:', error)
        setError(error instanceof Error ? error.message : 'An error occurred')
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  // Shuffle answers when moving to a new question
  useEffect(() => {
    if (questions.length > 0 && currentQuestion < questions.length) {
      const currentQ = questions[currentQuestion]
      const allAnswers = [...currentQ.incorrect_answers, currentQ.correct_answer]

      // Shuffle answers
      const shuffled = [...allAnswers].sort(() => Math.random() - 0.5)
      setShuffledAnswers(shuffled)
      answersRef.current = shuffled
    }
  }, [currentQuestion, questions])

  // Timer effect - count down for each question
  useEffect(() => {
    if (loading || gameOver || isAnswered) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // We need to call handleAnswer without referencing the function directly
          // to avoid dependency issues
          if (!isAnswered) {
            setIsAnswered(true);
            setSelectedAnswer("");
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [loading, gameOver, isAnswered])

  // Reset timer when moving to next question
  useEffect(() => {
    setTimeLeft(15)
  }, [currentQuestion])

  // Handle saving score when game is over
  useEffect(() => {
    // Only run when game is over and user is logged in and score isn't saved yet
    if (gameOver && user && !scoreSaved) {
      saveGameScore()
    }
  }, [gameOver, user, scoreSaved])

  // Function to save game score
  async function saveGameScore() {
    try {
      // Get category name from the first question or use a default
      let categoryName = 'Mixed'
      if (questions.length > 0) {
        categoryName = decode(questions[0].category)
      }
      
      // Get parameters from the URL
      const params = new URLSearchParams(window.location.search)
      const difficultyParam = params.get('difficulty') || 'medium'
      
      // Prepare score data
      const scoreData = {
        user_id: user!.id,
        category: categoryName,
        difficulty: difficultyParam !== 'any' ? difficultyParam : questions.length > 0 ? questions[0].difficulty : 'medium',
        score: score,
        total_questions: questions.length,
        time_taken: 0 // We're not tracking time
      }
      
      // Send score to the API
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scoreData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to save score')
      }
      
      setScoreSaved(true)
      console.log('Score saved successfully')
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  // Handle selecting an answer
  function handleAnswer(answer: string) {
    if (isAnswered) return

    setIsAnswered(true)
    setSelectedAnswer(answer)

    if (answer === questions[currentQuestion].correct_answer) {
      // Award points based on difficulty
      const difficultyPoints =
        questions[currentQuestion].difficulty === "easy"
          ? 1
          : questions[currentQuestion].difficulty === "medium"
            ? 2
            : 3

      setScore(score + difficultyPoints)
    }
  }

  // Move to next question or end game
  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
      setIsAnswered(false)
    } else {
      setGameOver(true)
    }
  }

  // Restart the game with the same settings
  function restartGame() {
    // Get current URL parameters
    const params = new URLSearchParams(window.location.search)
    const category = params.get('category')
    const difficulty = params.get('difficulty')
    const amount = params.get('amount') || '10'
    
    // Build the URL with the same parameters
    let gameUrl = `/game?amount=${amount}`
    if (category) gameUrl += `&category=${category}`
    if (difficulty) gameUrl += `&difficulty=${difficulty}`
    
    // Navigate to the same game with the same settings
    window.location.href = gameUrl
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-2xl shadow-lg bg-white/90 dark:bg-gray-900/90">
          <CardHeader className="text-center">
            <CardTitle>Loading Trivia Questions</CardTitle>
            <CardDescription>Preparing your trivia challenge...</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="w-full max-w-md">
              <Progress value={45} className="h-2 mb-4" />
            </div>
            <p className="text-muted-foreground">This will just take a moment</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-2xl shadow-lg bg-white/90 dark:bg-gray-900/90">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              Error Loading Questions
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Game over state
  if (gameOver) {
    const totalQuestions = questions.length
    const maxPossibleScore = questions.reduce((total, q) => {
      return total + (q.difficulty === "easy" ? 1 : q.difficulty === "medium" ? 2 : 3)
    }, 0)

    const percentage = Math.round((score / maxPossibleScore) * 100)

    // Create a message based on whether the score was saved
    let saveMessage = null
    
    if (!user) {
      saveMessage = (
        <div className="mt-3 text-center text-amber-600 dark:text-amber-400">
          <p>Log in to save your score to the leaderboard!</p>
        </div>
      )
    } else if (scoreSaved) {
      saveMessage = (
        <div className="mt-3 text-center text-green-600 dark:text-green-400">
          <p>Your score has been saved!</p>
        </div>
      )
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2">Game Over!</CardTitle>
            <CardDescription>Here's how you did</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{percentage}%</div>
              <div className="text-xl text-muted-foreground">
                {score} out of {maxPossibleScore} points
              </div>
              {saveMessage}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Questions</span>
                <span>{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span>Correct Answers</span>
                <span>{score}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={restartGame} variant="outline">
              Play Again
            </Button>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // During game state
  const currentQ = questions[currentQuestion]
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between items-center mt-4 text-sm">
            <div className="px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded text-muted-foreground">
              {decode(currentQ.category)}
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                timeLeft <= 3 
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                  : timeLeft <= 6
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              }`}>
                <Clock className="h-3 w-3" />
                <span>{timeLeft}s</span>
              </div>
              <div
                className={`px-2 py-1 rounded text-xs ${
                  currentQ.difficulty === "easy"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : currentQ.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}
              >
                {currentQ.difficulty.charAt(0).toUpperCase() + currentQ.difficulty.slice(1)}
              </div>
            </div>
          </div>
          <CardTitle className="mt-6 text-xl p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50 rounded-lg shadow-sm">
            {decode(currentQ.question)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {shuffledAnswers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(answer)}
                disabled={isAnswered}
                className={`p-4 border rounded-lg text-left transition-all ${
                  isAnswered && answer === currentQ.correct_answer
                    ? "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-800"
                    : isAnswered && answer === selectedAnswer
                      ? "bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-800"
                      : isAnswered
                        ? "opacity-70"
                        : "hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-950/30 dark:hover:to-blue-950/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{decode(answer)}</span>
                  {isAnswered && answer === currentQ.correct_answer && (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                  {isAnswered && answer === selectedAnswer && answer !== currentQ.correct_answer && (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">
              Score: <span className="text-primary">{score}</span>
            </div>
            {!isAnswered && (
              <div className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium ${
                timeLeft <= 3 
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 animate-pulse" 
                  : timeLeft <= 6
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              }`}>
                <Clock className="h-4 w-4" />
                <span>{timeLeft}s</span>
              </div>
            )}
          </div>
          {isAnswered && (
            <Button onClick={nextQuestion} className="gap-2">
              {currentQuestion < questions.length - 1 ? "Next Question" : "Finish"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}