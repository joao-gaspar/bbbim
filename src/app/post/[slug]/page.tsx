import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, User, Tag, ArrowLeft, Share2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import PostCard from '@/components/PostCard'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, cover_image')
    .eq('slug', slug)
    .single()

  if (!post) return { title: 'Post não encontrado' }

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image ? [post.cover_image] : [],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select(`
      *,
      author:authors(id, name, avatar_url, bio),
      category:categories(id, name, slug)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  // Posts relacionados
  const { data: related } = await supabase
    .from('posts')
    .select(`id, title, slug, excerpt, cover_image, published_at,
      author:authors(id, name, avatar_url),
      category:categories(id, name, slug)`)
    .eq('status', 'published')
    .eq('category_id', post.category_id)
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(3)

  return (
    <article>
      {/* ── Cover ── */}
      {post.cover_image && (
        <div className="relative h-72 md:h-[420px] w-full overflow-hidden">
          <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))' }} />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* ── Back ── */}
        <div className="py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-sky-600 transition-colors">
            <ArrowLeft size={15} /> Voltar ao início
          </Link>
        </div>

        {/* ── Header ── */}
        <header className="mb-10">
          {post.category && (
            <Link href={`/categoria/${post.category.slug}`}
              className="inline-block text-xs font-bold uppercase tracking-wider mb-4 px-3 py-1 rounded-full"
              style={{ background: '#e0f2fe', color: '#0284c7' }}>
              {post.category.name}
            </Link>
          )}
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-slate-500 leading-relaxed mb-6">{post.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400 pb-6 border-b border-slate-100">
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.avatar_url ? (
                  <Image src={post.author.avatar_url} alt={post.author.name}
                    width={32} height={32} className="rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: '#0ea5e9' }}>
                    {post.author.name[0]}
                  </div>
                )}
                <span className="font-medium text-slate-700">{post.author.name}</span>
              </div>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {formatDate(post.published_at)}
            </span>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="prose mx-auto mb-16"
          dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* ── Author bio ── */}
        {post.author?.bio && (
          <div className="mb-16 p-6 rounded-2xl flex gap-5 items-start"
            style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
            {post.author.avatar_url ? (
              <Image src={post.author.avatar_url} alt={post.author.name}
                width={56} height={56} className="rounded-full flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                style={{ background: '#0ea5e9' }}>
                {post.author.name[0]}
              </div>
            )}
            <div>
              <p className="font-bold text-slate-900 mb-1">{post.author.name}</p>
              <p className="text-sm text-slate-600">{post.author.bio}</p>
            </div>
          </div>
        )}

        {/* ── Related posts ── */}
        {related && related.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-slate-900">Posts Relacionados</h2>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map(p => <PostCard key={p.id} post={p as any} />)}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
