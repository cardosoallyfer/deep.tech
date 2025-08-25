'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const [mode, setMode] = useState<'password' | 'magic'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'password') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        router.push('/admin/dashboard');
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/admin/dashboard`,
          },
        });
        
        if (error) throw error;
        setSuccess('¡Magic link enviado! Revisa tu correo electrónico.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Header */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="group inline-flex items-center gap-2">
          <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl">
            <span className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-rose-500 blur-[8px] opacity-40" />
            <span className="relative z-10 h-6 w-6 rounded-lg bg-white/80" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            DeepCX
            <span className="ml-2 rounded-md bg-black px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
              beta
            </span>
          </span>
        </a>
        <div className="hidden text-xs text-zinc-500 md:block">
          Encuestas de satisfacción • Argentina
        </div>
      </div>

      {/* Main Content */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-6 px-6 pb-24 md:grid-cols-2">
        {/* Left Panel - Hero */}
        <div className="relative hidden overflow-hidden rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm md:block">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-500/30 via-fuchsia-500/30 to-rose-500/30 blur-3xl" />
          
          <header className="relative z-10 mb-8">
            <h1 className="text-3xl font-semibold leading-tight">Iniciar sesión</h1>
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              Accede a tu panel para crear encuestas, generar QR y ver el NPS en tiempo real.
            </p>
          </header>

          <ul className="relative z-10 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">✓</span>
              <div>
                <p className="font-medium text-zinc-800">Links & QR instantáneos</p>
                <p className="text-zinc-500">Crea campañas y comparte en mostradores o recibos.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">✓</span>
              <div>
                <p className="font-medium text-zinc-800">NPS, CSAT o 5 estrellas</p>
                <p className="text-zinc-500">Primera pregunta obligatoria con métricas estándar.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">✓</span>
              <div>
                <p className="font-medium text-zinc-800">Atributos por tienda</p>
                <p className="text-zinc-500">Hasta 5 atributos opcionales (atención, calidad, rapidez…).</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Panel - Login Form */}
        <div className="mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 p-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-rose-500 text-white shadow-sm">
                  ★
                </span>
                <div>
                  <h2 className="text-sm font-semibold">Bienvenido de vuelta</h2>
                  <p className="text-xs text-zinc-500">Ingresa a tu cuenta para continuar</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Mode Toggle */}
              <div className="mb-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('password')}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    mode === 'password'
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  Email & contraseña
                </button>
                <button
                  type="button"
                  onClick={() => setMode('magic')}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    mode === 'magic'
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  Magic Link
                </button>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">
                  {success}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-zinc-700">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
                  />
                </div>

                {mode === 'password' && (
                  <div className="space-y-1.5">
                    <label htmlFor="password" className="text-xs font-medium text-zinc-700">
                      Contraseña
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full overflow-hidden rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-95 disabled:opacity-50"
                >
                  <span className="absolute -inset-x-10 -top-10 h-16 rotate-6 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 opacity-20 blur-xl" />
                  <span className="relative">
                    {loading ? 'Cargando...' : mode === 'password' ? 'Entrar' : 'Enviar Magic Link'}
                  </span>
                </button>
              </form>

              <p className="mt-6 text-center text-xs leading-relaxed text-zinc-500">
                Al continuar, aceptas nuestros{' '}
                <a href="#" className="underline underline-offset-4">Términos</a> y{' '}
                <a href="#" className="underline underline-offset-4">Política de privacidad</a>.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-500">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="underline underline-offset-4">Solicitar acceso</a>
          </p>
        </div>
      </section>
    </main>
  );
}