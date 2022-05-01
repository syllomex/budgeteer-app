import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { capitalize } from './string'

export const getCurrentMonth = (date?: Date) => {
  const now = date ?? new Date()
  return format(now, 'yyyy-MM')
}

/**
 * Month format: yyyy-mm
 */
export const getDateByMonth = (yearMonth: string) => {
  const [year, month] = yearMonth.split('-').map(part => parseInt(part, 10))

  const date = new Date(year, month - 1)
  return date
}

export const displayYearMonth = (yearMonth: string) => {
  const date = parse(yearMonth, 'yyyy-MM', new Date(), { locale: ptBR })
  return `${capitalize(format(date, 'MMMM', { locale: ptBR }))} - ${format(
    date,
    'yyyy'
  )}`
}
