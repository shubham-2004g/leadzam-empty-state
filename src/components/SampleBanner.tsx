import { Button } from './Button'
import './SampleBanner.css'

interface SampleBannerProps {
  onRemove: () => void
  onAddLead: () => void
}

/** Shown whenever sample leads are in the table, so nobody mistakes them for real ones. */
export function SampleBanner({ onRemove, onAddLead }: SampleBannerProps) {
  return (
    <div className="sample-banner" role="region" aria-label="Sample data notice">
      <p>
        <strong>You're looking at sample leads.</strong> They aren't real and won't appear in your reports.
      </p>
      <div className="sample-banner__actions">
        <Button onClick={onAddLead}>Add a real lead</Button>
        <Button onClick={onRemove}>Remove sample leads</Button>
      </div>
    </div>
  )
}
