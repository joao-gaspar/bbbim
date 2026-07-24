import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminProductForm from '@/components/AdminProductForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adicionar Item — Biblioteca BBBIM',
}

export default async function NewProductPage() {
  const supabase = await createClient()

  // 1. Verificar autenticação no servidor
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  // 2. Buscar categorias de produtos para preencher o formulário
  const { data: categories } = await supabase
    .from('product_categories')
    .select('*')
    .order('name', { ascending: true })

  return (
    <div className="bg-[#eceff2]/40 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdminProductForm categories={categories || []} />
      </div>
    </div>
  )
}
