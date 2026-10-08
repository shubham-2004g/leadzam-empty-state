import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import './Field.css'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'required'> {
  label: string
  required?: boolean
  /** Show "(optional)" when not required. Turn off when a rule spans two fields (phone OR email). */
  showOptional?: boolean
  hint?: string
  error?: string
  /** Mark the input invalid even without its own message (used by the shared phone/email rule). */
  invalid?: boolean
  /** Id of an extra element (e.g. a group error) that also describes this input. */
  describedBy?: string
  /** Fixed text shown inside the field's left edge, e.g. "+91". */
  prefixText?: string
}

export function TextField({
  label,
  required = false,
  showOptional = true,
  hint,
  error,
  invalid,
  describedBy,
  prefixText,
  ...inputProps
}: TextFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const isInvalid = invalid ?? Boolean(error)
  const described = [hint ? hintId : '', error ? errorId : '', describedBy ?? ''].filter(Boolean).join(' ')

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
        {required ? (
          <span className="field__required" aria-hidden="true"> *</span>
        ) : (
          showOptional && <span className="field__optional"> (optional)</span>
        )}
      </label>
      {hint && <p id={hintId} className="field__hint">{hint}</p>}
      <div className="field__control">
        {prefixText && <span className="field__prefix" aria-hidden="true">{prefixText}</span>}
        <input
          id={id}
          className="field__input"
          aria-required={required || undefined}
          aria-invalid={isInvalid || undefined}
          aria-describedby={described || undefined}
          {...inputProps}
        />
      </div>
      {error && (
        <p id={errorId} className="field__error">
          <span className="sr-only">Error: </span>
          {error}
        </p>
      )}
    </div>
  )
}
