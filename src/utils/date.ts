import { format, parse, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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
