'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona imediatamente para o dashboard
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 mx-auto"></div>
        <p className="mt-4 text-sm text-zinc-500">Redirigiendo...</p>
      </div>
    </div>
  );
}