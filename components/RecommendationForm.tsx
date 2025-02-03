'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

type FormData = {
  type: string;
  platform: string[];
  kijkers: number;
  tijd: string;
  stemming: string;
  genre: string;
  duur: string;
};
const translationMap: Record<string, string> = {
  "Film": "movie",
  "Serie": "show",
  "Vrolijk": "happy",
  "Ontspannen": "relaxed",
  "Avontuurlijk": "adventurous",
  "Romantisch": "romantic",
  "Gespannen": "tense",
  "Actie": "action",
  "Komedie": "comedy",
  "Drama": "drama",
  "Sci-Fi": "sci-fi",
  "Horror": "horror",
  "Romantiek": "romance",
  "Kort": "short",
  "Gemiddeld": "medium",
  "Lang": "long"
};


type Question = {
  key: keyof FormData;
  question: string;
  options?: string[];
  type: 'radio' | 'checkbox' | 'number' | 'select' | 'slider';
};

export default function RecommendationForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    type: '',
    platform: [],
    kijkers: 1,
    tijd: '',
    stemming: '',
    genre: '',
    duur: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentTime = new Date();
    const hour = currentTime.getHours().toString();
    setFormData((prev) => ({ ...prev, tijd: hour }));
  }, []);

  const questions: Question[] = [
    { key: 'type', question: 'Is het een film of een serie?', options: ['Film', 'Serie'], type: 'radio' },
    {
      key: 'platform',
      question: 'Op welk platform wil je kijken? (Meerdere opties mogelijk)',
      options: ['Netflix', 'Disney+', 'Amazon Prime', 'HBO Max', 'Apple TV+'],
      type: 'checkbox',
    },
    { key: 'kijkers', question: 'Met hoeveel personen kijk je?', type: 'slider' },
    {
      key: 'stemming',
      question: 'Wat is je huidige stemming?',
      options: ['Vrolijk', 'Ontspannen', 'Avontuurlijk', 'Romantisch', 'Gespannen'],
      type: 'radio',
    },
    {
      key: 'genre',
      question: 'Welk genre heb je voorkeur voor?',
      options: ['Actie', 'Komedie', 'Drama', 'Sci-Fi', 'Horror', 'Romantiek'],
      type: 'radio',
    },
    { key: 'duur', question: 'Wil je iets langs of iets korts kijken?', options: ['Kort', 'Gemiddeld', 'Lang'], type: 'radio' },
  ];

  const handleChange = (value: string | string[] | number, key: keyof FormData) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleNext = () => {
    const currentQuestion = questions[step];
    const currentValue = formData[currentQuestion.key];
  
    if (
      (!currentValue && currentQuestion.type !== 'checkbox') ||
      (currentQuestion.type === 'checkbox' && Array.isArray(currentValue) && currentValue.length === 0)
    ) {
      setError('Maak alstublieft een keuze voordat u verdergaat.');
      return;
    }
  
    if (step < questions.length - 1) {
      setStep((prevStep) => prevStep + 1);
      setError(null);
    } else {
      // Convert answers to English before submitting
      const translatedData: FormData = {
        ...formData,
        type: translationMap[formData.type] || formData.type,
        stemming: translationMap[formData.stemming] || formData.stemming,
        genre: translationMap[formData.genre] || formData.genre,
        duur: translationMap[formData.duur] || formData.duur,
        platform: formData.platform.map(p => translationMap[p] || p) // Convert array values
      };
  
      onSubmit(translatedData);
    }
  };
  

  const currentQuestion = questions[step];
  const isAnswered = currentQuestion.type === 'checkbox'
    ? (formData[currentQuestion.key] as string[]).length > 0
    : Boolean(formData[currentQuestion.key]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{currentQuestion.question}</h2>

      {currentQuestion.type === 'checkbox' && (
        <div className="space-y-2">
          {currentQuestion.options?.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={(formData[currentQuestion.key] as string[]).includes(option)}
                onCheckedChange={(checked) => {
                  const currentValue = formData[currentQuestion.key] as string[];
                  const newValue = checked
                    ? [...currentValue, option]
                    : currentValue.filter((item) => item !== option);
                  handleChange(newValue, currentQuestion.key);
                }}
              />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </div>
      )}

      {currentQuestion.type === 'radio' && currentQuestion.options && (
        <RadioGroup
          onValueChange={(value) => handleChange(value, currentQuestion.key)}
          value={formData[currentQuestion.key] as string}
        >
          {currentQuestion.options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {currentQuestion.type === 'slider' && (
        <div className="space-y-2">
          <Slider
            min={1}
            max={10}
            step={1}
            value={formData[currentQuestion.key] as number}
            onChange={(value: string | number | string[]) => handleChange(value, currentQuestion.key)}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 persoon</span>
            <span>10 personen</span>
          </div>
          <p className="text-center text-lg font-semibold">
            {formData[currentQuestion.key]} {formData[currentQuestion.key] === 1 ? 'persoon' : 'personen'}
          </p>
        </div>
      )}

      {currentQuestion.type === 'select' && (
        <Select
          onValueChange={(value) => handleChange(value, currentQuestion.key)}
          value={formData[currentQuestion.key] as string}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecteer een optie" />
          </SelectTrigger>
          <SelectContent>
            {currentQuestion.options?.map((option) => (
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

      <Button onClick={handleNext} disabled={!isAnswered} className="w-full py-6 text-xl">
        {step < questions.length - 1 ? 'Volgende' : 'Aanbevolen Films Tonen'}
      </Button>
    </div>
  );
}

