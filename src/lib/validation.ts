import type { LeadSource } from '../types'

export interface LeadDraft {
  name: string
  phone: string
  email: string
  source: LeadSource
  /** Empty string = unassigned */
  assignee: string
}

/** `contact` is the "need a phone OR an email" rule, which belongs to two fields at once. */
export type LeadErrors = Partial<Record<'name' | 'phone' | 'email' | 'contact', string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Strips spaces, +91 and a leading 0 so "+91 98765 43210" and "09876543210" both become 9876543210. */
export function toTenDigits(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2)
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1)
  return digits
}

/** Indian mobile numbers are 10 digits and start with 6-9. */
export function isValidPhone(raw: string): boolean {
  return /^[6-9]\d{9}$/.test(toTenDigits(raw))
}

export function isValidEmail(raw: string): boolean {
  return EMAIL_PATTERN.test(raw.trim())
}

export function validateLead(draft: LeadDraft): LeadErrors {
  const errors: LeadErrors = {}
  const name = draft.name.trim()
  const phone = draft.phone.trim()
  const email = draft.email.trim()

  if (!name) errors.name = "Enter the lead's name."
  if (!phone && !email) {
    errors.contact = 'Add a phone number or an email so your team can reach this lead.'
  }
  if (phone && !isValidPhone(phone)) {
    errors.phone = 'Enter a 10-digit mobile number, like 98765 43210.'
  }
  if (email && !isValidEmail(email)) {
    errors.email = 'Enter a valid email, like name@company.com.'
  }
  return errors
}
