import Link from 'next/link'
import Image from 'next/image'
import { Book, BookOpen, Layers, Disc } from 'lucide-react'
import { Product } from '@/lib/types'
import uploadsMap from '@/lib/uploads-map.json'

// Helper para gerar cores de capa com base no título do livro (como fallback)
function getBookCoverStyle(title: string) {
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const designs = [
    { bg: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', text: '#ffffff' }, // Azul
    { bg: 'linear-gradient(135deg, #14532d, #22c55e)', text: '#ffffff' }, // Verde
    { bg: 'linear-gradient(135deg, #581c87, #a855f7)', text: '#ffffff' }, // Roxo
    { bg: 'linear-gradient(135deg, #7c2d12, #ea580c)', text: '#ffffff' }, // Laranja/Tijolo
    { bg: 'linear-gradient(135deg, #0f172a, #334155)', text: '#f8fafc' }, // Grafite
    { bg: 'linear-gradient(135deg, #881337, #f43f5e)', text: '#ffffff' }, // Vermelho escuro
    { bg: 'linear-gradient(135deg, #0369a1, #0ea5e9)', text: '#ffffff' }  // Azul claro
  ]
  return designs[hash % designs.length]
}

export default function BookCard({ book }: { book: Product }) {
  const categorySlug = book.category?.slug || ''
  const isDigital = categorySlug.includes('eletronico') || categorySlug.includes('digital')
  const isMagazine = categorySlug.includes('revista') || book.title.toLowerCase().includes('revista')
  const isMedia = categorySlug.includes('cd') || categorySlug.includes('dvd') || categorySlug.includes('midia')
  
  // Ícone correspondente
  let MediaIcon = Book
  let mediaLabel = 'Livro'
  
  if (isDigital) {
    MediaIcon = BookOpen
    mediaLabel = 'Digital'
  } else if (isMagazine) {
    MediaIcon = Layers
    mediaLabel = 'Revista'
  } else if (isMedia) {
    MediaIcon = Disc
    mediaLabel = 'CD / DVD'
  }

  const coverStyle = getBookCoverStyle(book.title)
  const imageUrl = (uploadsMap as Record<string, string>)[book.slug] || null

  return (
    <div className="group flex flex-col bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      
      {/* Book Cover */}
      <Link href={`/livro/${book.slug}`} className="relative block w-full pt-[135%] overflow-hidden cursor-pointer bg-[#eceff2]/40 border-b border-border/50">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={book.title} 
            fill 
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div 
            className="absolute inset-0 flex flex-col justify-between p-6 transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ background: coverStyle.bg, color: coverStyle.text }}
          >
            {/* Header of book */}
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                BBBIM Acervo
              </span>
              <MediaIcon className="w-5 h-5 opacity-80" />
            </div>

            {/* Book Title on Cover */}
            <div className="my-auto">
              <p className="font-serif font-bold text-sm md:text-base leading-tight tracking-wide line-clamp-4">
                {book.title}
              </p>
            </div>

            {/* Footer of book */}
            <div className="border-t border-white/20 pt-2 flex justify-between items-center text-[10px]">
              <span className="font-semibold truncate max-w-[100px]">
                {mediaLabel}
              </span>
              <span className="opacity-75">
                ID: {book.wp_id || book.id}
              </span>
            </div>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1 bg-white">
        {/* Category badge */}
        <span className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">
          {book.category?.name || 'Acervo Geral'}
        </span>
        
        {/* Title */}
        <Link href={`/livro/${book.slug}`} className="flex-1 cursor-pointer">
          <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>

        {/* Availability / Action */}
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
          {isDigital ? (
            <span className="text-[10px] font-medium text-accent bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              Digital
            </span>
          ) : (
            <span className="text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              Físico
            </span>
          )}
          
          <Link 
            href={`/livro/${book.slug}`}
            className="bg-primary hover:bg-primary-dark text-white px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-colors cursor-pointer border-none shadow-xs"
          >
            {isDigital ? 'Acessar' : 'Reservar'}
          </Link>
        </div>
      </div>
    </div>
  )
}
