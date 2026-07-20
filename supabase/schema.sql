-- =============================================
-- Schema Supabase: BBBIM (Loja)
-- Migração do WordPress/WooCommerce para PostgreSQL
-- =============================================

CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TABLE IF NOT EXISTS authors (
  id         SERIAL PRIMARY KEY,
  wp_id      INTEGER,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio        TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  wp_id       INTEGER,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_categories (
  id          SERIAL PRIMARY KEY,
  wp_id       INTEGER,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id           SERIAL PRIMARY KEY,
  wp_id        INTEGER,
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  content      TEXT,
  author_id    INTEGER REFERENCES authors(id),
  category_id  INTEGER REFERENCES categories(id),
  status       TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id               SERIAL PRIMARY KEY,
  wp_id            INTEGER,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  price            NUMERIC(10,2) DEFAULT 0.00,
  regular_price    NUMERIC(10,2),
  sale_price       NUMERIC(10,2),
  category_id      INTEGER REFERENCES product_categories(id),
  status           TEXT DEFAULT 'draft',
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública de posts" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Leitura pública de categorias" ON categories FOR SELECT USING (true);
CREATE POLICY "Leitura pública de produtos" ON products FOR SELECT USING (status = 'published');
CREATE POLICY "Leitura pública de categorias de produto" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Leitura pública de autores" ON authors FOR SELECT USING (true);
