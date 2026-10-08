import { Button } from './Button'
import type { DemoState } from '../hooks/useLeads'
import './StateSwitcher.css'

interface StateSwitcherProps {
  onSelect: (state: DemoState) => void
}

const OPTIONS: { state: DemoState; label: string }[] = [
  { state: 'empty', label: 'Empty (default)' },
  { state: 'loading', label: 'Loading' },
  { state: 'error', label: 'Load error' },
  { state: 'sample', label: 'With sample data' },
]

/** Not part of the product. It lets a reviewer jump straight to each state without recreating it. */
export function StateSwitcher({ onSelect }: StateSwitcherProps) {
  return (
    <section className="switcher" aria-label="Prototype controls">
      <p className="switcher__label">Prototype controls: jump to a state</p>
      <div className="switcher__buttons">
        {OPTIONS.map((option) => (
          <Button key={option.state} onClick={() => onSelect(option.state)}>
            {option.label}
          </Button>
        ))}
      </div>
    </section>
  )
}
