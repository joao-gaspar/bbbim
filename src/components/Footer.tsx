import Link from 'next/link'
import { Rss } from 'lucide-react'

const categories = ['BIM', 'Revit', 'ArchiCAD', 'IFC', 'Coordenação']

export default function Footer() {
  return (
    <footer style={{ background: '#0c1a2e' }} className="text-slate-400 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-lg"
                style={{ background: 'linear-gradient(135deg,#0ea5e9,#0284c7)' }}>
                B
              </div>
              <span className="font-bold text-white text-lg">Dicas de BIM</span>
            </div>
            <p className="text-sm leading-relaxed">
              O portal de referência em BIM no Brasil. Conteúdo técnico, tutoriais e novidades sobre Building Information Modeling.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="/feed.xml" className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-sky-600 transition-colors text-slate-300 hover:text-white">
                <Rss size={16} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Categorias</h3>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat}>
                  <Link href={`/categoria/${cat.toLowerCase().replace(/ã/g,'a').replace(/ç/g,'c')}`}
                    className="text-sm hover:text-sky-400 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navegação</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Início' },
                { href: '/categorias', label: 'Todas as Categorias' },
                { href: '/sobre', label: 'Sobre o Blog' },
                { href: '/busca', label: 'Busca' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-sky-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© {new Date().getFullYear()} Dicas de BIM. Todos os direitos reservados.</p>
          <p className="text-xs">Desenvolvido com Next.js + Supabase</p>
        </div>
      </div>
    </footer>
  )
}
