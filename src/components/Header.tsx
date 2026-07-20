'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Search, Rss } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/categorias', label: 'Categorias' },
  { href: '/sobre', label: 'Sobre' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-lg"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
              B
            </div>
            <div>
              <span className="font-bold text-white text-lg leading-none block">BBBIM Store</span>
              <span className="text-sky-200 text-xs leading-none">Building Information Modeling</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href}
                className="text-sky-100 hover:text-white font-medium text-sm transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/busca"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-sky-200 hover:text-white hover:bg-white/10 transition-all">
              <Search size={18} />
            </Link>
            <Link href="/feed.xml"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-sky-200 hover:text-white hover:bg-white/10 transition-all">
              <Rss size={18} />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-sky-600/40 pt-3">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block py-2 text-sky-100 hover:text-white font-medium text-sm">
                {l.label}
              </Link>
            ))}
            <Link href="/busca" onClick={() => setOpen(false)}
              className="flex items-center gap-2 py-2 text-sky-100 hover:text-white text-sm">
              <Search size={16} /> Buscar
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
