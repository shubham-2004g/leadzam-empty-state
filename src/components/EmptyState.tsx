import { Button } from './Button'
import './EmptyState.css'

interface EmptyStateProps {
  onAddLead: () => void
  onUpload: () => void
  onConnect: () => void
  onLoadSample: () => void
}

interface Path {
  title: string
  description: string
  action: string
  onClick: () => void
}

/**
 * The redesigned first-run screen. Instead of one sentence that only mentions forms,
 * it lays out every way to get leads in, each with its own button.
 */
export function EmptyState({ onAddLead, onUpload, onConnect, onLoadSample }: EmptyStateProps) {
  const paths: Path[] = [
    {
      title: 'Add a lead',
      description: 'Type in one lead by hand. The quickest way to try things out.',
      action: 'Add a lead',
      onClick: onAddLead,
    },
    {
      title: 'Upload a file',
      description: 'Bring in leads from a CSV or Excel sheet. We check every row before importing.',
      action: 'Upload a file',
      onClick: onUpload,
    },
    {
      title: 'Connect a source',
      description: 'Meta Ads, Google Ads, WhatsApp or website forms. New leads arrive on their own.',
      action: 'Connect a source',
      onClick: onConnect,
    },
  ]

  return (
    <section className="empty" aria-labelledby="empty-title">
      <h2 id="empty-title" className="empty__title">Add your first leads</h2>
      <p className="empty__lead">Pick whichever fits. You can use more than one, and you can change your mind later.</p>

      <ul className="empty__paths">
        {paths.map((path) => (
          <li key={path.title} className="path-card">
            <h3 className="path-card__title">{path.title}</h3>
            <p className="path-card__text">{path.description}</p>
            <Button variant={path.title === 'Add a lead' ? 'primary' : 'secondary'} onClick={path.onClick}>
              {path.action}
            </Button>
          </li>
        ))}
      </ul>

      <div className="empty__sample">
        <p>Just looking around?</p>
        <Button variant="ghost" onClick={onLoadSample}>Load 8 sample leads</Button>
        <p className="empty__sample-note">They're clearly labelled as samples and you can remove them in one click.</p>
      </div>
    </section>
  )
}
