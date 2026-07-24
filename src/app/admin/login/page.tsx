'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ShieldAlert, KeyRound, Mail } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

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

      if (error) {
        setErrorMsg('E-mail ou senha incorretos.')
        setLoading(false)
        return
      }

      // Login bem sucedido!
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
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-sm mb-4">
            B
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">
            Painel Administrativo
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 uppercase tracking-widest font-bold">
            Biblioteca BBBIM
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
                Endereço de E-mail
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
                  placeholder="exemplo@ebbim.com.br"
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
