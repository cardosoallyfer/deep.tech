'use client';

import React from 'react';
import { MessageSquare, Filter, Download, Calendar } from 'lucide-react';

export default function ResponsesPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Respuestas</h1>
        <p className="mt-1 text-zinc-600">
          Visualiza y gestiona todas las respuestas recibidas
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm hover:bg-zinc-50">
            <Filter className="h-4 w-4" />
            Filtrar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm hover:bg-zinc-50">
            <Calendar className="h-4 w-4" />
            Fecha
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </div>

      {/* Empty State */}
      <div className="rounded-xl border border-zinc-200 bg-white p-12">
        <div className="mx-auto max-w-md text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-zinc-300" />
          <h3 className="mt-4 text-lg font-semibold text-zinc-900">
            No hay respuestas aún
          </h3>
          <p className="mt-2 text-sm text-zinc-600">
            Las respuestas de tus encuestas aparecerán aquí
          </p>
        </div>
      </div>
    </div>
  );
}