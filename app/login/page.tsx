'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Componente de login separado que usa useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  
  const [isSignup, setIsSignup] = useState(searchParams.get('signup') === 'true');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        });
        
        if (error) throw error;
        
        // Mostrar mensaje de confirmación
        setError('Revisa tu email para confirmar tu cuenta');
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      setError(error.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-2 text-2xl font-semibold text-white">
        {isSignup ? 'Crear cuenta' : 'Bienvenido de vuelta'}
      </h2>
      <p className="mb-6 text-sm text-slate-400">
        {isSignup 
          ? 'Comienza a medir la satisfacción de tus clientes' 
          : 'Ingresa a tu cuenta para ver tus métricas'}
      </p>

      {error && (
        <div className={`mb-4 rounded-lg p-3 text-sm ${
          error.includes('email') ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20' 
          : 'bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20'
        }`}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none ring-0 focus:border-cyan-500/50 focus:bg-white/10 transition"
            placeholder="tu@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-slate-300">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none ring-0 focus:border-cyan-500/50 focus:bg-white/10 transition"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg hover:from-indigo-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Procesando...' : (isSignup ? 'Crear cuenta' : 'Entrar')}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-400">
        {isSignup ? (
          <>
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => setIsSignup(false)}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Inicia sesión
            </button>
          </>
        ) : (
          <>
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => setIsSignup(true)}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Regístrate gratis
            </button>
          </>
        )}
      </div>
    </>
  );
}

// Componente principal com Suspense
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Decoración de fondo */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-indigo-500/40 via-fuchsia-500/30 to-cyan-400/40 blur-sm" />
              <div className="relative grid size-10 place-items-center rounded-xl bg-white/10 p-1 shadow-sm ring-1 ring-white/20 backdrop-blur">
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <defs>
                    <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#logo-gradient)" d="M5 12c0-3.866 3.134-7 7-7 1.657 0 3 1.343 3 3s-1.343 3-3 3-3 1.343-3 3 1.343 3 3 3c3.866 0 7-3.134 7-7 0-.552.448-1 1-1s1 .448 1 1c0 4.971-4.029 9-9 9s-9-4.029-9-9Z" />
                </svg>
              </div>
            </div>
            <span className="text-xl font-semibold text-white">DeepCX</span>
          </Link>
        </div>

        {/* Card de login con Suspense */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
          <Suspense fallback={
            <div className="text-center text-slate-400">
              Cargando...
            </div>
          }>
            <LoginForm />
          </Suspense>

          <div className="mt-4 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-400">
              ← Volver al inicio
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} DeepCX. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}