/** "9876543210" -> "+91 98765 43210". Anything else is shown as typed. */
export function formatPhone(raw: string): string {
  return /^\d{10}$/.test(raw) ? `+91 ${raw.slice(0, 5)} ${raw.slice(5)}` : raw
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
