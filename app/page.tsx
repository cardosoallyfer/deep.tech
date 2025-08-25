'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
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
        <Link
          href="/login"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Iniciar sesión
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
            Encuestas de satisfacción para{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
              tiendas físicas
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            Genera QR codes instantáneos, recopila feedback en tiempo real y mejora la experiencia de tus clientes con métricas NPS, CSAT y 5 estrellas.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
            >
              Comenzar gratis
            </Link>
            <Link
              href="/demo"
              className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Ver demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon="📱"
            title="QR Instantáneos"
            description="Genera códigos QR únicos para cada sucursal o campaña en segundos."
          />
          <FeatureCard
            icon="📊"
            title="Métricas Estándar"
            description="NPS, CSAT o 5 estrellas como pregunta principal obligatoria."
          />
          <FeatureCard
            icon="🎯"
            title="Atributos Personalizados"
            description="Hasta 5 atributos opcionales para evaluar aspectos específicos."
          />
          <FeatureCard
            icon="📈"
            title="Dashboard en Tiempo Real"
            description="Visualiza las respuestas y métricas al instante."
          />
          <FeatureCard
            icon="🇦🇷"
            title="100% en Español"
            description="Diseñado específicamente para el mercado argentino."
          />
          <FeatureCard
            icon="☁️"
            title="Sin Instalación"
            description="100% cloud, accede desde cualquier dispositivo."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 p-[2px]">
          <div className="rounded-3xl bg-white p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              ¿Listo para mejorar la experiencia de tus clientes?
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              Comienza gratis y sin tarjeta de crédito.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
            >
              Crear mi primera encuesta →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 text-3xl">{icon}</div>
      <h3 className="mb-2 font-semibold text-zinc-900">{title}</h3>
      <p className="text-sm text-zinc-600">{description}</p>
    </div>
  );
}