import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/admin/dashboard';

  if (code) {
    const supabase = createClientComponentClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL para redirecionar após o login
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}   