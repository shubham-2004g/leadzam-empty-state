import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import './Drawer.css'

interface DrawerProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}

/**
 * Side panel built on the native <dialog> element. showModal() gives us, for free:
 * a focus trap, Esc-to-close, an inert page behind it, and focus returning to the
 * button that opened it. Children only mount while open, so forms always start fresh.
 */
export function Drawer({ open, title, description, onClose, children }: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="drawer"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      // A click on the dimmed backdrop lands on the <dialog> itself, not the panel inside it.
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
    >
      {open && (
        <div className="drawer__panel">
          <header className="drawer__header">
            <div>
              <h2 id={titleId} className="drawer__title">{title}</h2>
              {description && (
                <p id={descriptionId} className="drawer__description">{description}</p>
              )}
            </div>
            <button type="button" className="drawer__close" aria-label="Close panel" onClick={onClose}>
              <span aria-hidden="true">×</span>
            </button>
          </header>
          <div className="drawer__body">{children}</div>
        </div>
      )}
    </dialog>
  )
}
