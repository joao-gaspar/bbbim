'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isAdminUser } from '@/lib/auth/admin'
import { ShieldAlert, KeyRound, Mail } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setErrorMsg('Acesso Restrito: sua conta é de Leitor/Membro e não tem acesso ao painel de administração.')
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMsg('Por favor, preencha todos os campos.')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      })

      if (error || !data.user) {
        setErrorMsg('E-mail ou senha incorretos.')
        setLoading(false)
        return
      }

      // Validar se o usuário autenticado tem permissão de Admin
      if (!isAdminUser(data.user)) {
        await supabase.auth.signOut()
        setErrorMsg('Acesso Restrito: este e-mail está cadastrado como Leitor/Membro e não pode alterar o acervo da biblioteca.')
        setLoading(false)
        return
      }

      // Login de Admin bem sucedido!
      router.push('/admin/dashboard')
      router.refresh()
    } catch (err: any) {
      setErrorMsg('Erro inesperado ao efetuar o login.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#eceff2]/40 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-border shadow-sm">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo/logo-preto.png" 
            alt="BBBIM Logo" 
            className="h-12 w-auto object-contain mb-4" 
          />
          <h2 className="text-2xl font-black text-foreground tracking-tight">
            Painel Administrativo
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 uppercase tracking-widest font-bold">
            Gestão do Acervo
          </p>
        </div>

        {/* Error alert */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5">
            <ShieldAlert size={18} className="flex-shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Endereço de E-mail do Administrador
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@bbbim.com.br"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Senha Administrativa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound size={16} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-sm hover:shadow-md cursor-pointer border-none disabled:opacity-50"
            >
              {loading ? 'Efetuando Login...' : 'Acessar Painel'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Carregando...</div>}>
      <LoginForm />
    </Suspense>
  )
}
