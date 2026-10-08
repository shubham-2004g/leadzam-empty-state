import type { Lead } from '../types'
import { formatDate, formatPhone } from '../lib/format'
import './LeadsTable.css'

interface LeadsTableProps {
  leads: Lead[]
}

function stageClass(stage: Lead['stage']): string {
  return `stage stage--${stage.toLowerCase().replace(/\s+/g, '-')}`
}

/**
 * On small screens each row becomes a card. The data-label on every cell supplies
 * the label that the hidden header row would normally provide.
 */
export function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <div className="leads-wrap">
      <table className="leads-table">
        <caption className="sr-only">Leads, newest first</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Phone</th>
            <th scope="col">Email</th>
            <th scope="col">Stage</th>
            <th scope="col">Source</th>
            <th scope="col">Created</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td data-label="Name">
                <span className="leads-table__name">{lead.name}</span>
                {lead.isSample && <span className="badge">Sample</span>}
              </td>
              <td data-label="Phone">{lead.phone ? formatPhone(lead.phone) : '—'}</td>
              <td data-label="Email">{lead.email || '—'}</td>
              <td data-label="Stage"><span className={stageClass(lead.stage)}>{lead.stage}</span></td>
              <td data-label="Source">{lead.source}</td>
              <td data-label="Created">{formatDate(lead.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
