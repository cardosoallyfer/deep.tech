import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    // OAuth code exchange
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Redireciona para dashboard ou URL especificada
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  if (token_hash && type) {
    // Magic link verification
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (!error) {
      // Força redirecionamento para dashboard após magic link
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
    }
  }

  // Se houver erro ou nenhum código/token, redireciona para login
  return NextResponse.redirect(new URL('/login', requestUrl.origin));
}