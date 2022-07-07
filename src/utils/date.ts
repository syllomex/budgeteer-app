import { format, parse, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { closest } from './number'

export const parseDate = (
  date?: string,
  options?: { inputFormat?: string }
) => {
  if (!date) return null
  if (date.includes('T') && date.includes('.')) return parseISO(date)
  return parse(date, options?.inputFormat ?? 'yyyy-MM-dd', new Date())
}

export const parseAndDisplay = (
  date?: string,
  options?: { inputFormat?: string; displayFormat?: string }
) => {
  if (!date) return 'Sem data'

  const parsed = parseDate(date, options) as Date
  if (!parsed) return 'Sem data'

  return format(parsed, options?.displayFormat ?? 'P', { locale: ptBR })
}

export const displayDate = (date: Date, displayFormat = 'P') => {
  return format(date, displayFormat, { locale: ptBR })
}

export const yearMonthToDate = (yearMonth?: string | null) => {
  if (!yearMonth) return null
  const [year, month] = yearMonth.split('-').map(v => parseInt(v))

  const date = new Date()
  date.setFullYear(year)
  date.setMonth(month - 1)

  return date
}

export const dateToYearMonth = (date: Date) => {
  return format(date, 'yyyy-MM', { locale: ptBR })
}

export const getCurrentClosestDateTime = () => {
  return new Date(
    new Date().setMinutes(closest(new Date().getMinutes(), [0, 15, 30, 45]))
  )
}

export const getCurrentYearMonth = () => {
  return dateToYearMonth(new Date())
}

export const isCurrentMonth = (yearMonth: string) => {
  return yearMonth === getCurrentYearMonth()
}
