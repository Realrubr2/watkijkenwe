import { Loader2 } from 'lucide-react'

export function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-lg">Aanbevelingen laden...</span>
    </div>
  )
}

