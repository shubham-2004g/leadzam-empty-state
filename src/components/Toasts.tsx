import type { Toast } from '../hooks/useToasts'
import './Toasts.css'

interface ToastsProps {
  toasts: Toast[]
  onDismiss: (id: number) => void
}

/** role="status" makes screen readers announce new messages without stealing focus. */
export function Toasts({ toasts, onDismiss }: ToastsProps) {
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.tone}`}>
          <span>{toast.message}</span>
          <button type="button" className="toast__close" aria-label="Dismiss notification" onClick={() => onDismiss(toast.id)}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
      ))}
    </div>
  )
}
