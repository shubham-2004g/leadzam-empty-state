import { Button } from './Button'
import './ErrorState.css'

interface ErrorStateProps {
  onRetry: () => void
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <section className="error-state" role="alert">
      <h2 className="error-state__title">We couldn't load your leads</h2>
      <p>This is usually a connection problem. Your leads are safe. Check your internet and try again.</p>
      <Button variant="primary" onClick={onRetry}>Try again</Button>
    </section>
  )
}
