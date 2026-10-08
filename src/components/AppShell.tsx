import type { ReactNode } from 'react'
import './AppShell.css'

const NAV_ITEMS = [
  'Admin Dashboard',
  'Forms',
  'All Leads',
  'Follow-ups',
  'Calls',
  'Reports',
  'WhatsApp',
  'Integrations',
  'Settings',
] as const

/** Just enough of the surrounding app to show the redesign in context. Navigation is not wired up. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <aside className="shell__sidebar">
        <p className="shell__brand">
          Leadzam <span className="shell__tag">redesign prototype</span>
        </p>
        <nav aria-label="Main">
          <ul className="shell__nav">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <a
                  href="#main"
                  aria-current={item === 'All Leads' ? 'page' : undefined}
                  onClick={(event) => event.preventDefault()}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main id="main" className="shell__main" tabIndex={-1}>
        {children}
      </main>
    </div>
  )
}
