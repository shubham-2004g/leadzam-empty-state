import { useCallback, useRef, useState } from 'react'

export type ToastTone = 'success' | 'info'

export interface Toast {
  id: number
  message: string
  tone: ToastTone
}

/** Tiny notification queue. Each toast removes itself after 5 seconds. */
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (message: string, tone: ToastTone = 'success') => {
      const id = nextId.current++
      setToasts((current) => [...current, { id, message, tone }])
      window.setTimeout(() => dismiss(id), 5000)
    },
    [dismiss],
  )

  return { toasts, push, dismiss }
}
