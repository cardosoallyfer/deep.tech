'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
      
      // Si el usuario está logueado, redirigir al dashboard
      if (user) {
        router.push('/admin/dashboard');
      }
    };
    checkUser();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 mx-auto"></div>
          <p className="mt-4 text-sm text-zinc-500">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si el usuario está logueado, mostrar loading mientras redirige
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 mx-auto"></div>
          <p className="mt-4 text-sm text-zinc-500">Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  // Landing page para usuarios no autenticados
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Header */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
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
        </div>
        <div className="flex items-center gap-6">
          <Link href="/demo" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
            Demo
          </Link>
          <Link href="/login" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
            Iniciar sesión
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="relative">
            <div className="absolute -inset-x-48 -top-12 h-64 bg-gradient-to-tr from-indigo-500/30 via-fuchsia-500/30 to-rose-500/30 blur-3xl" />
            <h1 className="relative text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
              Encuestas de satisfacción
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600 bg-clip-text text-transparent">
                para retail físico
              </span>
            </h1>
          </div>
          
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            Conocé la experiencia de tus clientes en tiempo real.
            <br />
            QR dinámicos, métricas instantáneas, 100% Argentina.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            >
              Solicitar acceso
            </Link>
            <Link
              href="/demo"
              className="flex items-center gap-2 text-sm font-semibold leading-6 text-zinc-900"
            >
              Ver demo
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-32 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500/10 to-fuchsia-500/10">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">NPS en tiempo real</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Medí la satisfacción de tus clientes con métricas estándar de la industria.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500/10 to-fuchsia-500/10">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">QR dinámicos</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Generá códigos QR únicos para cada sucursal, mesa o punto de contacto.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500/10 to-fuchsia-500/10">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">Sin apps</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Tus clientes responden desde el navegador, sin descargar nada.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl border-t border-zinc-200 px-6 py-12">
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            © 2024 DeepCX. Hecho con ❤️ en Argentina.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-900">
              Términos
            </Link>
            <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-900">
              Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}