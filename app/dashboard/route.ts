import { redirect } from 'next/navigation';

export async function GET() {
  // Redireciona /dashboard para /admin/dashboard
  redirect('/admin/dashboard');
}