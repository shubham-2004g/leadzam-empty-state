import { useState } from 'react'
import { AppShell } from './components/AppShell'
import { AddLeadForm } from './components/AddLeadForm'
import { Button } from './components/Button'
import { Drawer } from './components/Drawer'
import { EmptyState } from './components/EmptyState'
import { ErrorState } from './components/ErrorState'
import { LeadsTable } from './components/LeadsTable'
import { LoadingState } from './components/LoadingState'
import { SampleBanner } from './components/SampleBanner'
import { StateSwitcher } from './components/StateSwitcher'
import { Toasts } from './components/Toasts'
import { UploadPanel } from './components/UploadPanel'
import { useLeads } from './hooks/useLeads'
import { useToasts } from './hooks/useToasts'
import type { LeadDraft, LeadErrors } from './lib/validation'
import type { ParsedRow } from './lib/csv'
import './App.css'

type Panel = 'none' | 'add' | 'upload'

export default function App() {
  const { status, leads, retry, showState, addLead, importLeads, loadSample, removeSample } = useLeads()
  const { toasts, push, dismiss } = useToasts()
  const [panel, setPanel] = useState<Panel>('none')
  const [query, setQuery] = useState('')

  const hasLeads = leads.length > 0
  const hasSample = leads.some((lead) => lead.isSample)

  const needle = query.trim().toLowerCase()
  const visibleLeads = [...leads]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .filter((lead) => !needle || `${lead.name} ${lead.email} ${lead.phone}`.toLowerCase().includes(needle))

  async function handleAddLead(draft: LeadDraft): Promise<LeadErrors | null> {
    const errors = await addLead(draft)
    if (!errors) {
      setPanel('none')
      push(`${draft.name.trim()} was added to your leads.`)
    }
    return errors
  }

  function handleImport(rows: ParsedRow[]) {
    importLeads(rows)
    push(`${rows.length} ${rows.length === 1 ? 'lead' : 'leads'} imported.`)
  }

  function handleLoadSample() {
    loadSample()
    push('8 sample leads added. Each one is labelled so you can tell them apart from real leads.', 'info')
  }

  function handleRemoveSample() {
    removeSample()
    push('Sample leads removed.', 'info')
  }

  function handleConnect() {
    push('In the real product this opens Integrations. That screen is outside this prototype.', 'info')
  }

  function renderContent() {
    if (status === 'loading') return <LoadingState />
    if (status === 'error') return <ErrorState onRetry={retry} />
    if (!hasLeads) {
      return (
        <EmptyState
          onAddLead={() => setPanel('add')}
          onUpload={() => setPanel('upload')}
          onConnect={handleConnect}
          onLoadSample={handleLoadSample}
        />
      )
    }
    return (
      <>
        {hasSample && <SampleBanner onRemove={handleRemoveSample} onAddLead={() => setPanel('add')} />}
        <div className="toolbar">
          <label className="search">
            <span className="sr-only">Search leads by name, email or phone</span>
            <input
              type="search"
              className="search__input"
              placeholder="Search name, email or phone"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        {visibleLeads.length > 0 ? (
          <LeadsTable leads={visibleLeads} />
        ) : (
          <div className="no-matches" role="status">
            <p>No leads match “{query}”.</p>
            <Button onClick={() => setQuery('')}>Clear search</Button>
          </div>
        )}
      </>
    )
  }

  // Header buttons only appear once there are leads. On the empty page the three cards
  // are the actions, so nothing competes with them.
  const showHeaderActions = status === 'ready' && hasLeads

  return (
    <AppShell>
      <div className="page-header">
        <h1 className="page-header__title">
          All Leads
          {status === 'ready' && hasLeads && <span className="count" aria-label={`${leads.length} leads`}>{leads.length}</span>}
        </h1>
        {showHeaderActions && (
          <div className="page-header__actions">
            <Button onClick={() => setPanel('upload')}>Upload file</Button>
            <Button variant="primary" onClick={() => setPanel('add')}>Add lead</Button>
          </div>
        )}
      </div>

      {renderContent()}

      <Drawer
        open={panel === 'add'}
        title="Add a lead"
        description="Add a lead directly to your CRM. No form submission needed."
        onClose={() => setPanel('none')}
      >
        <AddLeadForm onSubmit={handleAddLead} onCancel={() => setPanel('none')} />
      </Drawer>

      <Drawer
        open={panel === 'upload'}
        title="Upload leads"
        description="Import up to 2,000 leads at once from a CSV file."
        onClose={() => setPanel('none')}
      >
        <UploadPanel onImport={handleImport} onClose={() => setPanel('none')} />
      </Drawer>

      <Toasts toasts={toasts} onDismiss={dismiss} />
      <StateSwitcher onSelect={showState} />
    </AppShell>
  )
}
