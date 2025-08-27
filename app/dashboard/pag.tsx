'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  LayoutDashboard, 
  FileText,
  Users,
  BarChart,
  Plus,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 mx-auto"></div>
          <p className="mt-4 text-sm text-zinc-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-zinc-200 lg:bg-white">
        <div className="flex h-16 items-center border-b border-zinc-200 px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-600 p-1.5">
              <div className="h-full w-full rounded bg-white" />
            </div>
            <span className="text-lg font-semibold">DeepCX</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          <button className="w-full flex items-center gap-3 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900">
            <FileText className="h-4 w-4" />
            Encuestas
          </button>
          <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900">
            <Users className="h-4 w-4" />
            Respuestas
          </button>
          <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900">
            <BarChart className="h-4 w-4" />
            Reportes
          </button>
        </nav>

        <div className="border-t border-zinc-200 p-4">
          <div className="mb-3 text-xs font-medium text-zinc-400">
            {user?.email}
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black transition-opacity ${sidebarOpen ? 'opacity-50' : 'opacity-0'}`} 
             onClick={() => setSidebarOpen(false)} />
        <aside className={`absolute left-0 top-0 h-full w-64 bg-white shadow-xl transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-600 p-1.5">
                <div className="h-full w-full rounded bg-white" />
              </div>
              <span className="text-lg font-semibold">DeepCX</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-1 p-4">
            <button className="w-full flex items-center gap-3 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
            <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600">
              <FileText className="h-4 w-4" />
              Encuestas
            </button>
            <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600">
              <Users className="h-4 w-4" />
              Respuestas
            </button>
            <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600">
              <BarChart className="h-4 w-4" />
              Reportes
            </button>
          </nav>

          <div className="border-t border-zinc-200 p-4">
            <div className="mb-3 text-xs font-medium text-zinc-400">
              {user?.email}
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-zinc-200 bg-white px-6">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Nueva Encuesta
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900">
              ¡Bienvenido, {user?.email?.split('@')[0]}!
            </h2>
            <p className="mt-1 text-zinc-600">
              Aquí está el resumen de tus encuestas y métricas
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600">Total Encuestas</p>
                  <p className="text-2xl font-semibold mt-1">0</p>
                </div>
                <FileText className="h-8 w-8 text-zinc-400" />
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600">Respuestas</p>
                  <p className="text-2xl font-semibold mt-1">0</p>
                </div>
                <Users className="h-8 w-8 text-zinc-400" />
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600">NPS Promedio</p>
                  <p className="text-2xl font-semibold mt-1">-</p>
                </div>
                <BarChart className="h-8 w-8 text-zinc-400" />
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600">Tasa Respuesta</p>
                  <p className="text-2xl font-semibold mt-1">0%</p>
                </div>
                <LayoutDashboard className="h-8 w-8 text-zinc-400" />
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-12">
            <div className="mx-auto max-w-md text-center">
              <FileText className="mx-auto h-12 w-12 text-zinc-400" />
              <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                No hay encuestas aún
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                Crea tu primera encuesta para empezar a recopilar respuestas de tus clientes
              </p>
              <button className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Crear Primera Encuesta
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
