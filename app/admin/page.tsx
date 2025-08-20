'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import Link from 'next/link';

export default function AdminHome() {
  const [email, setEmail] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) return <main style={{ padding:24 }}>Cargando…</main>;

  if (!email) {
    return (
      <main style={{ padding:24 }}>
        <h1>Necesitás iniciar sesión</h1>
        <Link href="/login">Ir al login</Link>
      </main>
    );
  }

  return (
    <main style={{ padding:24, display:'grid', gap:16 }}>
      <h1>Bienvenid@, {email}</h1>
      <div style={{ display:'flex', gap:12 }}>
        <Link href="/admin/surveys" style={{ padding:12, border:'1px solid #ccc', borderRadius:8 }}>
          Ver encuestas
        </Link>
        <Link href="/admin/surveys/new" style={{ padding:12, border:'1px solid #ccc', borderRadius:8 }}>
          Crear encuesta
        </Link>
      </div>
    </main>
  );
}
