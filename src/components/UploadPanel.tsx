import { useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { Button } from './Button'
import { parseLeadsCsv, SAMPLE_CSV } from '../lib/csv'
import type { CsvRowError, ParsedRow } from '../lib/csv'
import './UploadPanel.css'

const MAX_BYTES = 10 * 1024 * 1024
const MAX_ERRORS_SHOWN = 5

/** One screen per step. TypeScript makes sure each step only reads data that exists for it. */
type UploadState =
  | { step: 'idle'; error?: string }
  | { step: 'checking'; fileName: string }
  | { step: 'review'; fileName: string; valid: ParsedRow[]; errors: CsvRowError[]; total: number }
  | { step: 'done'; imported: number; skipped: number }

interface UploadPanelProps {
  onImport: (rows: ParsedRow[]) => void
  onClose: () => void
}

const STEP_LABELS = ['Upload', 'Review', 'Done']

function stepNumber(state: UploadState): number {
  if (state.step === 'review') return 2
  if (state.step === 'done') return 3
  return 1
}

export function UploadPanel({ onImport, onClose }: UploadPanelProps) {
  const [state, setState] = useState<UploadState>({ step: 'idle' })
  const [isDragging, setIsDragging] = useState(false)
  const current = stepNumber(state)

  async function handleFile(file: File | undefined) {
    if (!file) return
    const name = file.name.toLowerCase()

    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      setState({
        step: 'idle',
        error: "Excel files aren't supported in this prototype. Save your sheet as CSV (File → Save As → CSV) and upload that.",
      })
      return
    }
    if (!name.endsWith('.csv')) {
      setState({ step: 'idle', error: "That file type isn't supported. Choose a .csv file." })
      return
    }
    if (file.size > MAX_BYTES) {
      setState({ step: 'idle', error: `This file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 10 MB.` })
      return
    }

    setState({ step: 'checking', fileName: file.name })
    // A short pause so the "checking" state is visible and doesn't just flash.
    const [text] = await Promise.all([file.text(), new Promise<void>((resolve) => window.setTimeout(resolve, 700))])
    const result = parseLeadsCsv(text)
    if (!result.ok) {
      setState({ step: 'idle', error: result.message })
      return
    }
    setState({ step: 'review', fileName: file.name, valid: result.valid, errors: result.errors, total: result.total })
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    void handleFile(event.target.files?.[0])
    event.target.value = '' // lets the same file be chosen again after fixing it
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setIsDragging(false)
    void handleFile(event.dataTransfer.files[0])
  }

  function confirmImport(valid: ParsedRow[], skipped: number) {
    onImport(valid)
    setState({ step: 'done', imported: valid.length, skipped })
  }

  return (
    <div className="upload">
      <div className="drawer__scroll">
        <ol className="steps" aria-label="Import progress">
          {STEP_LABELS.map((label, index) => (
            <li key={label} className="steps__item" aria-current={index + 1 === current ? 'step' : undefined}>
              <span className="steps__number">{index + 1}</span>
              {label}
            </li>
          ))}
        </ol>

        {state.step === 'idle' && (
          <>
            {state.error && (
              <p className="upload__error" role="alert">
                <strong>We couldn't use that file.</strong> {state.error}
              </p>
            )}
            <label
              className={`dropzone${isDragging ? ' dropzone--active' : ''}`}
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input type="file" accept=".csv,text/csv" className="sr-only" onChange={handleInputChange} />
              <strong>Click to choose a CSV file</strong>
              <span>or drag it here. Up to 2,000 rows, 10 MB.</span>
              <span className="dropzone__note">We check every row before importing anything.</span>
            </label>
            <div className="upload__sample">
              <a
                className="btn btn--secondary"
                href={`data:text/csv;charset=utf-8,${encodeURIComponent(SAMPLE_CSV)}`}
                download="leadzam-sample.csv"
              >
                Download sample CSV
              </a>
              <p>Columns we look for: Name, Phone, Email. At least a name plus a phone or email per row.</p>
            </div>
          </>
        )}

        {state.step === 'checking' && (
          <div className="upload__checking" role="status">
            <span className="spinner" aria-hidden="true" />
            <p>Checking <strong>{state.fileName}</strong>…</p>
          </div>
        )}

        {state.step === 'review' && (
          <div aria-live="polite">
            <p className="upload__file">{state.fileName}</p>
            <div className="summary">
              <p className="summary__ready">
                <strong>{state.valid.length}</strong> of {state.total} rows are ready to import
              </p>
              {state.errors.length > 0 && (
                <>
                  <p className="summary__skipped">
                    <strong>{state.errors.length}</strong> {state.errors.length === 1 ? 'row needs' : 'rows need'} fixing and will be skipped:
                  </p>
                  <ul className="summary__errors">
                    {state.errors.slice(0, MAX_ERRORS_SHOWN).map((error) => (
                      <li key={error.row}>Row {error.row}: {error.message}</li>
                    ))}
                  </ul>
                  {state.errors.length > MAX_ERRORS_SHOWN && (
                    <p className="summary__more">…and {state.errors.length - MAX_ERRORS_SHOWN} more.</p>
                  )}
                </>
              )}
              {state.valid.length === 0 && (
                <p className="upload__error">No rows can be imported. Fix the file and upload it again.</p>
              )}
            </div>
          </div>
        )}

        {state.step === 'done' && (
          <div className="upload__done" role="status">
            <p className="upload__done-title">
              {state.imported} {state.imported === 1 ? 'lead' : 'leads'} imported
            </p>
            {state.skipped > 0 && <p>{state.skipped} {state.skipped === 1 ? 'row was' : 'rows were'} skipped.</p>}
          </div>
        )}
      </div>

      <div className="drawer__actions">
        {state.step === 'review' ? (
          <>
            <Button onClick={() => setState({ step: 'idle' })}>Choose a different file</Button>
            {state.valid.length > 0 && (
              <Button variant="primary" onClick={() => confirmImport(state.valid, state.errors.length)}>
                Import {state.valid.length} {state.valid.length === 1 ? 'lead' : 'leads'}
              </Button>
            )}
          </>
        ) : state.step === 'done' ? (
          <Button variant="primary" onClick={onClose}>View leads</Button>
        ) : (
          <Button onClick={onClose}>Cancel</Button>
        )}
      </div>
    </div>
  )
}
