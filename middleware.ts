import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/', '/login', '/auth/callback'];
  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith('/auth/')
  );

  // Rotas protegidas
  const protectedRoutes = ['/dashboard', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Se a rota é protegida e não há sessão, redireciona para login
  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Se o usuário está logado e tenta acessar login ou raiz, redireciona para dashboard
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};