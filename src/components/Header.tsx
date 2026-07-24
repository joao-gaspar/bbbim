'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Menu, X, Search, BookMarked, User } from 'lucide-react'

export default function Header() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/?q=${encodeURIComponent(trimmed)}`)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="sticky top-0 z-50 shadow-sm">
      {/* Top Decorative Stripe */}
      <div className="h-1 w-full bg-primary"></div>

      <header className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-6">
          
          {/* Logo Oficial da Marca BBBIM */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo/logo-preto.png" 
              alt="BBBIM — Biblioteca de Tecnologia e Construção" 
              className="h-10 md:h-11 w-auto object-contain" 
            />
          </Link>

          {/* Search Bar (Center) */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="flex w-full border border-border rounded-full overflow-hidden bg-white shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar livros, revistas, CDs, DVDs no acervo..." 
                className="w-full px-5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-6 flex items-center justify-center transition-colors cursor-pointer border-none">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6 text-foreground">
            <button className="flex items-center gap-2 hover:text-accent transition-colors cursor-pointer border-none bg-transparent">
              <User size={22} strokeWidth={1.75} className="text-muted-foreground group-hover:text-accent" />
              <div className="text-left leading-none">
                <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Minha Conta</span>
                <span className="block text-xs font-bold text-foreground mt-0.5">Entrar</span>
              </div>
            </button>

            <button className="flex items-center gap-3 hover:text-accent transition-colors relative group cursor-pointer border-none bg-transparent">
              <div className="relative">
                <BookMarked size={24} strokeWidth={1.75} className="text-muted-foreground group-hover:text-accent" />
                <span className="absolute -top-1.5 -right-2 bg-accent text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  0
                </span>
              </div>
              <div className="text-left leading-none">
                <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Acervo</span>
                <span className="block text-xs font-bold text-foreground mt-0.5">Meus Empréstimos</span>
              </div>
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-foreground p-2 border-none bg-transparent">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Search & Menu */}
        {open && (
          <div className="md:hidden pt-4 pb-4 px-4 border-t border-border bg-white space-y-4 shadow-inner">
            <form onSubmit={handleSearch} className="flex w-full border border-border rounded-full overflow-hidden bg-white">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar no acervo..." 
                className="w-full px-4 py-2 text-sm text-foreground outline-none"
              />
              <button type="submit" className="bg-primary text-white px-4 flex items-center justify-center border-none">
                <Search size={16} />
              </button>
            </form>
            <div className="flex justify-around pt-2">
              <button className="flex flex-col items-center gap-1 text-foreground border-none bg-transparent">
                <User size={20} className="text-muted-foreground" />
                <span className="text-xs font-semibold">Conta</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-foreground border-none bg-transparent">
                <BookMarked size={20} className="text-muted-foreground" />
                <span className="text-xs font-semibold">Lista (0)</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
