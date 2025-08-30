'use client';

import React from 'react';
import { BarChart3, TrendingUp, PieChart, FileText, Download, Calendar } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Reportes</h1>
        <p className="mt-1 text-zinc-600">
          Análisis detallado y métricas de tus encuestas
        </p>
      </div>

      {/* Period Selector */}
      <div className="mb-6 flex gap-3">
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">
          Últimos 7 días
        </button>
        <button className="px-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm hover:bg-zinc-50">
          Últimos 30 días
        </button>
        <button className="px-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm hover:bg-zinc-50">
          Últimos 3 meses
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm hover:bg-zinc-50">
          <Calendar className="h-4 w-4" />
          Personalizado
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 mb-8 lg:grid-cols-2">
        {/* NPS Evolution */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-900">Evolución del NPS</h3>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="h-64 flex items-center justify-center bg-zinc-50 rounded-lg">
            <BarChart3 className="h-16 w-16 text-zinc-300" />
          </div>
        </div>

        {/* Response Distribution */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-900">Distribución de Respuestas</h3>
            <PieChart className="h-5 w-5 text-purple-600" />
          </div>
          <div className="h-64 flex items-center justify-center bg-zinc-50 rounded-lg">
            <PieChart className="h-16 w-16 text-zinc-300" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Promotores</p>
              <p className="text-2xl font-semibold mt-1 text-emerald-600">0%</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center">
              <span className="text-xl">😊</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Neutros</p>
              <p className="text-2xl font-semibold mt-1 text-amber-600">0%</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-amber-50 flex items-center justify-center">
              <span className="text-xl">😐</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Detractores</p>
              <p className="text-2xl font-semibold mt-1 text-red-600">0%</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-red-50 flex items-center justify-center">
              <span className="text-xl">😔</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-8 flex justify-center">
        <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
          <Download className="h-5 w-5" />
          Exportar Reporte Completo
        </button>
      </div>
    </div>
  );
}