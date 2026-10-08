// Shared types for the prototype.

export const LEAD_SOURCES = [
  'Manual entry',
  'Website form',
  'Meta Ads',
  'Google Ads',
  'WhatsApp',
  'Referral',
] as const

/** Sources a person can pick by hand, plus the two the app sets itself. */
export type LeadSource = (typeof LEAD_SOURCES)[number] | 'CSV upload' | 'Sample Data'

export type LeadStage =
  | 'Fresh'
  | 'Attempting Call'
  | 'Connected'
  | 'Interested'
  | 'Meeting Scheduled'
  | 'Won'
  | 'Lost'

export interface Lead {
  id: string
  name: string
  /** 10 digits, no country code. Empty string if the lead has no phone. */
  phone: string
  email: string
  stage: LeadStage
  source: LeadSource
  assignee: string | null
  /** ISO date string */
  createdAt: string
  isSample: boolean
}

/** What the leads page is doing right now. "Empty" is derived: ready + no leads. */
export type PageStatus = 'loading' | 'error' | 'ready'
