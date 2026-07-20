import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatDate(dateStr: string) {
  try {
    return format(new Date(dateStr), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
  } catch {
    return dateStr
  }
}

export function formatDateShort(dateStr: string) {
  try {
    return format(new Date(dateStr), 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return dateStr
  }
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function truncate(str: string, length = 160) {
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '…'
}
