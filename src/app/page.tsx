import { createClient } from '@/lib/supabase/server'
import BookCard from '@/components/BookCard'
import Link from 'next/link'
import { BookOpen, X, Filter } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Biblioteca BBBIM — Gestão e Empréstimo de Acervo Técnico BIM',
  description: 'Consulte e reserve livros, revistas técnicas, CDs, DVDs e documentos eletrônicos sobre BIM, Revit, ArchiCAD e IFC.',
}

export const revalidate = 60 // Revalida a cada 60s (ISR rápida para atualizações)

interface PageProps {
  searchParams: Promise<{ q?: string; cat?: string }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.q || ''
  const categorySlug = params.cat || ''

  const supabase = await createClient()

  // 1. Buscar categorias de produtos do Supabase
  const { data: categories } = await supabase
    .from('product_categories')
    .select('id, name, slug')
    .order('name', { ascending: true })

  // 2. Montar a busca de produtos
  let queryBuilder = supabase
    .from('products')
    .select(`
      id, wp_id, title, slug, description, price, regular_price, sale_price, category_id, status, published_at,
      category:product_categories(id, name, slug)
    `)
    .eq('status', 'published')
    .order('title', { ascending: true })

  if (query) {
    queryBuilder = queryBuilder.ilike('title', `%${query}%`)
  }

  if (categorySlug) {
    const selectedCategory = categories?.find(c => c.slug === categorySlug)
    if (selectedCategory) {
      queryBuilder = queryBuilder.eq('category_id', selectedCategory.id)
    }
  }

  const { data: products } = await queryBuilder.limit(40)

  // Identificar categoria selecionada
  const activeCategory = categories?.find(c => c.slug === categorySlug)

  return (
    <div className="bg-[#eceff2]/40 min-h-screen">
      {/* ── Banner Principal / Hero (Estilo Clean EBBIM) ── */}
      <section className="relative bg-white text-foreground overflow-hidden py-16 px-6 border-b border-border">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, #004380 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-5 border border-primary/20">
              Acervo de Tecnologia & Construção
            </span>
            <h1 className="text-3xl md:text-5xl font-black mb-5 leading-tight tracking-tight text-foreground">
              A Empresa Brasileira de <span className="text-primary">BIM</span> evoluiu. <br />
              <span className="text-2xl md:text-3xl font-medium text-slate-500 block mt-2">
                Conheça o acervo da biblioteca <span className="font-bold text-primary">BBBIM</span>.
              </span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
              Explore nossa biblioteca técnica de BIM (Building Information Modeling). Pegue emprestado livros físicos, revistas especializadas, mídias ou acesse arquivos eletrônicos digitalizados de forma instantânea.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#catalogo" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-xs font-bold transition-all cursor-pointer border-none shadow-sm hover:shadow-md">
                Explorar Acervo
              </a>
              <Link href="/" className="bg-[#eceff2]/70 hover:bg-[#eceff2] text-foreground border border-border px-6 py-3 rounded-full text-xs font-bold transition-colors">
                Como Funciona?
              </Link>
            </div>
          </div>
          
          {/* Cover showcase with EBBIM colors */}
          <div className="hidden lg:flex gap-6 items-center">
            <div className="w-36 h-48 rounded-xl shadow-xl origin-bottom -rotate-6 transform transition-all hover:rotate-0"
              style={{ background: 'linear-gradient(135deg, #004380, #0073c6)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span className="text-[8px] uppercase font-bold tracking-wider text-blue-200">Revit</span>
              <span className="font-serif font-black text-xs text-white">Manual de BIM Aplicado</span>
              <span className="text-[8px] text-blue-200 border-t border-white/20 pt-1">Editora ProBooks</span>
            </div>
            <div className="w-36 h-48 rounded-xl shadow-xl rotate-6 transform transition-all hover:rotate-0"
              style={{ background: 'linear-gradient(135deg, #0f172a, #334155)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span className="text-[8px] uppercase font-bold tracking-wider text-slate-300">Revista</span>
              <span className="font-serif font-black text-xs text-white">CADESIGN Especial</span>
              <span className="text-[8px] text-slate-300 border-t border-white/20 pt-1">totalCAD</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Catálogo e Busca ── */}
      <div id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ── Sidebar (Filtro por Categorias) ── */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <Filter size={16} className="text-accent" />
                  Categorias
                </h3>
                {categorySlug && (
                  <Link href={query ? `/?q=${query}` : '/'} className="text-xs text-red-500 hover:underline flex items-center gap-1 font-semibold">
                    <X size={12} /> Limpar
                  </Link>
                )}
              </div>
              
              {categories && categories.length > 0 ? (
                <ul className="space-y-1">
                  <li>
                    <Link 
                      href={query ? `/?q=${query}` : '/'}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        !categorySlug 
                          ? 'bg-primary text-white shadow-xs' 
                          : 'text-slate-600 hover:bg-[#eceff2]/60'
                      }`}
                    >
                      <span>Todos os Itens</span>
                    </Link>
                  </li>
                  {categories.map(cat => (
                    <li key={cat.id}>
                      <Link 
                        href={`/?cat=${cat.slug}${query ? `&q=${query}` : ''}`}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          categorySlug === cat.slug 
                            ? 'bg-primary text-white shadow-xs' 
                            : 'text-slate-600 hover:bg-[#eceff2]/60 hover:text-foreground'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 text-xs py-4 text-center">Nenhuma categoria encontrada.</p>
              )}
            </div>

            {/* Regulamento rápido */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
              <h4 className="font-bold text-foreground text-sm mb-3">Como pegar emprestado?</h4>
              <ul className="text-xs text-slate-500 space-y-3 leading-relaxed">
                <li className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#eceff2] flex items-center justify-center font-bold text-foreground flex-shrink-0">1</span>
                  <span>Escolha o item e clique em <strong>Reservar</strong>.</span>
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#eceff2] flex items-center justify-center font-bold text-foreground flex-shrink-0">2</span>
                  <span>Para itens digitais, o download ou leitura é instantâneo.</span>
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#eceff2] flex items-center justify-center font-bold text-foreground flex-shrink-0">3</span>
                  <span>Itens físicos deverão ser retirados na biblioteca.</span>
                </li>
              </ul>
            </div>
          </aside>

          {/* ── Main Catalog Grid ── */}
          <main className="flex-1">
            {/* Header de resultados */}
            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-foreground leading-tight">
                  {activeCategory ? activeCategory.name : 'Catálogo Geral'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {products ? `${products.length} itens encontrados` : 'Buscando acervo...'}
                  {query && ` para "${query}"`}
                </p>
              </div>

              {/* Filtro ativo tag */}
              {(query || categorySlug) && (
                <div className="flex flex-wrap gap-2">
                  {query && (
                    <span className="inline-flex items-center gap-1.5 bg-[#eceff2] text-foreground text-[10px] font-bold px-3 py-1.5 rounded-full border border-border/80">
                      Busca: {query}
                      <Link href={`/${categorySlug ? `?cat=${categorySlug}` : ''}`} className="hover:text-red-500">
                        <X size={12} />
                      </Link>
                    </span>
                  )}
                  {categorySlug && activeCategory && (
                    <span className="inline-flex items-center gap-1.5 bg-[#eceff2] text-foreground text-[10px] font-bold px-3 py-1.5 rounded-full border border-border/80">
                      Categoria: {activeCategory.name}
                      <Link href={`/${query ? `?q=${query}` : ''}`} className="hover:text-red-500">
                        <X size={12} />
                      </Link>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Vitrine Grid */}
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in-up">
                {products.map(book => (
                  <BookCard key={book.id} book={book as any} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl py-20 text-center border border-border shadow-sm">
                <BookOpen size={48} className="mx-auto mb-4 text-slate-300" />
                <h3 className="font-bold text-foreground text-lg mb-1">Nenhum item encontrado</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  Tente alterar seus termos de busca ou selecione outra categoria na barra lateral.
                </p>
                <Link href="/" className="inline-block mt-5 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer border-none shadow-sm">
                  Ver Todos os Itens
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
