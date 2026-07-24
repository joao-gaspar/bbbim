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

export interface Product {
  id: number
  wp_id: number | null
  title: string
  slug: string
  description: string | null
  price: number
  regular_price: number | null
  sale_price: number | null
  category_id: number | null
  status: string
  published_at: string | null
  created_at: string
  updated_at: string
  category?: ProductCategory | null
}

export interface ProductCategory {
  id: number
  wp_id: number | null
  name: string
  slug: string
  description: string | null
  created_at: string
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
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'category'>
        Update: Partial<Omit<Product, 'id' | 'category'>>
      }
      product_categories: {
        Row: ProductCategory
        Insert: Omit<ProductCategory, 'id'>
        Update: Partial<Omit<ProductCategory, 'id'>>
      }
    }
  }
}

