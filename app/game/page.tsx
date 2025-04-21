"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, ChevronRight, Clock, XCircle } from "lucide-react"

// Updated questions with more variety and matching categories
const TRIVIA_QUESTIONS = [
  {
    question: "What is the capital of France?",
    correct_answer: "Paris",
    incorrect_answers: ["London", "Berlin", "Madrid"],
    difficulty: "easy",
    category: "Geography",
  },
  {
    question: "Which planet has the most moons?",
    correct_answer: "Saturn",
    incorrect_answers: ["Jupiter", "Uranus", "Neptune"],
    difficulty: "medium",
    category: "Science",
  },
  {
    question: "Who directed the movie 'Pulp Fiction'?",
    correct_answer: "Quentin Tarantino",
    incorrect_answers: ["Steven Spielberg", "Martin Scorsese", "Christopher Nolan"],
    difficulty: "medium",
    category: "Film & TV",
  },
  {
    question: "Which band released the album 'The Dark Side of the Moon'?",
    correct_answer: "Pink Floyd",
    incorrect_answers: ["The Beatles", "Led Zeppelin", "The Rolling Stones"],
    difficulty: "medium",
    category: "Music",
  },
  {
    question: "In which year did World War II end?",
    correct_answer: "1945",
    incorrect_answers: ["1939", "1942", "1944"],
    difficulty: "easy",
    category: "History",
  },
  {
    question: "What is the chemical symbol for gold?",
    correct_answer: "Au",
    incorrect_answers: ["Ag", "Fe", "Gd"],
    difficulty: "easy",
    category: "Science",
  },
  {
    question: "Which country has the largest population in the world?",
    correct_answer: "India",
    incorrect_answers: ["China", "United States", "Indonesia"],
    difficulty: "easy",
    category: "Geography",
  },
  {
    question: "Who wrote the play 'Romeo and Juliet'?",
    correct_answer: "William Shakespeare",
    incorrect_answers: ["Charles Dickens", "Jane Austen", "Mark Twain"],
    difficulty: "easy",
    category: "General Knowledge",
  },
  {
    question: "Which sport is played at Wimbledon?",
    correct_answer: "Tennis",
    incorrect_answers: ["Golf", "Cricket", "Football"],
    difficulty: "easy",
    category: "Sports",
  },
  {
    question: "What is the largest ocean on Earth?",
    correct_answer: "Pacific Ocean",
    incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
    difficulty: "easy",
    category: "Geography",
  },
]

export default function GamePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [isAnswered, setIsAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameOver, setGameOver] = useState(false)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [shuffledAnswers, setShuffledAnswers] = useState([])

  // Use a ref to store shuffled answers to prevent re-shuffling on re-renders
  const answersRef = useRef([])

  // Mock questions (in a real app, these would come from the API)
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setQuestions(TRIVIA_QUESTIONS)
      setLoading(false)
    }, 1500)
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

  // Timer effect
  useEffect(() => {
    if (loading || gameOver || isAnswered) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleAnswer("")
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
  }, [])

  const handleAnswer = (answer) => {
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

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
      setIsAnswered(false)
    } else {
      setGameOver(true)
    }
  }

  const restartGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer("")
    setIsAnswered(false)
    setTimeLeft(15)
    setGameOver(false)
  }

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

  if (gameOver) {
    const totalQuestions = questions.length
    const maxPossibleScore = questions.reduce((total, q) => {
      return total + (q.difficulty === "easy" ? 1 : q.difficulty === "medium" ? 2 : 3)
    }, 0)

    const percentage = Math.round((score / maxPossibleScore) * 100)

    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="w-full max-w-2xl mx-auto shadow-lg bg-white/90 dark:bg-gray-900/90">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Game Over!</CardTitle>
            <CardDescription>Here's how you did</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-4">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {score} pts
              </div>
              <Progress value={percentage} className="h-2 mb-2" />
              <p className="text-muted-foreground">{percentage}% of total possible points</p>
            </div>

            <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50">
              <h3 className="font-bold mb-3">Game Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Total Questions:</div>
                <div className="text-right">{totalQuestions}</div>
                <div>Difficulty:</div>
                <div className="text-right">Mixed</div>
                <div>Category:</div>
                <div className="text-right">Mixed</div>
                <div>Time Spent:</div>
                <div className="text-right">2m 34s</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={restartGame}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Play Again
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progressPercentage = (currentQuestion / questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto shadow-lg bg-white/90 dark:bg-gray-900/90">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Clock className="h-4 w-4" />
              <span className={timeLeft <= 5 ? "text-red-500" : ""}>{timeLeft}s</span>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between items-center mt-4 text-sm">
            <div className="px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded text-muted-foreground">
              {currentQ.category}
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
          <CardTitle className="mt-6 text-xl p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50 rounded-lg shadow-sm">
            {currentQ.question}
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
                  <span>{answer}</span>
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
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="font-medium">Score:</div>
            <div className="font-bold text-primary">{score} pts</div>
          </div>
          {isAnswered ? (
            <Button
              onClick={nextQuestion}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button variant="outline" onClick={() => handleAnswer("")} disabled={timeLeft > 0}>
              Skip <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {isAnswered && (
        <div className="w-full max-w-3xl mx-auto mt-4">
          <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {selectedAnswer === currentQ.correct_answer ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Correct!</p>
                      <p className="text-sm text-muted-foreground">Great job! You selected the right answer.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedAnswer ? "Incorrect" : "Time's up!"}</p>
                      <p className="text-sm text-muted-foreground">
                        The correct answer was: <span className="font-medium">{currentQ.correct_answer}</span>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

