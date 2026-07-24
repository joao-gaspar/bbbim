import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminProductList from '@/components/AdminProductList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Painel Administrativo — Biblioteca BBBIM',
  description: 'Gerenciamento de acervo da biblioteca técnica BBBIM.',
}

export const revalidate = 0 // Painel admin precisa carregar sempre dados novos da base

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // 1. Verificar autenticação no servidor
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  // 2. Buscar categorias de produtos do Supabase
  const { data: categories } = await supabase
    .from('product_categories')
    .select('*')
    .order('name', { ascending: true })

  // 3. Buscar todos os produtos do acervo do Supabase
  const { data: products } = await supabase
    .from('products')
    .select(`
      id, wp_id, title, slug, description, price, regular_price, sale_price, category_id, status, published_at,
      category:product_categories(id, name, slug)
    `)
    .order('created_at', { ascending: false }) // Mais recentes primeiro no painel

  return (
    <div className="bg-[#eceff2]/40 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdminProductList 
          initialProducts={(products as any) || []} 
          categories={categories || []} 
        />
      </div>
    </div>
  )
}
