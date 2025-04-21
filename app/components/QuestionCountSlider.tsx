"use client"

import React from "react"
import { Slider } from "@/components/ui/slider"

export function QuestionCountSlider() {
  const [questionCount, setQuestionCount] = React.useState(10)

  return (
    <div className="space-y-4">
      <Slider defaultValue={[10]} max={20} step={1} onValueChange={(value) => setQuestionCount(value[0])} />
      <div className="text-center font-medium">{questionCount} Questions</div>
    </div>
  )
} 