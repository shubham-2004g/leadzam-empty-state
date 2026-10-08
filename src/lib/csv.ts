import { isValidEmail, isValidPhone, toTenDigits } from './validation'

export interface ParsedRow {
  name: string
  phone: string
  email: string
}

export interface CsvRowError {
  /** Row number as the person sees it in their spreadsheet (header is row 1). */
  row: number
  message: string
}

export type CsvParseResult =
  | { ok: true; valid: ParsedRow[]; errors: CsvRowError[]; total: number }
  | { ok: false; message: string }

export const SAMPLE_CSV =
  'Name,Phone,Email\nPriya Sharma,9876543210,priya@example.com\nRahul Verma,9123456780,rahul@example.com\n'

const COLUMN_NAMES = {
  name: ['name', 'full name', 'fullname', 'lead name'],
  phone: ['phone', 'phone number', 'mobile', 'mobile number', 'primary phone'],
  email: ['email', 'email address', 'primary email'],
}

/** Small CSV reader: handles quoted cells, escaped quotes ("") and \r\n line endings. */
function readCsv(text: string): string[][] {
  const source = text.replace(/^\uFEFF/, '')
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < source.length; i++) {
    const char = source[i]
    if (inQuotes) {
      if (char === '"') {
        if (source[i + 1] === '"') {
          cell += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cell += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(cell)
      cell = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && source[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else {
      cell += char
    }
  }
  if (cell !== '' || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }
  return rows
}

function findColumn(headers: string[], accepted: string[]): number {
  return headers.findIndex((header) => accepted.includes(header))
}

/** Reads a CSV and checks every row *before* anything is imported. */
export function parseLeadsCsv(text: string): CsvParseResult {
  const rows = readCsv(text)
  const isBlank = (cells: string[]) => cells.every((cell) => cell.trim() === '')

  if (rows.length === 0 || isBlank(rows[0])) {
    return { ok: false, message: 'This file is empty. Add a header row and at least one lead.' }
  }

  const headers = rows[0].map((header) => header.trim().toLowerCase())
  const nameCol = findColumn(headers, COLUMN_NAMES.name)
  const phoneCol = findColumn(headers, COLUMN_NAMES.phone)
  const emailCol = findColumn(headers, COLUMN_NAMES.email)

  if (nameCol === -1) {
    const found = rows[0].filter((header) => header.trim()).join(', ') || 'none'
    return {
      ok: false,
      message: `We couldn't find a "Name" column. Columns in your file: ${found}. Download the sample file to see the format.`,
    }
  }
  if (phoneCol === -1 && emailCol === -1) {
    return {
      ok: false,
      message: `We couldn't find a "Phone" or "Email" column. Add at least one so your team can reach each lead.`,
    }
  }

  const valid: ParsedRow[] = []
  const errors: CsvRowError[] = []
  let total = 0

  rows.slice(1).forEach((cells, index) => {
    if (isBlank(cells)) return
    total++
    const row = index + 2
    const name = (cells[nameCol] ?? '').trim()
    const phone = phoneCol >= 0 ? (cells[phoneCol] ?? '').trim() : ''
    const email = emailCol >= 0 ? (cells[emailCol] ?? '').trim() : ''

    if (!name) {
      errors.push({ row, message: 'Name is missing.' })
    } else if (!phone && !email) {
      errors.push({ row, message: `${name}: needs a phone number or an email.` })
    } else if (phone && !isValidPhone(phone)) {
      errors.push({ row, message: `${name}: "${phone}" isn't a 10-digit mobile number.` })
    } else if (email && !isValidEmail(email)) {
      errors.push({ row, message: `${name}: "${email}" isn't a valid email.` })
    } else {
      valid.push({ name, phone: phone ? toTenDigits(phone) : '', email })
    }
  })

  return { ok: true, valid, errors, total }
}
