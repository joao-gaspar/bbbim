import Link from 'next/link'

const categories = [
  { name: 'Livros', slug: 'livros' },
  { name: 'Revistas', slug: 'revistas' },
  { name: 'CDs e DVDs', slug: 'cds-e-dvds' },
  { name: 'Normas Técnicas', slug: 'normas-tecnicas' },
  { name: 'Documentos Eletrônicos', slug: 'documentos-eletronicos' }
]

export default function Footer() {
  return (
    <footer className="bg-[#080b0f] text-slate-400 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand Column (EBBIM style) */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-base shadow-sm">
                B
              </div>
              <div>
                <span className="font-bold text-white text-base block leading-none">Biblioteca BBBIM</span>
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest leading-none mt-1 block">Acervo Técnico</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              O maior acervo de Building Information Modeling do Brasil. Consulta e empréstimo de livros físicos, mídias digitais e documentos eletrônicos. Uma iniciativa integrada para a capacitação em BIM.
            </p>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Categorias do Acervo</h3>
            <ul className="space-y-3">
              {categories.map(cat => (
                <li key={cat.slug}>
                  <Link href={`/?cat=${cat.slug}`}
                    className="text-sm hover:text-accent transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Navegação</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Catálogo Geral' },
                { href: '/', label: 'Como Funciona o Empréstimo' },
                { href: '/', label: 'Regulamento' },
                { href: '/', label: 'Ajuda / Contato' },
              ].map((l, i) => (
                <li key={i}>
                  <Link href={l.href} className="text-sm hover:text-accent transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Biblioteca BBBIM. Integrante do ecossistema EBBIM.</p>
          <p className="text-xs text-slate-500">Sistema de Gestão de Acervo Digital + Físico</p>
        </div>
      </div>
    </footer>
  )
}
