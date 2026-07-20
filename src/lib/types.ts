export interface Post {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string | null
  published_at: string
  updated_at: string
  category: Category | null
  author: Author | null
  tags: Tag[]
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  post_count?: number
}

export interface Author {
  id: number
  name: string
  email: string
  avatar_url: string | null
  bio: string | null
}

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: Post
        Insert: Omit<Post, 'id' | 'author' | 'category' | 'tags'>
        Update: Partial<Omit<Post, 'id' | 'author' | 'category' | 'tags'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id'>
        Update: Partial<Omit<Category, 'id'>>
      }
      authors: {
        Row: Author
        Insert: Omit<Author, 'id'>
        Update: Partial<Omit<Author, 'id'>>
      }
    }
  }
}
