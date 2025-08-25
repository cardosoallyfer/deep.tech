'use client';

import Link from 'next/link';

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Header */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl">
            <span className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-rose-500 blur-[8px] opacity-40" />
            <span className="relative z-10 h-6 w-6 rounded-lg bg-white/80" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            DeepCX
            <span className="ml-2 rounded-md bg-black px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
              demo
            </span>
          </span>
        </Link>
        <Link
          href="/login"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Iniciar sesión
        </Link>
      </nav>

      {/* Demo Content */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            Demo Interactiva
          </h1>
          <p className="mt-4 text-lg text-zinc-600">
            Prueba cómo funciona DeepCX desde la perspectiva de tus clientes
          </p>
        </div>

        {/* Simulated Phone */}
        <div className="mx-auto mt-12 max-w-sm">
          <div className="rounded-3xl border-8 border-zinc-900 bg-zinc-900 p-2 shadow-2xl">
            <div className="overflow-hidden rounded-2xl bg-white">
              {/* Phone Status Bar */}
              <div className="flex items-center justify-between bg-zinc-100 px-4 py-2 text-xs">
                <span>9:41 AM</span>
                <span>⚡ 🔋 100%</span>
              </div>
              
              {/* Survey Content */}
              <div className="p-6">
                <div className="mb-6 text-center">
                  <h2 className="text-lg font-semibold text-zinc-900">
                    ¡Gracias por tu visita!
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600">
                    Tu opinión nos ayuda a mejorar
                  </p>
                </div>

                {/* NPS Question */}
                <div className="mb-6">
                  <p className="mb-4 text-sm font-medium text-zinc-700">
                    ¿Qué tan probable es que nos recomiendes a un amigo o colega?
                  </p>
                  <div className="grid grid-cols-6 gap-2 text-xs">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        className={`rounded-lg border py-3 font-medium transition hover:border-zinc-400 ${
                          num === 9
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-zinc-200 text-zinc-700'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-zinc-500">
                    <span>Nada probable</span>
                    <span>Muy probable</span>
                  </div>
                </div>

                {/* Attributes */}
                <div className="mb-6 space-y-3">
                  <p className="text-sm font-medium text-zinc-700">
                    ¿Cómo calificarías estos aspectos?
                  </p>
                  {['Atención al cliente', 'Calidad del producto', 'Rapidez del servicio'].map((attr) => (
                    <div key={attr} className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600">{attr}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className={`text-lg ${
                              star <= 4 ? 'text-yellow-400' : 'text-zinc-300'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <button className="w-full rounded-lg bg-zinc-900 py-3 text-sm font-medium text-white">
                  Enviar respuesta
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              ⚡
            </div>
            <h3 className="font-semibold text-zinc-900">Respuesta rápida</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Menos de 30 segundos para completar
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600">
              📱
            </div>
            <h3 className="font-semibold text-zinc-900">Mobile-first</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Optimizado para cualquier dispositivo
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              🎯
            </div>
            <h3 className="font-semibold text-zinc-900">Sin fricción</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Sin registro ni datos personales
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg font-semibold text-zinc-900">
            ¿Te gustó lo que viste?
          </p>
          <Link
            href="/login"
            className="mt-4 inline-flex rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
          >
            Crear mi cuenta gratis →
          </Link>
        </div>
      </section>
    </main>
  );
}