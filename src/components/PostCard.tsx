import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, Tag } from 'lucide-react'
import { Post } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
  post: Post
  featured?: boolean
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <Link href={`/post/${post.slug}`} className="group block card-hover rounded-2xl overflow-hidden"
        style={{ background: 'white', boxShadow: '0 2px 20px rgba(0,0,0,0.07)' }}>
        <div className="md:flex">
          {post.cover_image && (
            <div className="md:w-1/2 relative h-60 md:h-auto overflow-hidden">
              <Image src={post.cover_image} alt={post.title} fill
                className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          )}
          <div className={`p-7 flex flex-col justify-center ${post.cover_image ? 'md:w-1/2' : 'w-full'}`}>
            {post.category && (
              <span className="inline-block text-xs font-bold uppercase tracking-wider mb-3 px-3 py-1 rounded-full"
                style={{ background: '#e0f2fe', color: '#0284c7' }}>
                {post.category.name}
              </span>
            )}
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors leading-tight">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-slate-400">
              {post.author && (
                <span className="flex items-center gap-1">
                  <User size={13} /> {post.author.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={13} /> {formatDate(post.published_at)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/post/${post.slug}`} className="group block card-hover rounded-2xl overflow-hidden"
      style={{ background: 'white', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
      {post.cover_image && (
        <div className="relative h-48 overflow-hidden">
          <Image src={post.cover_image} alt={post.title} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="p-5">
        {post.category && (
          <span className="inline-block text-xs font-bold uppercase tracking-wider mb-2 px-2.5 py-0.5 rounded-full"
            style={{ background: '#e0f2fe', color: '#0284c7' }}>
            {post.category.name}
          </span>
        )}
        <h3 className="font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors leading-snug line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-slate-500 text-sm leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-slate-400 pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {formatDate(post.published_at)}
          </span>
          {post.author && (
            <span className="flex items-center gap-1">
              <User size={12} /> {post.author.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
