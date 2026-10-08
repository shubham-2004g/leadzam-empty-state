import type { Lead, LeadStage } from '../types'

const DAY_MS = 86_400_000

interface SampleRow {
  name: string
  phone: string
  email: string
  stage: LeadStage
  daysAgo: number
}

const SAMPLE_ROWS: readonly SampleRow[] = [
  { name: 'Ananya Iyer', phone: '5555182350', email: 'ananya.iyer@example.com', stage: 'Fresh', daysAgo: 0 },
  { name: 'Rohan Mehta', phone: '5555760330', email: 'rohan.mehta@example.com', stage: 'Fresh', daysAgo: 1 },
  { name: 'Emily Carter', phone: '5555772055', email: 'emily.carter@example.com', stage: 'Attempting Call', daysAgo: 2 },
  { name: 'Vikram Desai', phone: '5555541155', email: 'vikram.desai@example.com', stage: 'Connected', daysAgo: 4 },
  { name: 'James Whitfield', phone: '5555594649', email: 'james.whitfield@example.com', stage: 'Interested', daysAgo: 6 },
  { name: 'Arjun Rao', phone: '5555328824', email: 'arjun.rao@example.com', stage: 'Meeting Scheduled', daysAgo: 8 },
  { name: 'Olivia Bennett', phone: '5555594557', email: 'olivia.bennett@example.com', stage: 'Won', daysAgo: 14 },
  { name: 'Daniel Brooks', phone: '5555620765', email: 'daniel.brooks@example.com', stage: 'Lost', daysAgo: 21 },
]

/** Eight clearly-fake leads. Every one is flagged isSample so the UI can label and remove them. */
export function makeSampleLeads(now: Date = new Date()): Lead[] {
  return SAMPLE_ROWS.map((row, index) => ({
    id: `sample-${index + 1}`,
    name: row.name,
    phone: row.phone,
    email: row.email,
    stage: row.stage,
    source: 'Sample Data',
    assignee: null,
    isSample: true,
    createdAt: new Date(now.getTime() - row.daysAgo * DAY_MS).toISOString(),
  }))
}
