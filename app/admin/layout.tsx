'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        setUserEmail(user.email);
      }
    };
    checkUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top Navigation */}
      <nav className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <a href="/admin/dashboard" className="flex items-center gap-2">
                <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl">
                  <span className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-rose-500 blur-[8px] opacity-40" />
                  <span className="relative z-10 h-6 w-6 rounded-lg bg-white/80" />
                </span>
                <span className="text-sm font-semibold">DeepCX</span>
              </a>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-6">
                <a href="/admin/dashboard" className="text-sm text-zinc-600 hover:text-zinc-900">
                  Dashboard
                </a>
                <a href="/admin/surveys" className="text-sm text-zinc-600 hover:text-zinc-900">
                  Encuestas
                </a>
                <a href="/admin/surveys/new" className="text-sm text-zinc-600 hover:text-zinc-900">
                  Nueva Encuesta
                </a>
                <a href="/admin/reports" className="text-sm text-zinc-600 hover:text-zinc-900">
                  Reportes
                </a>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {userEmail && (
                <span className="text-sm text-zinc-500">{userEmail}</span>
              )}
              <button
                onClick={handleLogout}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}