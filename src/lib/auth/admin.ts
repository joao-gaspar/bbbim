import { User } from '@supabase/supabase-js'

/**
 * Verifica se um usuário do Supabase possui privilégios de Administrador do Acervo.
 */
export function isAdminUser(user: User | null): boolean {
  if (!user) return false

  // 1. E-mails mestres com acesso administrativo garantido
  const adminEmails = [
    'probooks@probooks.com.br',
    'eu@joaogaspar.com',
    'inovacao@totalcad.com.br'
  ]

  if (user.email && adminEmails.includes(user.email.toLowerCase())) {
    return true
  }

  // 2. Verificação de função (role) nos metadados do Supabase Auth
  const role = user.user_metadata?.role || user.app_metadata?.role

  if (role === 'admin') {
    return true
  }

  return false
}
