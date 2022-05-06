import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const parseAndDisplay = (
  date?: string,
  options?: { inputFormat?: string; displayFormat?: string }
) => {
  if (!date) return 'Sem data'

  const parsed = parse(date, options?.inputFormat ?? 'yyyy-MM-dd', new Date())
  return format(parsed, options?.displayFormat ?? 'P', { locale: ptBR })
}
