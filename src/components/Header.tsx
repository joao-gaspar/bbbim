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
    <header className="sticky top-0 z-50 shadow-md bg-white border-b border-[#fed700]/20">
      <div className="bg-[#fed700] text-[#333e48] text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-semibold">
          <span>Bem-vindo à Biblioteca BBBIM</span>
          <div className="flex gap-4">
            <Link href="/" className="hover:underline">Como pegar emprestado?</Link>
            <Link href="/" className="hover:underline">Contato</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#fed700] flex items-center justify-center text-[#333e48] font-black text-xl">
              B
            </div>
            <div>
              <span className="font-black text-[#333e48] text-2xl tracking-tighter block leading-none">BBBIM</span>
              <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest leading-none">Biblioteca</span>
            </div>
          </Link>

          {/* Search Bar (Center) */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="flex w-full border-2 border-[#fed700] rounded-full overflow-hidden bg-white">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar livros, revistas, CDs, DVDs no acervo..." 
                className="w-full px-5 py-2.5 text-sm text-gray-700 outline-none"
              />
              <button type="submit" className="bg-[#fed700] hover:bg-[#e8c400] text-[#333e48] px-6 flex items-center justify-center transition-colors cursor-pointer border-none">
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6 text-[#333e48]">
            <button className="flex items-center gap-2 hover:text-[#fed700] transition-colors cursor-pointer border-none bg-transparent">
              <User size={24} strokeWidth={1.5} />
              <div className="text-left leading-none">
                <span className="block text-[11px] text-gray-500">Minha Conta</span>
                <span className="block text-sm font-bold">Entrar</span>
              </div>
            </button>

            <button className="flex items-center gap-3 hover:text-[#fed700] transition-colors relative group cursor-pointer border-none bg-transparent">
              <div className="relative">
                <BookMarked size={28} strokeWidth={1.5} />
                <span className="absolute -top-1 -right-2 bg-[#fed700] text-[#333e48] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  0
                </span>
              </div>
              <div className="text-left leading-none">
                <span className="block text-[11px] text-gray-500">Meus Empréstimos</span>
                <span className="block text-sm font-bold">Ver Lista</span>
              </div>
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-[#333e48] p-2 border-none bg-transparent">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Search & Menu */}
        {open && (
          <div className="md:hidden pt-4 pb-2 border-t border-gray-100 mt-4 space-y-4">
            <form onSubmit={handleSearch} className="flex w-full border-2 border-[#fed700] rounded-full overflow-hidden bg-white">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar no acervo..." 
                className="w-full px-4 py-2 text-sm text-gray-700 outline-none"
              />
              <button type="submit" className="bg-[#fed700] text-[#333e48] px-4 flex items-center justify-center border-none">
                <Search size={18} />
              </button>
            </form>
            <div className="flex justify-around pt-2">
              <button className="flex flex-col items-center gap-1 text-[#333e48] border-none bg-transparent">
                <User size={20} />
                <span className="text-xs font-semibold">Conta</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-[#333e48] border-none bg-transparent">
                <BookMarked size={20} />
                <span className="text-xs font-semibold">Lista (0)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
