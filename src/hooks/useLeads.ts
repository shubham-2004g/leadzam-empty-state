import { useEffect, useRef, useState } from 'react'
import type { Lead, PageStatus } from '../types'
import { makeSampleLeads } from '../data/sampleLeads'
import { toTenDigits } from '../lib/validation'
import type { LeadDraft, LeadErrors } from '../lib/validation'
import type { ParsedRow } from '../lib/csv'

/** The states a reviewer can jump to from the prototype controls bar. */
export type DemoState = 'loading' | 'error' | 'empty' | 'sample'

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))
const newId = () => `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

/**
 * All the "backend" in this prototype: leads live in memory and reset on refresh.
 * Swapping this hook for real API calls is the only change the UI would need.
 */
export function useLeads() {
  const [status, setStatus] = useState<PageStatus>('loading')
  const [leads, setLeads] = useState<Lead[]>([])
  const timer = useRef<number | undefined>(undefined)

  // First load: show the loading state briefly, then show the (empty) page.
  useEffect(() => {
    timer.current = window.setTimeout(() => setStatus('ready'), 900)
    return () => window.clearTimeout(timer.current)
  }, [])

  function retry() {
    window.clearTimeout(timer.current)
    setStatus('loading')
    timer.current = window.setTimeout(() => setStatus('ready'), 800)
  }

  function showState(next: DemoState) {
    window.clearTimeout(timer.current)
    if (next === 'loading' || next === 'error') {
      setStatus(next)
      return
    }
    setStatus('ready')
    setLeads(next === 'sample' ? makeSampleLeads() : [])
  }

  /** Returns null on success, or field errors (here: a duplicate phone number). */
  async function addLead(draft: LeadDraft): Promise<LeadErrors | null> {
    await wait(700) // pretend to talk to a server
    const phone = draft.phone.trim() ? toTenDigits(draft.phone) : ''
    if (phone && leads.some((lead) => lead.phone === phone)) {
      return { phone: 'A lead with this phone number already exists.' }
    }
    const lead: Lead = {
      id: newId(),
      name: draft.name.trim(),
      phone,
      email: draft.email.trim(),
      stage: 'Fresh',
      source: draft.source,
      assignee: draft.assignee || null,
      createdAt: new Date().toISOString(),
      isSample: false,
    }
    setLeads((current) => [lead, ...current])
    return null
  }

  function importLeads(rows: ParsedRow[]) {
    const imported: Lead[] = rows.map((row) => ({
      id: newId(),
      name: row.name,
      phone: row.phone,
      email: row.email,
      stage: 'Fresh',
      source: 'CSV upload',
      assignee: null,
      createdAt: new Date().toISOString(),
      isSample: false,
    }))
    setLeads((current) => [...imported, ...current])
  }

  function loadSample() {
    setLeads((current) => (current.some((lead) => lead.isSample) ? current : [...current, ...makeSampleLeads()]))
  }

  function removeSample() {
    setLeads((current) => current.filter((lead) => !lead.isSample))
  }

  return { status, leads, retry, showState, addLead, importLeads, loadSample, removeSample }
}
