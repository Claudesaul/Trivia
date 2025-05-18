import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, MessageSquare, Settings, Zap } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-6">Help Center</h1>

        <Tabs defaultValue="howto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="howto">How to Play</TabsTrigger>
            <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="howto" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  How to Play Trivia Challenge
                </CardTitle>
                <CardDescription>Learn the basics of playing trivia games on our platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Getting Started</h3>
                  <ol className="list-decimal pl-6 space-y-3">
                    <li>
                      <strong>Choose Your Game Mode:</strong> From the home page, you can either click "Play Now" for a
                      quick game with default settings, or customize your game by selecting specific categories,
                      difficulty levels, and number of questions.
                    </li>
                    <li>
                      <strong>Answer Questions:</strong> Once the game starts, you'll be presented with a series of
                      multiple-choice questions. Select your answer by clicking on it.
                    </li>
                    <li>
                      <strong>Submit Answers:</strong> After selecting your answer, click "Submit" to lock in your
                      response and move to the next question.
                    </li>
                    <li>
                      <strong>View Results:</strong> After completing all questions, you'll see your final score,
                      correct answers, and have the option to play again or return to the home page.
                    </li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Game Controls</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ControlCard
                      title="Category Selection"
                      description="Choose from 24 different categories or select 'Any Category' for a mixed experience."
                    />
                    <ControlCard
                      title="Difficulty Settings"
                      description="Select Easy, Medium, or Hard questions to match your knowledge level."
                    />
                    <ControlCard
                      title="Question Count"
                      description="Choose how many questions you want in your game (5-20)."
                    />
                    <ControlCard
                      title="Question Types"
                      description="Select Multiple Choice, True/False, or both types of questions."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Scoring System</h3>
                  <p>Points are awarded based on correct answers and difficulty level:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Easy questions:</strong> 1 point each
                    </li>
                    <li>
                      <strong>Medium questions:</strong> 2 points each
                    </li>
                    <li>
                      <strong>Hard questions:</strong> 3 points each
                    </li>
                  </ul>
                  <p>Your final score is calculated as a percentage of the total possible points.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Tips for Creating Custom Games
                </CardTitle>
                <CardDescription>Get the most out of your trivia experience with these helpful tips</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Customization Tips</h3>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <strong>Mix Difficulty Levels:</strong> For a balanced game, try selecting "Any Difficulty" to get
                      a mix of easy, medium, and hard questions that will challenge players of all skill levels.
                    </li>
                    <li>
                      <strong>Category Combinations:</strong> When hosting for a group, choose broader categories like
                      "General Knowledge" or select multiple specific categories to ensure everyone has a chance to
                      answer questions in their areas of expertise.
                    </li>
                    <li>
                      <strong>Question Count Strategy:</strong> For casual play, 10 questions is ideal. For more
                      competitive sessions, try 15-20 questions to better differentiate player knowledge levels.
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-bold mb-2">Pro Tip: Create an Account</h4>
                  <p>
                    While you can play without an account, creating one allows you to save your favorite game
                    configurations, track your progress over time, and compete on our leaderboards.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>Find answers to common questions about Trivia Challenge</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Do I need an account to play?</AccordionTrigger>
                    <AccordionContent>
                      No, you can play Trivia Challenge without creating an account. However, creating a free account
                      allows you to save your game history, track your progress, and compete on leaderboards.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>How many questions are available?</AccordionTrigger>
                    <AccordionContent>
                      Trivia Challenge uses the Open Trivia Database which currently contains over 4,000 verified
                      questions across 24 different categories. The database is regularly updated with new questions.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>Can I play on my mobile device?</AccordionTrigger>
                    <AccordionContent>
                      Yes! Trivia Challenge is fully responsive and works on smartphones, tablets, and desktop
                      computers.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>How do I report an incorrect question?</AccordionTrigger>
                    <AccordionContent>
                      If you believe a question or answer is incorrect, you can report it using the "Report Question"
                      button that appears after answering each question. Our team will review the report and make
                      corrections if necessary.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>Can I create my own trivia questions?</AccordionTrigger>
                    <AccordionContent>
                      Currently, we don't support user-submitted questions directly in the app. However, you can
                      contribute to the Open Trivia Database, which is our question source, through their website.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger>Is Trivia Challenge completely free?</AccordionTrigger>
                    <AccordionContent>
                      Yes, Trivia Challenge is completely free to use. There are no paywalls, premium features, or
                      in-app purchases. All features are available to all users.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger>Can I play offline?</AccordionTrigger>
                    <AccordionContent>
                      Currently, Trivia Challenge requires an internet connection to fetch questions from our database.
                      We're exploring options for offline play in future updates.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ControlCard({ title, description }) {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

