'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createProduct, updateProduct } from '@/app/admin/dashboard/actions'
import { ArrowLeft, ShieldAlert, CheckCircle } from 'lucide-react'
import { ProductCategory } from '@/lib/types'

interface FormProps {
  categories: ProductCategory[]
  initialData?: {
    id?: number
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
}

export default function AdminProductForm({ categories, initialData }: FormProps) {
  const router = useRouter()
  const isEdit = !!initialData
  
  // Estados do formulário
  const [title, setTitle] = useState(initialData?.title || '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '')
  const [status, setStatus] = useState<'published' | 'draft'>(initialData?.status || 'published')
  
  const [resumo, setResumo] = useState(initialData?.resumo || '')
  const [editora, setEditora] = useState(initialData?.editora || '')
  const [autores, setAutores] = useState(initialData?.autores || '')
  const [ano, setAno] = useState(initialData?.ano || '')
  const [pais, setPais] = useState(initialData?.pais || '')
  const [midia, setMidia] = useState(initialData?.midia || 'Livro Físico')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    if (!title.trim()) {
      setErrorMsg('O título é obrigatório.')
      setLoading(false)
      return
    }

    const payload = {
      title,
      category_id: categoryId ? parseInt(categoryId as string) : 0,
      status,
      resumo,
      editora,
      autores,
      ano,
      pais,
      midia
    }

    try {
      let result
      if (isEdit && initialData?.id) {
        result = await updateProduct(initialData.id, payload)
      } else {
        result = await createProduct(payload)
      }

      if (result.success) {
        setSuccessMsg(isEdit ? 'Item atualizado com sucesso!' : 'Novo item adicionado ao acervo!')
        setTimeout(() => {
          router.push('/admin/dashboard')
          router.refresh()
        }, 1200)
      } else {
        setErrorMsg(result.error || 'Erro desconhecido ao salvar o item.')
        setLoading(false)
      }
    } catch (err: any) {
      setErrorMsg('Ocorreu um erro ao processar sua solicitação.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Back to Dashboard */}
      <div className="flex items-center justify-between">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors font-bold">
          <ArrowLeft size={16} /> Voltar ao Painel
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-border shadow-xs">
        <h1 className="text-xl font-black text-foreground">
          {isEdit ? 'Editar Item do Acervo' : 'Adicionar Novo Item ao Acervo'}
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">
          Biblioteca BBBIM
        </p>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5">
          <ShieldAlert size={18} className="flex-shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle size={18} className="flex-shrink-0 text-green-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-3xl border border-border shadow-xs">
          {/* Title */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Título da Publicação / Obra *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do livro, revista técnica, etc..."
              className="w-full px-4 py-2.5 border border-border rounded-xl text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Categoria
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-xl text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-white"
            >
              <option value="">Selecione uma categoria...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Format / Media */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Formato / Mídia
            </label>
            <select
              value={midia}
              onChange={(e) => setMidia(e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-xl text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-white"
            >
              <option value="Livro Físico">Livro Físico</option>
              <option value="Revista Técnica">Revista Técnica</option>
              <option value="CD/DVD">CD/DVD</option>
              <option value="Acesso Digital">Acesso Digital</option>
            </select>
          </div>

          {/* Publication Status */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Status do Catálogo
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-4 py-2.5 border border-border rounded-xl text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-white"
            >
              <option value="published">Publicado (Visível no acervo)</option>
              <option value="draft">Rascunho (Privado)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Metadata Fields */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-foreground border-b border-border pb-2">Especificações e Metadados (Opcional)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Autores */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Autor(es)
              </label>
              <input
                type="text"
                value={autores}
                onChange={(e) => setAutores(e.target.value)}
                placeholder="Ex: João Gaspar, Marcus D'Alvia"
                className="w-full px-4 py-2.5 border border-border rounded-xl text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
              />
            </div>

            {/* Editora */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Editora
              </label>
              <input
                type="text"
                value={editora}
                onChange={(e) => setEditora(e.target.value)}
                placeholder="Ex: totalCAD, ProBooks"
                className="w-full px-4 py-2.5 border border-border rounded-xl text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
              />
            </div>

            {/* Ano */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Ano de Publicação
              </label>
              <input
                type="text"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                placeholder="Ex: 2026"
                className="w-full px-4 py-2.5 border border-border rounded-xl text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
              />
            </div>

            {/* Pais */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                País de Origem
              </label>
              <input
                type="text"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                placeholder="Ex: Brasil, EUA"
                className="w-full px-4 py-2.5 border border-border rounded-xl text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Description / Resumo */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-xs">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Resumo / Descrição Geral
          </label>
          <textarea
            rows={6}
            value={resumo}
            onChange={(e) => setResumo(e.target.value)}
            placeholder="Escreva uma descrição detalhada ou resumo do livro..."
            className="w-full px-4 py-2.5 border border-border rounded-xl text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground resize-y"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/dashboard" className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer border-none text-center">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer border-none disabled:opacity-50 text-center"
          >
            {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Adicionar ao Acervo'}
          </button>
        </div>

      </form>

    </div>
  )
}
