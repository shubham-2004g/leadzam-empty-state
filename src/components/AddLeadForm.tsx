import { useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from './Button'
import { TextField } from './TextField'
import { SelectField } from './SelectField'
import { LEAD_SOURCES } from '../types'
import type { LeadSource } from '../types'
import { TEAM } from '../data/team'
import { validateLead } from '../lib/validation'
import type { LeadDraft, LeadErrors } from '../lib/validation'
import './AddLeadForm.css'

interface AddLeadFormProps {
  /** Resolves to null on success, or to errors to show (e.g. "this phone already exists"). */
  onSubmit: (draft: LeadDraft) => Promise<LeadErrors | null>
  onCancel: () => void
}

const EMPTY_DRAFT: LeadDraft = { name: '', phone: '', email: '', source: 'Manual entry', assignee: '' }
const ERROR_KEYS = ['name', 'phone', 'email', 'contact'] as const

const SOURCE_OPTIONS = LEAD_SOURCES.map((source) => ({ value: source, label: source }))
const TEAM_OPTIONS = [{ value: '', label: 'Unassigned' }, ...TEAM.map((member) => ({ value: member, label: member }))]

export function AddLeadForm({ onSubmit, onCancel }: AddLeadFormProps) {
  const [draft, setDraft] = useState<LeadDraft>(EMPTY_DRAFT)
  const [errors, setErrors] = useState<LeadErrors>({})
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const contactErrorId = useId()

  const errorCount = ERROR_KEYS.filter((key) => errors[key]).length

  function focusFirstInvalid() {
    // Wait one tick so aria-invalid has been rendered before we look for it.
    window.setTimeout(() => {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    }, 0)
  }

  function update<K extends keyof LeadDraft>(field: K, value: LeadDraft[K]) {
    const next = { ...draft, [field]: value }
    setDraft(next)
    // Re-check as they type, but only fields that are already showing an error
    // (or everything, after the first failed submit). Never scold a field they haven't reached.
    const found = validateLead(next)
    setErrors((previous) => {
      const updated: LeadErrors = {}
      for (const key of ERROR_KEYS) {
        if ((hasSubmitted || previous[key]) && found[key]) updated[key] = found[key]
      }
      return updated
    })
  }

  function checkOnBlur(field: 'name' | 'phone' | 'email') {
    const found = validateLead(draft)
    setErrors((previous) => ({ ...previous, [field]: found[field] }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setHasSubmitted(true)
    const found = validateLead(draft)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      focusFirstInvalid()
      return
    }
    setIsSaving(true)
    const serverErrors = await onSubmit(draft)
    setIsSaving(false)
    if (serverErrors) {
      setErrors(serverErrors)
      focusFirstInvalid()
    }
  }

  return (
    <form ref={formRef} className="lead-form" onSubmit={handleSubmit} noValidate>
      <div className="drawer__scroll lead-form__fields">
        <p className="lead-form__legend">Fields marked <span className="field__required">*</span> are required.</p>

        {errorCount > 0 && (
          <div className="form-summary" role="alert">
            {errorCount === 1 ? 'There is 1 thing to fix' : `There are ${errorCount} things to fix`} before this lead can be added.
          </div>
        )}

        <TextField
          label="Full name"
          required
          name="name"
          autoComplete="off"
          placeholder="e.g. Priya Sharma"
          value={draft.name}
          error={errors.name}
          onChange={(event) => update('name', event.target.value)}
          onBlur={() => checkOnBlur('name')}
        />

        <fieldset className="field-group" aria-describedby={contactErrorId}>
          <legend className="field-group__legend">How can your team reach them?</legend>
          <p className="field__hint">Add a phone number, an email, or both. At least one is needed.</p>
          <TextField
            label="Phone"
            showOptional={false}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="off"
            prefixText="+91"
            placeholder="98765 43210"
            value={draft.phone}
            error={errors.phone}
            invalid={Boolean(errors.phone || errors.contact)}
            onChange={(event) => update('phone', event.target.value)}
            onBlur={() => checkOnBlur('phone')}
          />
          <TextField
            label="Email"
            showOptional={false}
            name="email"
            type="email"
            autoComplete="off"
            placeholder="name@company.com"
            value={draft.email}
            error={errors.email}
            invalid={Boolean(errors.email || errors.contact)}
            onChange={(event) => update('email', event.target.value)}
            onBlur={() => checkOnBlur('email')}
          />
          <p id={contactErrorId} className="field__error" hidden={!errors.contact}>
            <span className="sr-only">Error: </span>
            {errors.contact}
          </p>
        </fieldset>

        <SelectField
          label="Lead source"
          value={draft.source}
          options={SOURCE_OPTIONS}
          onChange={(event) => update('source', event.target.value as LeadSource)}
        />
        <SelectField
          label="Assign to"
          optional
          value={draft.assignee}
          options={TEAM_OPTIONS}
          onChange={(event) => update('assignee', event.target.value)}
        />
      </div>

      <div className="drawer__actions">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" loading={isSaving}>
          {isSaving ? 'Adding lead…' : 'Add lead'}
        </Button>
      </div>
    </form>
  )
}
