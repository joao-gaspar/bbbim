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

          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo/logo-branco.png" 
                alt="BBBIM — Biblioteca de Tecnologia e Construção" 
                className="h-5 w-auto object-contain" 
              />
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

          {/* Contact Column */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Biblioteca Técnica</h3>
            <p className="text-sm leading-relaxed text-slate-400 mb-4">
              Sistema de gestão de biblioteca de livros físicos, periódicos, DVDs, CDs e acervo eletrônico digitalizado.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Biblioteca BBBIM. Todos os direitos reservados.</p>
          <p className="text-xs text-slate-500">Sistema de Gestão de Acervo Digital + Físico</p>
        </div>
      </div>
    </footer>
  )
}
