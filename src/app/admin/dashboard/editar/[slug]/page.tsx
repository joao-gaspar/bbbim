import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import AdminProductForm from '@/components/AdminProductForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editar Item — Biblioteca BBBIM',
}

interface Props {
  params: Promise<{ slug: string }>
}

// Parser reverso para preencher o formulário a partir do HTML salvo no banco
function parseHtmlDescription(html: string | null) {
  if (!html) {
    return { resumo: '', editora: '', autores: '', ano: '', pais: '', midia: 'Livro Físico' }
  }

  // 1. Extrair o Resumo Geral (tudo que vem antes do primeiro <strong>)
  const firstStrongIdx = html.indexOf('<strong')
  let resumo = ''
  if (firstStrongIdx !== -1) {
    resumo = html.substring(0, firstStrongIdx).trim()
  } else {
    resumo = html.trim()
  }

  // Limpar formatação de string escapada do seed se necessário
  resumo = resumo.replace(/\\r\\n|\\n/g, '\n').trim()

  // 2. Extrair metadados específicos baseados nos padrões <strong>Rótulo</strong>: Valor
  const getMetadataValue = (label: string) => {
    // Regex para buscar o valor após <strong>Rotulo</strong>:
    const regex = new RegExp(`<strong>${label}</strong>:\\s*([^<\r\n\t\\n]+)`, 'i')
    const match = regex.exec(html)
    if (match) {
      const val = match[1].trim()
      // Ignorar shortcodes antigos do WordPress
      if (val.includes('[acf')) {
        return ''
      }
      return val
    }
    return ''
  }

  return {
    resumo,
    editora: getMetadataValue('Editora'),
    autores: getMetadataValue('Autores'),
    ano: getMetadataValue('Ano de publicação') || getMetadataValue('Ano'),
    pais: getMetadataValue('País'),
    midia: getMetadataValue('Mídia') || getMetadataValue('Midia') || 'Livro Físico'
  }
}

export default async function EditProductPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. Verificar autenticação no servidor
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  // 2. Buscar categorias de produtos para o formulário
  const { data: categories } = await supabase
    .from('product_categories')
    .select('*')
    .order('name', { ascending: true })

  // 3. Buscar o produto a ser editado
  const { data: book } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!book) notFound()

  // 4. Executar o parser reverso na descrição do livro
  const parsedDesc = parseHtmlDescription(book.description)

  const initialData = {
    id: book.id,
    title: book.title,
    category_id: book.category_id || 0,
    status: book.status as 'published' | 'draft',
    resumo: parsedDesc.resumo,
    editora: parsedDesc.editora,
    autores: parsedDesc.autores,
    ano: parsedDesc.ano,
    pais: parsedDesc.pais,
    midia: parsedDesc.midia
  }

  return (
    <div className="bg-[#eceff2]/40 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdminProductForm 
          categories={categories || []} 
          initialData={initialData} 
        />
      </div>
    </div>
  )
}
