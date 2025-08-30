'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText,
  Users,
  BarChart,
  TrendingUp,
  Activity,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export default function DashboardPage() {
  // Datos de ejemplo - después conectaremos con Supabase
  const stats = {
    totalSurveys: 0,
    totalResponses: 0,
    averageNPS: 0,
    responseRate: 0,
    todayResponses: 0,
    weekGrowth: 0
  };

  const recentActivity = [
    // Aquí irán las respuestas recientes
  ];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-1 text-zinc-600">
          Aquí está el resumen de tus encuestas y métricas
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex gap-4">
        <Link
          href="/admin/surveys/new"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-blue-800 transition-all"
        >
          <FileText className="h-4 w-4" />
          Crear Nueva Encuesta
        </Link>
        <Link
          href="/admin/surveys"
          className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          Ver Todas las Encuestas
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Total Encuestas</p>
              <p className="text-2xl font-semibold mt-1">{stats.totalSurveys}</p>
              <p className="text-xs text-zinc-500 mt-1">Activas</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Respuestas Totales</p>
              <p className="text-2xl font-semibold mt-1">{stats.totalResponses}</p>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{stats.weekGrowth}% esta semana
              </p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">NPS Promedio</p>
              <p className="text-2xl font-semibold mt-1">
                {stats.averageNPS > 0 ? `+${stats.averageNPS}` : stats.averageNPS || '-'}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Último mes</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-3">
              <BarChart className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Respuestas Hoy</p>
              <p className="text-2xl font-semibold mt-1">{stats.todayResponses}</p>
              <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                En tiempo real
              </p>
            </div>
            <div className="rounded-lg bg-orange-50 p-3">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 p-6">
              <h2 className="font-semibold text-zinc-900">Actividad Reciente</h2>
            </div>
            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {/* Aquí irán las actividades recientes */}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="mx-auto h-12 w-12 text-zinc-300" />
                  <p className="mt-4 text-sm text-zinc-600">
                    No hay actividad reciente
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Las respuestas aparecerán aquí en tiempo real
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Encuestas Activas */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="font-semibold text-zinc-900 mb-4">Encuestas Activas</h3>
            {stats.totalSurveys === 0 ? (
              <div className="text-center py-4">
                <FileText className="mx-auto h-10 w-10 text-zinc-300" />
                <p className="mt-3 text-sm text-zinc-600">
                  Sin encuestas activas
                </p>
                <Link
                  href="/admin/surveys/new"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Crear primera encuesta
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Lista de encuestas activas */}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              💡 Consejo del día
            </h3>
            <p className="text-sm text-blue-700">
              Las encuestas con menos de 5 preguntas tienen una tasa de respuesta 40% mayor. 
              Mantén tus encuestas cortas y directas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}