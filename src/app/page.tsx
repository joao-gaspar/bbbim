import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { ArrowRight, BookOpen, Layers, Cpu } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dicas de BIM — Building Information Modeling no Brasil',
  description: 'Tutoriais, dicas e novidades sobre BIM, Revit, ArchiCAD e IFC. O portal de referência em BIM no Brasil.',
}

export const revalidate = 3600 // ISR: revalida a cada 1h

const highlights = [
  { icon: BookOpen, label: 'Tutoriais', desc: 'Guias passo a passo para softwares BIM', href: '/categoria/bim' },
  { icon: Layers, label: 'Coordenação', desc: 'Compatibilização de modelos BIM', href: '/categoria/coordenacao' },
  { icon: Cpu, label: 'IFC', desc: 'Padrão aberto para intercâmbio de dados', href: '/categoria/ifc' },
]

export default async function HomePage() {
  const supabase = await createClient()

  // Buscar posts mais recentes
  const { data: posts } = await supabase
    .from('products')
    .select(`
      id, title, slug, excerpt, cover_image, published_at,
      author:authors(id, name, avatar_url),
      category:categories(id, name, slug)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(9)

  const featuredPost = posts?.[0] ?? null
  const recentPosts = posts?.slice(1) ?? []

  // Buscar categorias com contagem
  const { data: categories } = await supabase
    .from('product_categories')
    .select('id, name, slug')
    .limit(6)

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 60%, #38bdf8 100%)' }}
        className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="max-w-3xl mx-auto text-center relative">
          <span className="inline-block text-sky-200 text-sm font-semibold uppercase tracking-widest mb-4">
            Portal BIM no Brasil
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Aprenda BIM com quem<br />
            <span style={{ color: '#fbbf24' }}>vive na prática</span>
          </h1>
          <p className="text-sky-100 text-lg mb-8 leading-relaxed">
            Tutoriais, dicas e novidades sobre Building Information Modeling, Revit, ArchiCAD e IFC.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/categorias"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'white', color: '#0284c7' }}>
              Explorar Conteúdo <ArrowRight size={16} />
            </Link>
            <Link href="/busca"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-sky-400/50 text-white hover:bg-white/10 transition-all">
              Buscar Posts
            </Link>
          </div>
        </div>
      </section>

      {/* ── Highlights ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 mb-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {highlights.map(({ icon: Icon, label, desc, href }) => (
            <Link key={label} href={href}
              className="card-hover flex items-start gap-4 p-5 rounded-2xl"
              style={{ background: 'white', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#e0f2fe' }}>
                <Icon size={20} style={{ color: '#0284c7' }} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-0.5">{label}</h3>
                <p className="text-slate-500 text-xs">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">

        {/* ── Featured post ── */}
        {featuredPost && (
          <section className="mb-14 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-slate-900">Destaque</h2>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <PostCard post={featuredPost as any} featured />
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── Recent posts ── */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-slate-900">Últimos Posts</h2>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {recentPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {recentPosts.map((post, i) => (
                  <div key={post.id} className={`animate-fade-in-up animate-delay-${Math.min(i + 1, 3)}`}>
                    <PostCard post={post as any} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl" style={{ background: 'white' }}>
                <BookOpen size={40} className="mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500">Nenhum post publicado ainda.</p>
                <p className="text-slate-400 text-sm mt-1">Aguarde novos conteúdos em breve!</p>
              </div>
            )}

            {posts && posts.length >= 9 && (
              <div className="text-center mt-8">
                <Link href="/posts"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: '#0ea5e9', color: 'white' }}>
                  Ver todos os posts <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-6">
            {/* Categories */}
            <div className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              <h3 className="font-bold text-slate-900 mb-4">Categorias</h3>
              {categories && categories.length > 0 ? (
                <ul className="space-y-2">
                  {categories.map(cat => (
                    <li key={cat.id}>
                      <Link href={`/categoria/${cat.slug}`}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-sky-50 group transition-colors">
                        <span className="text-sm font-medium text-slate-700 group-hover:text-sky-700">
                          {cat.name}
                        </span>
                        <ArrowRight size={14} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 text-sm">Nenhuma categoria ainda.</p>
              )}
            </div>

            {/* Newsletter CTA */}
            <div className="rounded-2xl p-6 text-white"
              style={{ background: 'linear-gradient(135deg, #0c4a6e, #0ea5e9)' }}>
              <h3 className="font-bold mb-2">Fique atualizado</h3>
              <p className="text-sky-100 text-sm mb-4">Novos conteúdos de BIM direto na sua caixa de entrada.</p>
              <Link href="/sobre"
                className="inline-block w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                Saiba mais
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

