'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

type FormData = {
  type: string
  platform: string[]
  viewers: string
  time: string
  mood: string
  genre: string
  duration: string
}

export default function RecommendationForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    type: '',
    platform: [],
    viewers: '',
    time: '',
    mood: '',
    genre: '',
    duration: ''
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFormData(prev => ({ ...prev, time: new Date().toISOString() }))
  }, [])

  const questions = [
    { key: 'type', question: 'Is het een film of een serie?', options: ['Film', 'Serie'] },
    { 
      key: 'platform', 
      question: 'Op welk platform wil je kijken? (Meerdere opties mogelijk)', 
      options: ['Netflix', 'Disney+', 'Amazon Prime', 'HBO Max', 'Apple TV+'],
      type: 'checkbox'
    },
    { key: 'viewers', question: 'Met hoeveel personen kijk je?', type: 'number' },
    { key: 'mood', question: 'Wat is je huidige stemming?', options: ['Vrolijk', 'Ontspannen', 'Avontuurlijk', 'Romantisch', 'Gespannen'] },
    { key: 'genre', question: 'Welk genre heb je voorkeur voor?', options: ['Actie', 'Komedie', 'Drama', 'Sci-Fi', 'Horror', 'Romantiek'] },
    { key: 'duration', question: 'Wil je iets langs of iets korts kijken?', options: ['Kort', 'Gemiddeld', 'Lang'] }
  ]

  const handleChange = (value: string | string[]) => {
    setFormData({ ...formData, [questions[step].key]: value })
    setError(null)
  }

  const handleNext = () => {
    const currentValue = formData[questions[step].key as keyof FormData]
    if (!currentValue && currentQuestion.type !== 'checkbox') {
      setError('Maak alstublieft een keuze voordat u verdergaat.')
      return
    }
    if (currentValue && Array.isArray(currentValue) && currentValue.length === 0 && currentQuestion.type === 'checkbox') {
      setError('Maak alstublieft een keuze voordat u verdergaat.')
      return
    }


    if (step < questions.length - 1) {
      setStep(step + 1)
      setError(null)
    } else {
      onSubmit(formData)
    }
  }

  const currentQuestion = questions[step]
  const isAnswered = currentQuestion.type === 'checkbox'
  ? (formData[currentQuestion.key as keyof FormData] as string[])?.length > 0
  : !!formData[currentQuestion.key as keyof FormData];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{currentQuestion.question}</h2>
      {currentQuestion.type === 'checkbox' ? (
        <div className="space-y-2">
          {currentQuestion.options?.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={formData[currentQuestion.key as keyof FormData]?.includes(option)}
                onCheckedChange={(checked) => {
                  const currentValue = formData[currentQuestion.key as keyof FormData] as string[] || [];
                  const newValue = checked
                    ? [...currentValue, option]
                    : currentValue.filter((item) => item !== option);
                  handleChange(newValue);
                }}
              />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </div>
      ) : currentQuestion.options ? (
        <RadioGroup 
          onValueChange={handleChange} 
          value={formData[currentQuestion.key as keyof FormData] as string}
        >
          {currentQuestion.options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      ) : currentQuestion.type === 'number' ? (
        <Input 
          type="number" 
          value={formData[currentQuestion.key as keyof FormData] as string} 
          onChange={(e) => handleChange(e.target.value)}
          min="1"
        />
      ) : (
        <Select 
          onValueChange={handleChange} 
          value={formData[currentQuestion.key as keyof FormData] as string}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecteer een optie" />
          </SelectTrigger>
          <SelectContent>
            {currentQuestion.options.map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {step < questions.length - 1 ? (
        <Button onClick={handleNext} disabled={!isAnswered}>
          Volgende
        </Button>
      ) : (
        <Button onClick={handleNext} className="w-full py-6 text-xl" disabled={!isAnswered}>
          Aanbevolen Films Tonen
        </Button>
      )}
    </div>
  )
}

