'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const [stats, setStats] = useState({
    totalSurveys: 0,
    totalResponses: 0,
    averageNPS: 0,
    activeInstances: 0,
  });

  useEffect(() => {
    // Aqui você carregaria as estatísticas reais do banco
    // Por enquanto, vamos simular alguns dados
    setStats({
      totalSurveys: 3,
      totalResponses: 127,
      averageNPS: 72,
      activeInstances: 5,
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Resumen de tus encuestas y métricas principales
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Encuestas Totales"
          value={stats.totalSurveys}
          description="Encuestas creadas"
          icon="📋"
        />
        <StatCard
          title="Respuestas"
          value={stats.totalResponses}
          description="Total de respuestas"
          icon="💬"
        />
        <StatCard
          title="NPS Promedio"
          value={stats.averageNPS}
          description="Net Promoter Score"
          icon="📊"
          suffix="%"
        />
        <StatCard
          title="QR Activos"
          value={stats.activeInstances}
          description="Códigos QR en uso"
          icon="📱"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/surveys/new"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            ➕ Nueva Encuesta
          </a>
          <a
            href="/admin/reports"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            📈 Ver Reportes
          </a>
          <a
            href="/admin/surveys"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            📝 Gestionar Encuestas
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Actividad Reciente</h2>
        <div className="space-y-3">
          <ActivityItem
            title="Nueva respuesta en 'Encuesta Sucursal Centro'"
            time="Hace 5 minutos"
            score="NPS: 9"
          />
          <ActivityItem
            title="Nueva respuesta en 'Encuesta Sucursal Norte'"
            time="Hace 12 minutos"
            score="NPS: 10"
          />
          <ActivityItem
            title="Nueva respuesta en 'Encuesta Sucursal Centro'"
            time="Hace 25 minutos"
            score="NPS: 7"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  description, 
  icon,
  suffix = '' 
}: { 
  title: string;
  value: number;
  description: string;
  icon: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {value}{suffix}
          </p>
          <p className="mt-1 text-xs text-zinc-500">{description}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}

function ActivityItem({ 
  title, 
  time, 
  score 
}: { 
  title: string;
  time: string;
  score: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0">
      <div>
        <p className="text-sm font-medium text-zinc-900">{title}</p>
        <p className="text-xs text-zinc-500">{time}</p>
      </div>
      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
        {score}
      </span>
    </div>
  );
}