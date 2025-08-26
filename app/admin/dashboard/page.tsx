'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  LayoutDashboard, 
  PencilLine, 
  Layers, 
  MessageSquare, 
  ListChecks, 
  Menu as MenuIcon, 
  ChevronDown,
  LogOut,
  Settings,
  User
} from 'lucide-react';

type PageKey = 'dashboard' | 'criar' | 'agrupamentos' | 'respostas' | 'pesquisas';

const PAGES = [
  { key: 'dashboard' as PageKey, label: 'Dashboard', icon: LayoutDashboard },
  { key: 'criar' as PageKey, label: 'Criar pesquisa', icon: PencilLine },
  { key: 'agrupamentos' as PageKey, label: 'Agrupamentos', icon: Layers },
  { key: 'respostas' as PageKey, label: 'Respostas', icon: MessageSquare },
  { key: 'pesquisas' as PageKey, label: 'Pesquisas', icon: ListChecks },
];

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [page, setPage] = useState<PageKey>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        setLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Navegação por teclado (1-5)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key >= '1' && e.key <= '5') {
        const idx = Number(e.key) - 1;
        const target = PAGES[idx];
        if (target) setPage(target.key);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  const ActiveIcon = PAGES.find(p => p.key === page)?.icon || LayoutDashboard;

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1200px_800px_at_10%_-10%,#3b82f64d,transparent),radial-gradient(1000px_600px_at_110%_20%,#8b5cf64d,transparent)] bg-slate-950 text-slate-100">
      {/* Grid luminoso de fondo */}
      <div className="pointer-events-none fixed inset-0 opacity-30 [mask-image:radial-gradient(1000px_600px_at_50%_-10%,black,transparent)]">
        <GridPattern />
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar (hover para expandir) */}
        <aside className="group/sidebar sticky top-0 hidden h-screen w-20 hover:w-72 shrink-0 border-r border-white/10 bg-white/5 backdrop-blur-xl lg:block transition-[width] duration-300">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 p-5">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-cyan-500/30 ring-1 ring-inset ring-white/20">
                <IconLogo className="h-6 w-6" />
              </div>
              <div className="overflow-hidden opacity-0 transition-all duration-300 ease-out max-w-0 group-hover/sidebar:max-w-[180px] group-hover/sidebar:opacity-100">
                <p className="truncate text-lg font-semibold tracking-tight">DeepCX</p>
                <p className="truncate text-xs text-slate-400">Surveys • AR</p>
              </div>
            </div>

            {/* Navegação */}
            <nav className="mt-2 grid gap-1 p-3">
              {PAGES.map(({ key, label, icon: Icon }) => {
                const active = page === key;
                return (
                  <button
                    key={key}
                    title={label}
                    onClick={() => setPage(key)}
                    className={`group/nav relative flex items-center rounded-xl px-4 py-3 text-left transition ${
                      active
                        ? 'bg-white/10 ring-1 ring-white/20 shadow-inner'
                        : 'hover:bg-white/5 hover:ring-1 hover:ring-white/10'
                    }`}
                  >
                    <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full ${
                      active ? 'bg-cyan-400' : 'bg-transparent group-hover/nav:bg-white/20'
                    }`} />
                    <Icon className="h-5 w-5 text-slate-300 group-hover/nav:text-white" />
                    <span className="ml-3 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-out max-w-0 group-hover/sidebar:max-w-[200px] group-hover/sidebar:opacity-100 text-sm font-medium">
                      {label}
                    </span>
                    {active && (
                      <span className="ml-auto hidden rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-200 ring-1 ring-cyan-400/30 group-hover/sidebar:inline">
                        activo
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Footer sidebar */}
            <div className="mt-auto space-y-2 p-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">Ambiente</p>
                <p className="mt-1 text-sm font-semibold">Producción</p>
                <p className="text-xs text-slate-400">Atajos: 1-5</p>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="w-full flex items-center rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500 ring-2 ring-white/20" />
                  <div className="ml-3 overflow-hidden opacity-0 transition-all duration-300 ease-out max-w-0 group-hover/sidebar:max-w-[200px] group-hover/sidebar:opacity-100 text-left">
                    <p className="truncate text-sm font-medium">{user?.email?.split('@')[0]}</p>
                    <p className="truncate text-xs text-slate-400">{user?.email}</p>
                  </div>
                  <ChevronDown className="ml-auto hidden h-4 w-4 text-slate-400 group-hover/sidebar:block" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute bottom-full mb-2 w-full rounded-xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl">
                    <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                      <User className="h-4 w-4" /> Perfil
                    </button>
                    <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/5">
                      <Settings className="h-4 w-4" /> Configuración
                    </button>
                    <hr className="my-2 border-white/10" />
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10"
                    >
                      <LogOut className="h-4 w-4" /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <section className="flex w-full flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-3 lg:px-8">
              {/* Menu mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5"
              >
                <MenuIcon className="h-5 w-5 text-slate-200" />
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 lg:hidden">
                  <IconLogo className="h-5 w-5" />
                </div>
                <div className="hidden text-sm text-slate-400 sm:block">Panel de control</div>
                <div className="mx-1 hidden h-4 w-px bg-white/10 sm:block" />
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 shadow-inner shadow-black/40">
                  <ActiveIcon className="h-4 w-4 text-cyan-300" />
                  <span className="text-sm font-medium tracking-tight">
                    {PAGES.find(p => p.key === page)?.label}
                  </span>
                </div>
              </div>

              {/* Acciones */}
              <div className="ml-auto flex items-center gap-3">
                <input
                  placeholder="Buscar... (⌘K)"
                  className="hidden sm:block w-64 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:bg-white/10"
                />
                <button
                  onClick={() => setPage('criar')}
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-cyan-200 ring-1 ring-inset ring-cyan-400/30 hover:bg-white/15"
                >
                  Nueva encuesta
                </button>
              </div>
            </div>

            {/* Menu mobile */}
            {mobileMenuOpen && (
              <div className="lg:hidden absolute left-0 top-14 z-20 mx-4 w-[calc(100%-2rem)] rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl">
                {PAGES.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setPage(key);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left hover:bg-white/5 ${
                      page === key ? 'bg-white/10' : ''
                    }`}
                  >
                    <Icon className="h-5 w-5 text-cyan-300" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            )}
          </header>

          {/* Contenido de la página */}
          <main className="relative mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-10">
            <PageContent page={page} user={user} />
          </main>

          {/* Footer */}
          <footer className="border-t border-white/10 bg-slate-950/70 px-6 py-3 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} DeepCX — Sistema de encuestas de satisfacción
          </footer>
        </section>
      </div>
    </div>
  );
}

// Componente de contenido de página
function PageContent({ page, user }: { page: PageKey; user: any }) {
  const content = {
    dashboard: <DashboardContent user={user} />,
    criar: <CreateSurveyContent />,
    agrupamentos: <GroupsContent />,
    respostas: <ResponsesContent />,
    pesquisas: <SurveysContent />,
  };

  return content[page] || null;
}

// Contenido del Dashboard
function DashboardContent({ user }: { user: any }) {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Bienvenido, {user?.email?.split('@')[0]}
        </h1>
        <p className="text-slate-400 mt-1">
          Aquí está el resumen de tus métricas de satisfacción
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard 
          title="NPS Actual" 
          value="+42" 
          change="+3.2%" 
          positive={true}
        />
        <MetricCard 
          title="CSAT Promedio" 
          value="4.6★" 
          change="+0.3" 
          positive={true}
        />
        <MetricCard 
          title="Respuestas Hoy" 
          value="128" 
          change="+15%" 
          positive={true}
        />
        <MetricCard 
          title="Tasa de Respuesta" 
          value="68%" 
          change="-2%" 
          positive={false}
        />
      </div>

      {/* Gráficos y tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Tendencia NPS (30 días)</h2>
          <div className="h-64 flex items-center justify-center text-slate-500">
            [Gráfico de líneas aquí]
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Respuestas por Tienda</h2>
          <div className="space-y-3">
            <StoreRow name="Palermo" responses={45} nps={55} />
            <StoreRow name="Recoleta" responses={38} nps={48} />
            <StoreRow name="Belgrano" responses={29} nps={62} />
            <StoreRow name="Caballito" responses={16} nps={35} />
          </div>
        </div>
      </div>
    </>
  );
}

// Otros contenidos básicos
function CreateSurveyContent() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Crear Nueva Encuesta
      </h1>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-slate-400">
          El constructor de encuestas estará disponible pronto
        </p>
      </div>
    </div>
  );
}

function GroupsContent() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Agrupamientos
      </h1>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-slate-400">
          Organiza tus encuestas por tienda, región o campaña
        </p>
      </div>
    </div>
  );
}

function ResponsesContent() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Respuestas Recientes
      </h1>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-slate-400">
          Las respuestas de tus clientes aparecerán aquí
        </p>
      </div>
    </div>
  );
}

function SurveysContent() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Mis Encuestas
      </h1>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-slate-400">
          No tienes encuestas activas. Crea tu primera encuesta para comenzar.
        </p>
      </div>
    </div>
  );
}

// Componentes auxiliares
function MetricCard({ title, value, change, positive }: any) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-slate-400 mb-1">{title}</div>
      <div className="text-2xl font-semibold mb-2">{value}</div>
      <div className={`text-sm ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {positive ? '▲' : '▼'} {change}
      </div>
    </div>
  );
}

function StoreRow({ name, responses, nps }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5">
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-xs text-slate-400">{responses} respuestas</div>
      </div>
      <div className="text-right">
        <div className="font-semibold">+{nps}</div>
        <div className="text-xs text-emerald-400">NPS</div>
      </div>
    </div>
  );
}

function GridPattern() {
  return (
    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeOpacity="0.06" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

function IconLogo({ className = "h-6 w-6" }: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M12 3l3.5 6H8.5L12 3Z" />
      <path d="M12 21l-3.5-6h7L12 21Z" />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  );
}