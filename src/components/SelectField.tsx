import { useId } from 'react'
import type { SelectHTMLAttributes } from 'react'
import './Field.css'

export interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string
  options: readonly SelectOption[]
  optional?: boolean
}

export function SelectField({ label, options, optional = false, ...selectProps }: SelectFieldProps) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
        {optional && <span className="field__optional"> (optional)</span>}
      </label>
      <select id={id} className="field__input" {...selectProps}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}
