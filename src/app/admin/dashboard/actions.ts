'use server'

import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/auth/admin'
import { revalidatePath } from 'next/cache'

// Função auxiliar para gerar slugs de forma segura
export async function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/\s+/g, '-') // Substitui espaços por hífen
    .replace(/[^\w\-]+/g, '') // Remove caracteres não alfanuméricos
    .replace(/\-\-+/g, '-') // Remove hífens duplicados
    .replace(/^-+/, '') // Remove hífen do início
    .replace(/-+$/, ''); // Remove hífen do fim
}

// Helper para formatar metadados em HTML na descrição do produto
function buildHtmlDescription(fields: {
  resumo: string
  editora: string
  autores: string
  ano: string
  pais: string
  midia: string
}) {
  let html = fields.resumo.trim() + '\n\n'
  
  if (fields.editora.trim()) html += `<strong>Editora</strong>: ${fields.editora.trim()}\n`
  if (fields.autores.trim()) html += `<strong>Autores</strong>: ${fields.autores.trim()}\n`
  if (fields.ano.trim()) html += `<strong>Ano de publicação</strong>: ${fields.ano.trim()}\n`
  if (fields.pais.trim()) html += `<strong>País</strong>: ${fields.pais.trim()}\n`
  if (fields.midia.trim()) html += `<strong>Mídia</strong>: ${fields.midia.trim()}\n`
  
  return html.trim()
}

// Ação de criação de livro
export async function createProduct(formData: {
  title: string
  category_id: number
  status: 'published' | 'draft'
  resumo: string
  editora: string
  autores: string
  ano: string
  pais: string
  midia: string
}) {
  const supabase = await createClient()
  
  // 1. Verificar se usuário está logado e se é ADMIN
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminUser(user)) {
    return { success: false, error: 'Acesso negado: apenas administradores do acervo podem cadastrar itens.' }
  }

  try {
    // 2. Gerar slug único
    let baseSlug = await slugify(formData.title)
    if (!baseSlug) baseSlug = 'sem-titulo'
    
    let slug = baseSlug
    let counter = 1
    
    // Verificar se o slug já existe
    while (true) {
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
        
      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // 3. Montar a descrição em HTML
    const description = buildHtmlDescription({
      resumo: formData.resumo,
      editora: formData.editora,
      autores: formData.autores,
      ano: formData.ano,
      pais: formData.pais,
      midia: formData.midia
    })

    // 4. Inserir no banco
    const { data, error } = await supabase
      .from('products')
      .insert({
        title: formData.title,
        slug,
        category_id: formData.category_id || null,
        status: formData.status,
        description,
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    revalidatePath(`/livro/${slug}`)
    if (formData.category_id) {
      const { data: cat } = await supabase
        .from('product_categories')
        .select('slug')
        .eq('id', formData.category_id)
        .single()
      if (cat) revalidatePath(`/categoria/${cat.slug}`)
    }

    return { success: true, product: data }
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro interno' }
  }
}

// Ação de atualização de livro
export async function updateProduct(
  id: number,
  formData: {
    title: string
    category_id: number
    status: 'published' | 'draft'
    resumo: string
    editora: string
    autores: string
    ano: string
    pais: string
    midia: string
  }
) {
  const supabase = await createClient()

  // 1. Verificar se usuário está logado e se é ADMIN
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminUser(user)) {
    return { success: false, error: 'Acesso negado: apenas administradores podem alterar o acervo.' }
  }

  try {
    // Buscar produto antigo para revalidar caminhos
    const { data: oldProduct } = await supabase
      .from('products')
      .select('slug, category_id')
      .eq('id', id)
      .single()

    // 2. Montar descrição em HTML
    const description = buildHtmlDescription({
      resumo: formData.resumo,
      editora: formData.editora,
      autores: formData.autores,
      ano: formData.ano,
      pais: formData.pais,
      midia: formData.midia
    })

    // 3. Atualizar no banco
    const { data, error } = await supabase
      .from('products')
      .update({
        title: formData.title,
        category_id: formData.category_id || null,
        status: formData.status,
        description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // 4. Revalidar caminhos no Next.js
    revalidatePath('/')
    if (oldProduct) revalidatePath(`/livro/${oldProduct.slug}`)
    revalidatePath(`/livro/${data.slug}`)
    
    // Revalidar categorias
    if (oldProduct?.category_id) {
      const { data: cat } = await supabase
        .from('product_categories')
        .select('slug')
        .eq('id', oldProduct.category_id)
        .single()
      if (cat) revalidatePath(`/categoria/${cat.slug}`)
    }
    if (formData.category_id && formData.category_id !== oldProduct?.category_id) {
      const { data: cat } = await supabase
        .from('product_categories')
        .select('slug')
        .eq('id', formData.category_id)
        .single()
      if (cat) revalidatePath(`/categoria/${cat.slug}`)
    }

    return { success: true, product: data }
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro interno' }
  }
}

// Ação de exclusão de livro
export async function deleteProduct(id: number) {
  const supabase = await createClient()

  // 1. Verificar se usuário está logado e se é ADMIN
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminUser(user)) {
    return { success: false, error: 'Acesso negado: apenas administradores podem excluir itens.' }
  }

  try {
    // Buscar produto para saber o slug e categoria
    const { data: product } = await supabase
      .from('products')
      .select('slug, category_id')
      .eq('id', id)
      .single()

    // 2. Excluir do banco
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    // 3. Revalidar caminhos
    revalidatePath('/')
    if (product) {
      revalidatePath(`/livro/${product.slug}`)
      if (product.category_id) {
        const { data: cat } = await supabase
          .from('product_categories')
          .select('slug')
          .eq('id', product.category_id)
          .single()
        if (cat) revalidatePath(`/categoria/${cat.slug}`)
      }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro interno' }
  }
}
