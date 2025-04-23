"use client"

import React from "react"
import { Slider } from "@/components/ui/slider"

interface QuestionCountSliderProps {
  value?: number
  onChange?: (value: number) => void
}

export function QuestionCountSlider({ value = 10, onChange }: QuestionCountSliderProps) {
  const [questionCount, setQuestionCount] = React.useState(value)

  const handleValueChange = (newValue: number[]) => {
    setQuestionCount(newValue[0])
    if (onChange) {
      onChange(newValue[0])
    }
  }

  return (
    <div className="space-y-4">
      <Slider 
        defaultValue={[value]} 
        max={20} 
        step={1} 
        onValueChange={handleValueChange} 
      />
      <div className="text-center font-medium">{questionCount} Questions</div>
    </div>
  )
} 