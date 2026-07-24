import { createClient } from '@/lib/supabase/server'
import BookCard from '@/components/BookCard'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: cat } = await supabase
    .from('product_categories')
    .select('name, description')
    .eq('slug', slug)
    .single()
    
  if (!cat) return { title: 'Categoria não encontrada' }
  
  return {
    title: `${cat.name} — Acervo BBBIM`,
    description: cat.description ?? `Itens do acervo na categoria ${cat.name}`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. Buscar a categoria de produto
  const { data: category } = await supabase
    .from('product_categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  // 2. Buscar produtos associados
  const { data: products } = await supabase
    .from('products')
    .select(`
      id, wp_id, title, slug, description, price, regular_price, sale_price, category_id, status, published_at,
      category:product_categories(id, name, slug)
    `)
    .eq('status', 'published')
    .eq('category_id', category.id)
    .order('title', { ascending: true })

  return (
    <div className="bg-[#eceff2]/40 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors font-bold">
            <ArrowLeft size={16} /> Voltar ao início
          </Link>
        </div>

        {/* Category Header Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border mb-8">
          <span className="inline-flex text-[10px] font-bold uppercase tracking-wider text-accent bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-3">
            Categoria do Acervo
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">{category.description}</p>
          )}
          <p className="text-xs text-slate-400 mt-4 font-semibold">
            {products?.length ?? 0} item{(products?.length ?? 0) !== 1 ? 's' : ''} cadastrado{(products?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up">
            {products.map(book => (
              <BookCard key={book.id} book={book as any} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl py-20 text-center border border-border shadow-sm">
            <BookOpen size={48} className="mx-auto mb-4 text-slate-300" />
            <h3 className="font-bold text-foreground text-lg mb-1 font-sans">Nenhum item nesta categoria</h3>
            <p className="text-slate-500 text-xs max-w-xs mx-auto">
              Ainda não existem livros ou revistas vinculados a esta categoria no banco de dados.
            </p>
            <Link href="/" className="inline-block mt-5 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer border-none shadow-sm">
              Voltar ao Catálogo Geral
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
