import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/PostCard'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: cat } = await supabase.from('categories').select('name, description').eq('slug', slug).single()
  if (!cat) return { title: 'Categoria não encontrada' }
  return {
    title: `${cat.name} — Dicas de BIM`,
    description: cat.description ?? `Posts sobre ${cat.name}`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      id, title, slug, excerpt, cover_image, published_at,
      author:authors(id, name, avatar_url),
      category:categories(id, name, slug)
    `)
    .eq('status', 'published')
    .eq('category_id', category.id)
    .order('published_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-sky-600 mb-8 transition-colors">
        <ArrowLeft size={15} /> Voltar ao início
      </Link>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-slate-200">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{ background: '#e0f2fe', color: '#0284c7' }}>
          Categoria
        </span>
        <h1 className="text-3xl font-black text-slate-900 mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-slate-500 text-lg">{category.description}</p>
        )}
        <p className="text-sm text-slate-400 mt-2">{posts?.length ?? 0} post{(posts?.length ?? 0) !== 1 ? 's' : ''}</p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post as any} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl" style={{ background: 'white' }}>
          <p className="text-slate-500">Nenhum post nesta categoria ainda.</p>
        </div>
      )}
    </div>
  )
}
