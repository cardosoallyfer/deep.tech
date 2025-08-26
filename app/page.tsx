'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const DURATION = 10000;
  const TICK = 100;

  const [variant, setVariant] = React.useState('pulse');
  const [timeLeft, setTimeLeft] = React.useState(DURATION);

  React.useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - TICK;
        if (next <= 0) {
          setVariant((v) => (v === 'pulse' ? 'stores' : 'pulse'));
          return DURATION;
        }
        return next;
      });
    }, TICK);
    return () => clearInterval(id);
  }, []);

  const progress = timeLeft / DURATION;

  const t = {
    badge: 'Nuevo',
    tagline: 'Encuestas de satisfacción en minutos',
    headline: 'Mide NPS/CSAT, recibe feedback y mejora la experiencia—sin fricción',
    subhead: 'Crea encuestas con QR y links y ve resultados en tiempo real para compartir insights con tu equipo.',
    ctaPrimary: 'Comenzar gratis',
    ctaSecondary: 'Ver demo',
    ctaLogin: 'Entrar',
    featuresTitle: 'Por qué DeepCX',
    f1: 'NPS/CSAT de 1 clic',
    f1d: 'Plantillas listas con lógicas básicas.',
    f2: 'QR + Links compartibles',
    f2d: 'Ideal para mostrador, post‑venta o WhatsApp.',
    f3: 'Atributos personalizables',
    f3d: 'Evalúa Rapidez, Calidad o lo que definas.',
    f4: 'Análisis en tiempo real',
    f4d: 'Dashboards claros y exportables.',
    f5: 'Multi‑tenant',
    f5d: 'Subdominios por tienda o marca.',
    f6: 'Privacidad y seguridad',
    f6d: 'Buenas prácticas de datos.',
    trust: '500 respuestas gratis • Sin tarjeta • Cancela cuando quieras',
    pulseTitle: 'Pulso de satisfacción en vivo',
    storesTitle: 'Tiendas en Buenos Aires (en vivo)',
    metricNps: 'NPS actual',
    metricCsat: 'CSAT promedio',
    metricResponses: 'Respuestas hoy',
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-neutral-100 via-neutral-150 to-neutral-200 text-neutral-900 selection:bg-indigo-300/40">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        </div>

        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="font-semibold tracking-tight">DeepCX</span>
            <span className="ml-2 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-700 ring-1 ring-emerald-500/20">
              {t.badge}
            </span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a className="text-sm text-neutral-700 hover:text-neutral-900" href="#features">{t.featuresTitle}</a>
            <a className="text-sm text-neutral-700 hover:text-neutral-900" href="#pulse">Demo</a>
            <a className="text-sm text-neutral-700 hover:text-neutral-900" href="#precios">Precios</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link 
              href="/login"
              className="hidden rounded-xl px-3 py-2 text-sm text-neutral-800 ring-1 ring-neutral-300 transition hover:bg-neutral-100 md:block"
            >
              {t.ctaLogin}
            </Link>
            <Link
              href="/login?signup=true"
              className="hidden rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white shadow-sm transition hover:opacity-90 md:block"
            >
              Crear cuenta
            </Link>
          </div>
        </header>

        <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-8 pt-6 md:grid-cols-2 md:gap-12 md:pb-14 md:pt-10">
          <div>
            <p className="mb-3 text-sm font-medium tracking-tight text-indigo-600">{t.tagline}</p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              {t.headline}
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-neutral-700">
              {t.subhead}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button 
                onClick={() => router.push('/login?signup=true')}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow transition hover:bg-indigo-500"
              >
                {t.ctaPrimary}
              </button>
              <button className="rounded-xl px-5 py-3 text-sm font-medium ring-1 ring-neutral-300 transition hover:bg-neutral-100">
                {t.ctaSecondary}
              </button>
              <span className="text-xs text-neutral-600">{t.trust}</span>
            </div>
          </div>

          <div id="pulse" className="relative">
            <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-fuchsia-400/10 to-cyan-400/10 blur-2xl" />
            <div className="relative rounded-2xl border border-neutral-300 bg-white/80 p-5 text-neutral-900 shadow-xl backdrop-blur">
              <PulseProgress progress={progress} seconds={Math.ceil(timeLeft / 1000)} />
              {variant === 'pulse' ? (
                <>
                  <PulseHeader title={t.pulseTitle} subtle />
                  <SurveyPulse t={t} />
                </>
              ) : (
                <>
                  <PulseHeader title={t.storesTitle} subtle />
                  <StoresOverview />
                </>
              )}
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-10">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">{t.featuresTitle}</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Feature icon={<BoltIcon />} title={t.f1} desc={t.f1d} />
            <Feature icon={<QrIcon />} title={t.f2} desc={t.f2d} />
            <Feature icon={<TuneIcon />} title={t.f3} desc={t.f3d} />
            <Feature icon={<ChartIcon />} title={t.f4} desc={t.f4d} />
            <Feature icon={<LayersIcon />} title={t.f5} desc={t.f5d} />
            <Feature icon={<ShieldIcon />} title={t.f6} desc={t.f6d} />
          </div>
        </section>

        <footer className="mx-auto max-w-7xl px-6 pb-10 pt-4">
          <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-300 pt-6 text-sm text-neutral-600 md:flex-row">
            <p>© {new Date().getFullYear()} DeepCX. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-neutral-800">Privacidad</a>
              <a href="#" className="hover:text-neutral-800">Términos</a>
              <a href="#" className="hover:text-neutral-800">Contacto</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Componentes auxiliares (mantidos do original mas simplificados)
function PulseProgress({ progress, seconds }: { progress: number; seconds: number }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between text-[11px] text-neutral-500">
        <span>Siguiente vista en</span>
        <span>{seconds}s</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-indigo-500 transition-[width] duration-100"
          style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
        />
      </div>
    </div>
  );
}

function PulseHeader({ title, subtle = false }: { title: string; subtle?: boolean }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <span className={subtle ? 'text-xs text-neutral-500' : 'text-xs text-neutral-400'}>{title}</span>
      <div className={subtle ? 'flex items-center gap-2 text-xs text-neutral-500' : 'flex items-center gap-2 text-xs text-neutral-400'}>
        <span className="inline-block size-2 animate-pulse rounded-full bg-emerald-400" />
        <span>live</span>
      </div>
    </div>
  );
}

function SurveyPulse({ t }: { t: any }) {
  const [nps, setNps] = React.useState(40);
  const [csat, setCsat] = React.useState(4.6);
  const [responses, setResponses] = React.useState(128);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNps(prev => Math.max(-100, Math.min(100, prev + Math.round(Math.random() * 10 - 5))));
      setCsat(v => Number(Math.max(1, Math.min(5, v + (Math.random() * 0.1 - 0.05))).toFixed(1)));
      setResponses(r => r + Math.floor(Math.random() * 4));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard label={t.metricNps} value={nps > 0 ? `+${nps}` : `${nps}`} />
      <StatCard label={t.metricCsat} value={`${csat.toFixed(1)}★`} />
      <StatCard label={t.metricResponses} value={responses.toLocaleString('es-AR')} />
      <div className="rounded-xl border border-neutral-300 bg-white/70 p-4">
        <div className="text-[11px] text-neutral-500">Tendencia</div>
        <div className="mt-2 text-lg font-semibold text-emerald-600">▲ +2.5%</div>
      </div>
    </div>
  );
}

function StoresOverview() {
  const barrios = ['Palermo', 'Recoleta', 'Belgrano', 'Caballito'];
  const [stores] = React.useState(() =>
    barrios.map(name => ({
      name,
      nps: Math.round(Math.random() * 80 - 10),
      csat: Number((4 + Math.random()).toFixed(1)),
      resp: 50 + Math.floor(Math.random() * 200),
    }))
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {stores.map(s => (
        <div key={s.name} className="rounded-xl border border-neutral-300 bg-white/80 p-4">
          <div className="mb-2 font-medium">{s.name}</div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-[11px] text-neutral-500">NPS</div>
              <div className="text-lg font-semibold">{s.nps > 0 ? `+${s.nps}` : s.nps}</div>
            </div>
            <div>
              <div className="text-[11px] text-neutral-500">CSAT</div>
              <div className="text-lg font-semibold">{s.csat}★</div>
            </div>
            <div>
              <div className="text-[11px] text-neutral-500">Resp.</div>
              <div className="text-lg font-semibold">{s.resp}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-300 bg-white/70 p-4">
      <div className="text-[11px] text-neutral-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group rounded-2xl border border-neutral-200 bg-white/70 p-5 shadow-sm">
      <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl ring-1 ring-neutral-200">
        {icon}
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-neutral-700">{desc}</p>
    </div>
  );
}

function LogoMark() {
  return (
    <div className="relative">
      <div className="absolute -inset-1 -z-10 rounded-xl bg-gradient-to-tr from-indigo-500/40 via-fuchsia-500/30 to-cyan-400/40 blur-sm" />
      <div className="grid size-8 place-items-center rounded-xl bg-white/80 p-1 shadow-sm ring-1 ring-neutral-200 backdrop-blur">
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <path fill="url(#g)" d="M5 12c0-3.866 3.134-7 7-7 1.657 0 3 1.343 3 3s-1.343 3-3 3-3 1.343-3 3 1.343 3 3 3c3.866 0 7-3.134 7-7 0-.552.448-1 1-1s1 .448 1 1c0 4.971-4.029 9-9 9s-9-4.029-9-9Z" />
        </svg>
      </div>
    </div>
  );
}

// Ícones
function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-indigo-600">
      <path fill="currentColor" d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-indigo-600">
      <path fill="currentColor" d="M3 3h8v8H3V3Zm2 2v4h4V5H5Zm6 6h4v2h-4v-2Zm-8 2h8v8H3v-8Zm2 2v4h4v-4H5Zm10-12h6v6h-6V3Zm2 2v2h2V5h-2Zm-2 14h2v2h-2v-2Zm4-4h2v6h-6v-2h4v-4Z" />
    </svg>
  );
}

function TuneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-indigo-600">
      <path fill="currentColor" d="M3 6h10v2H3V6Zm0 10h6v2H3v-2Zm12-6h6v2h-6v-2Zm0-4h2v2h-2V6Zm0 8h2v2h-2v-2Z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-indigo-600">
      <path fill="currentColor" d="M3 3h2v18H3V3Zm4 8h2v10H7V11Zm4-6h2v16h-2V5Zm4 4h2v12h-2V9Zm4 6h2v6h-2v-6Z" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-indigo-600">
      <path fill="currentColor" d="M12 2 1 7l11 5 11-5-11-5Zm0 9L1 6v2l11 5 11-5V6l-11 5Zm0 4L1 11v2l11 5 11-5v-2l-11 4Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-indigo-600">
      <path fill="currentColor" d="M12 2 4 5v7c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10V5l-8-3Z" />
    </svg>
  );
}