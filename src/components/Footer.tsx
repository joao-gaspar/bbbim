import Link from 'next/link'
import { BookOpen } from 'lucide-react'

const categories = [
  { name: 'Livros', slug: 'livros' },
  { name: 'Revistas', slug: 'revistas' },
  { name: 'CDs e DVDs', slug: 'cds-e-dvds' },
  { name: 'Normas Técnicas', slug: 'normas-tecnicas' },
  { name: 'Documentos Eletrônicos', slug: 'documentos-eletronicos' }
]

export default function Footer() {
  return (
    <footer style={{ background: '#202935' }} className="text-slate-400 mt-20 border-t-4 border-[#fed700]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#fed700] flex items-center justify-center text-[#333e48] font-black text-lg">
                B
              </div>
              <span className="font-bold text-white text-lg">Biblioteca BBBIM</span>
            </div>
            <p className="text-sm leading-relaxed">
              O maior acervo de Building Information Modeling do Brasil. Consulta e empréstimo de livros físicos, mídias digitais e documentos eletrônicos nos moldes do projeto archive.org.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Categorias do Acervo</h3>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat.slug}>
                  <Link href={`/?cat=${cat.slug}`}
                    className="text-sm hover:text-[#fed700] transition-colors">
                    {cat.name}
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
                { href: '/', label: 'Catálogo Geral' },
                { href: '/', label: 'Como Funciona o Empréstimo' },
                { href: '/', label: 'Regulamento' },
                { href: '/', label: 'Ajuda / Contato' },
              ].map((l, i) => (
                <li key={i}>
                  <Link href={l.href} className="text-sm hover:text-[#fed700] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© {new Date().getFullYear()} Biblioteca BBBIM. Todos os direitos reservados.</p>
          <p className="text-xs">Sistema de Gestão de Acervo Digital + Físico</p>
        </div>
      </div>
    </footer>
  )
}
