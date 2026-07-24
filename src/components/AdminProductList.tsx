'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { deleteProduct } from '@/app/admin/dashboard/actions'
import { Search, Edit, Trash2, LogOut, Plus, BookOpen, Layers, Disc, Book } from 'lucide-react'
import { Product, ProductCategory } from '@/lib/types'

interface Props {
  initialProducts: Product[]
  categories: ProductCategory[]
}

export default function AdminProductList({ initialProducts, categories }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Filtros em tempo real no cliente
  const filteredProducts = products.filter(product => {
    const matchesQuery = product.title.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = selectedCategory 
      ? product.category_id === parseInt(selectedCategory)
      : true
    return matchesQuery && matchesCategory
  })

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir o item "${title}" do acervo?`)) {
      return
    }

    setDeletingId(id)
    const result = await deleteProduct(id)

    if (result.success) {
      setProducts(products.filter(p => p.id !== id))
    } else {
      alert(`Erro ao excluir: ${result.error}`)
    }
    setDeletingId(null)
  }

  const getMediaIcon = (product: Product) => {
    const categorySlug = product.category?.slug || ''
    const titleLower = product.title.toLowerCase()
    
    if (categorySlug.includes('eletronico') || categorySlug.includes('digital')) return BookOpen
    if (categorySlug.includes('revista') || titleLower.includes('revista')) return Layers
    if (categorySlug.includes('cd') || categorySlug.includes('dvd') || categorySlug.includes('midia')) return Disc
    return Book
  }

  return (
    <div className="space-y-6">
      
      {/* ── Control Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-border shadow-xs">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo/logo-preto.png" 
            alt="BBBIM Logo" 
            className="h-5 w-auto object-contain hidden sm:block" 
          />
          <div>
            <h1 className="text-xl font-black text-foreground">Gerenciamento de Acervo</h1>
            <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-wider font-bold">Painel do Administrador</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Link href="/admin/dashboard/novo" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer border-none">
            <Plus size={16} /> Adicionar Item
          </Link>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-5 rounded-3xl border border-border shadow-xs">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Buscar por título no painel..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
          />
        </div>

        <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 border border-border rounded-xl text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-white"
          >
            <option value="">Todas as Categorias</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Table List ── */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-slate-50 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                <th className="py-4 px-6 w-16">Formato</th>
                <th className="py-4 px-6">Título</th>
                <th className="py-4 px-6 w-48">Categoria</th>
                <th className="py-4 px-6 w-24">Status</th>
                <th className="py-4 px-6 w-28 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => {
                  const Icon = getMediaIcon(product)
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Icon */}
                      <td className="py-4 px-6">
                        <span className="w-9 h-9 rounded-lg bg-[#eceff2]/80 flex items-center justify-center text-slate-500">
                          <Icon size={16} />
                        </span>
                      </td>

                      {/* Title */}
                      <td className="py-4 px-6 font-bold text-foreground">
                        <Link href={`/livro/${product.slug}`} target="_blank" className="hover:underline hover:text-accent">
                          {product.title}
                        </Link>
                        <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                          wp_id: {product.wp_id || 'N/A'} • Slug: {product.slug}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-600">
                          {product.category?.name || 'Geral'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {product.status === 'published' ? (
                          <span className="inline-flex text-[9px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                            Publicado
                          </span>
                        ) : (
                          <span className="inline-flex text-[9px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                            Rascunho
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/admin/dashboard/editar/${product.slug}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border text-slate-500 hover:text-primary hover:bg-[#eceff2]/40 transition-all cursor-pointer"
                            title="Editar item"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.title)}
                            disabled={deletingId === product.id}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer border-none bg-transparent"
                            title="Excluir item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Nenhum livro ou revista encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
