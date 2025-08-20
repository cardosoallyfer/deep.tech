'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          typeof window !== 'undefined' ? `${window.location.origin}/admin` : undefined,
      },
    });
    if (error) setErr(error.message); else setSent(true);
  }

  return (
    <main style={{ maxWidth: 420, margin: '64px auto', padding: 24 }}>
      <h1>Iniciar sesión</h1>
      <p style={{ color:'#666' }}>Te enviaremos un enlace mágico por email.</p>
      <form onSubmit={send} style={{ display:'grid', gap:12, marginTop:16 }}>
        <input type="email" required placeholder="tu@correo.com"
          value={email} onChange={e=>setEmail(e.target.value)}
          style={{ padding:10, borderRadius:8, border:'1px solid #ccc' }} />
        <button type="submit" style={{ padding:'10px 16px', borderRadius:8, cursor:'pointer' }}>
          Enviar enlace
        </button>
      </form>
      {sent && <p style={{ marginTop:12, color:'green' }}>¡Listo! Revisa tu email.</p>}
      {err && <p style={{ marginTop:12, color:'crimson' }}>{err}</p>}
    </main>
  );
}
