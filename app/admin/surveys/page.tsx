'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Copy,
  Eye,
  Edit,
  Trash2,
  QrCode,
  ExternalLink,
  Users,
  BarChart,
  FileText
} from 'lucide-react';

interface Survey {
  id: string;
  title: string;
  code: string;
  method: 'NPS' | 'CSAT' | 'STARS';
  responses: number;
  active: boolean;
  created_at: string;
  instances: number;
}

export default function SurveysPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      // Por ahora usamos datos de ejemplo
      // Después conectaremos con Supabase
      const mockSurveys: Survey[] = [
        // Ejemplo de encuesta
        // {
        //   id: '1',
        //   title: 'Satisfacción Tienda Centro',
        //   code: 'SAT-001',
        //   method: 'NPS',
        //   responses: 245,
        //   active: true,
        //   created_at: '2024-01-15',
        //   instances: 3
        // }
      ];
      setSurveys(mockSurveys);
    } catch (error) {
      console.error('Error loading surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta encuesta?')) return;
    
    try {
      // Implementar eliminación con Supabase
      setSurveys(surveys.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting survey:', error);
    }
  };

  const handleDuplicate = async (survey: Survey) => {
    try {
      // Implementar duplicación
      router.push('/admin/surveys/new?duplicate=' + survey.id);
    } catch (error) {
      console.error('Error duplicating survey:', error);
    }
  };

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' ||
                         (filterActive === 'active' && survey.active) ||
                         (filterActive === 'inactive' && !survey.active);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 mx-auto"></div>
          <p className="mt-4 text-sm text-zinc-500">Cargando encuestas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Encuestas</h1>
        <p className="mt-1 text-zinc-600">
          Gestiona todas tus encuestas de satisfacción
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar encuestas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-400" />
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value as any)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </select>
          </div>
        </div>

        {/* New Survey Button */}
        <Link
          href="/admin/surveys/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nueva Encuesta
        </Link>
      </div>

      {/* Surveys List */}
      {filteredSurveys.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-12">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto h-12 w-12 rounded-lg bg-zinc-100 p-3">
              <FileText className="h-6 w-6 text-zinc-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-zinc-900">
              {searchTerm || filterActive !== 'all' 
                ? 'No se encontraron encuestas' 
                : 'No hay encuestas aún'}
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              {searchTerm || filterActive !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Crea tu primera encuesta para empezar a recopilar respuestas'}
            </p>
            {!searchTerm && filterActive === 'all' && (
              <Link
                href="/admin/surveys/new"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Crear Primera Encuesta
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Encuesta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Respuestas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Creada
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredSurveys.map((survey) => (
                  <tr key={survey.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-zinc-900">
                          {survey.title}
                        </div>
                        <div className="text-xs text-zinc-500 flex items-center gap-2 mt-1">
                          <span className="font-mono">{survey.code}</span>
                          {survey.instances > 1 && (
                            <span className="text-zinc-400">
                              • {survey.instances} instancias
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {survey.method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-zinc-900">
                        <Users className="h-4 w-4 text-zinc-400" />
                        {survey.responses}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {survey.active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Activa
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600">
                          Inactiva
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {new Date(survey.created_at).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/surveys/${survey.id}`)}
                          className="p-1.5 rounded hover:bg-zinc-100 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4 text-zinc-600" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/surveys/${survey.id}/edit`)}
                          className="p-1.5 rounded hover:bg-zinc-100 transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4 text-zinc-600" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/surveys/${survey.id}/qr`)}
                          className="p-1.5 rounded hover:bg-zinc-100 transition-colors"
                          title="Códigos QR"
                        >
                          <QrCode className="h-4 w-4 text-zinc-600" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(survey)}
                          className="p-1.5 rounded hover:bg-zinc-100 transition-colors"
                          title="Duplicar"
                        >
                          <Copy className="h-4 w-4 text-zinc-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(survey.id)}
                          className="p-1.5 rounded hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}