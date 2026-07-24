import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, BookOpen, Shield, Layers, Disc, Book } from 'lucide-react'
import BookCard from '@/components/BookCard'
import { cleanDescription } from '@/lib/utils'
import uploadsMap from '@/lib/uploads-map.json'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

// Color cover generator helper (keeps consistency with BookCard)
function getBookCoverStyle(title: string) {
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const designs = [
    { bg: 'linear-gradient(135deg, #004380, #0073c6)', text: '#ffffff' },
    { bg: 'linear-gradient(135deg, #14532d, #22c55e)', text: '#ffffff' },
    { bg: 'linear-gradient(135deg, #581c87, #a855f7)', text: '#ffffff' },
    { bg: 'linear-gradient(135deg, #7c2d12, #ea580c)', text: '#ffffff' },
    { bg: 'linear-gradient(135deg, #0f172a, #334155)', text: '#f8fafc' },
    { bg: 'linear-gradient(135deg, #881337, #f43f5e)', text: '#ffffff' },
    { bg: 'linear-gradient(135deg, #0369a1, #0ea5e9)', text: '#ffffff' }
  ]
  return designs[hash % designs.length]
}

// Function to extract specific metadata details from the description HTML
function parseBookMetadata(desc: string | null) {
  if (!desc) return []
  const metadataList: { label: string; value: string }[] = []
  
  // Regex to extract <strong>Label</strong>: Value
  const regex = /<strong>([^<]+)<\/strong>:\s*([^<\r\n\t]+)/gi
  let match
  while ((match = regex.exec(desc)) !== null) {
    const label = match[1].trim().replace(/:$/, '')
    const value = match[2].trim()
    
    // Ignore shortcodes (empty [acf...])
    if (value.includes('[acf')) {
      continue
    }
    metadataList.push({ label, value })
  }
  return metadataList
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: book } = await supabase
    .from('products')
    .select('title, description')
    .eq('slug', slug)
    .single()

  if (!book) return { title: 'Livro não encontrado' }

  return {
    title: `${book.title} — Biblioteca BBBIM`,
    description: cleanDescription(book.description).slice(0, 150),
  }
}

export default async function BookDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Buscar livro
  const { data: book } = await supabase
    .from('products')
    .select(`
      *,
      category:product_categories(id, name, slug)
    `)
    .eq('slug', slug)
    .single()

  if (!book) notFound()

  // Itens relacionados da mesma categoria
  const { data: related } = await supabase
    .from('products')
    .select(`
      id, wp_id, title, slug, description, price, regular_price, sale_price, category_id, status, published_at,
      category:product_categories(id, name, slug)
    `)
    .eq('status', 'published')
    .eq('category_id', book.category_id)
    .neq('id', book.id)
    .limit(4)

  const coverStyle = getBookCoverStyle(book.title)
  const bookMetadata = parseBookMetadata(book.description)
  const cleanedDesc = cleanDescription(book.description)

  const categorySlug = book.category?.slug || ''
  const isDigital = categorySlug.includes('eletronico') || categorySlug.includes('digital')
  const isMagazine = categorySlug.includes('revista') || book.title.toLowerCase().includes('revista')
  const isMedia = categorySlug.includes('cd') || categorySlug.includes('dvd') || categorySlug.includes('midia')
  
  let mediaLabel = 'Livro Físico'
  let MediaIcon = Book
  if (isDigital) {
    mediaLabel = 'Documento Eletrônico (Digital)'
    MediaIcon = BookOpen
  } else if (isMagazine) {
    mediaLabel = 'Revista Técnica'
    MediaIcon = Layers
  } else if (isMedia) {
    mediaLabel = 'CD / DVD (Mídia Física)'
    MediaIcon = Disc
  }

  const imageUrl = (uploadsMap as Record<string, string>)[book.slug] || null

  return (
    <div className="bg-[#eceff2]/40 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors font-bold">
            <ArrowLeft size={16} /> Voltar ao catálogo
          </Link>
        </div>

        {/* ── Main Book Container ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-10">
            
            {/* Column 1: Book Cover Showcase (Left) */}
            <div className="md:col-span-4 flex flex-col items-center">
              {imageUrl ? (
                <div className="w-full max-w-[280px] aspect-[1/1.38] relative rounded-2xl overflow-hidden shadow-md mb-6 border border-border/80">
                  <Image 
                    src={imageUrl} 
                    alt={book.title} 
                    fill 
                    priority
                    sizes="(max-width: 640px) 280px, 350px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="w-full max-w-[280px] aspect-[1/1.38] rounded-2xl shadow-md flex flex-col justify-between p-6 mb-6 select-none animate-fade-in"
                  style={{ background: coverStyle.bg, color: coverStyle.text }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                      BBBIM Acervo
                    </span>
                    <MediaIcon className="w-5 h-5 opacity-80" />
                  </div>
                  <div className="my-auto">
                    <h2 className="font-serif font-bold text-lg md:text-xl leading-tight tracking-wide line-clamp-5">
                      {book.title}
                    </h2>
                  </div>
                  <div className="border-t border-white/20 pt-2 flex justify-between items-center text-[10px]">
                    <span className="font-semibold">{mediaLabel}</span>
                    <span className="opacity-75">ID: {book.wp_id || book.id}</span>
                  </div>
                </div>
              )}

              {/* Status card */}
              <div className="w-full max-w-[280px] bg-[#eceff2]/40 rounded-xl p-4 border border-border text-center space-y-3">
                <div className="text-xs text-foreground">
                  Status: 
                  {isDigital ? (
                    <span className="font-bold text-accent bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full ml-1.5 font-sans">Disponível Online</span>
                  ) : (
                    <span className="font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full ml-1.5 font-sans">Disponível Retirada</span>
                  )}
                </div>
                
                <button className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl text-xs font-bold tracking-wide transition-colors cursor-pointer border-none shadow-sm hover:shadow-md">
                  {isDigital ? 'Acessar Documento Digital' : 'Solicitar Reserva'}
                </button>
              </div>
            </div>

            {/* Column 2: Details & Description (Right) */}
            <div className="md:col-span-8 flex flex-col justify-between">
              <div>
                {/* Category & Format tags */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {book.category && (
                    <Link href={`/?cat=${book.category.slug}`} className="text-xs font-bold text-accent bg-blue-50 border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
                      {book.category.name}
                    </Link>
                  )}
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    {mediaLabel}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-black text-foreground leading-tight mb-5">
                  {book.title}
                </h1>

                {/* Description */}
                <div className="prose max-w-none text-slate-600 text-sm leading-relaxed mb-8">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Resumo / Descrição</h3>
                  <p>{cleanedDesc}</p>
                </div>
              </div>

              {/* Book Metadata details table */}
              {bookMetadata.length > 0 && (
                <div className="border-t border-border pt-6">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Detalhes do Acervo</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#eceff2]/30 p-4 rounded-xl border border-border">
                    {bookMetadata.map((meta, i) => (
                      <div key={i} className="flex flex-col text-xs">
                        <span className="text-slate-400 font-semibold">{meta.label}</span>
                        <span className="text-foreground font-bold mt-0.5">{meta.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security info */}
              <div className="flex items-center gap-2.5 text-slate-400 text-xs mt-6 pt-6 border-t border-border">
                <Shield size={16} className="text-green-600" />
                <span>Empréstimo assegurado pelas regras da ABNT e Biblioteca Nacional.</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Related Items Section ── */}
        {related && related.length > 0 && (
          <section className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-bold text-foreground">Itens semelhantes no acervo</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {related.map(item => (
                <BookCard key={item.id} book={item as any} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
