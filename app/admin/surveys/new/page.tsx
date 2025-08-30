'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Eye, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function NewSurveyPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  // ... (mantener todo el estado anterior del componente)
  const [title, setTitle] = useState('');
  const [method, setMethod] = useState<'NPS' | 'CSAT' | 'STARS'>('NPS');
  const [mainQuestion, setMainQuestion] = useState('¿Qué tan probable es que nos recomiendes a un amigo o colega?');
  const [attributes, setAttributes] = useState<string[]>([]);
  const [newAttribute, setNewAttribute] = useState('');
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState('¡Gracias por tu respuesta!');
  const [contactEnabled, setContactEnabled] = useState(false);
  const [contactTitle, setContactTitle] = useState('¿Te gustaría que te contactemos?');
  const [showLogo, setShowLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para preview
  const [nps, setNps] = useState(-1);
  const [csat, setCsat] = useState(-1);
  const [stars, setStars] = useState(0);

  const primaryStyle = {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
    color: '#FFFFFF'
  };

  const handleAddAttribute = () => {
    if (newAttribute.trim() && attributes.length < 5) {
      setAttributes([...attributes, newAttribute.trim()]);
      setNewAttribute('');
    }
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    
    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    
    if (!mainQuestion.trim()) {
      setError('La pregunta principal es obligatoria');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Aquí conectaremos con Supabase
      const surveyCode = `SURV-${Date.now().toString(36).toUpperCase()}`;
      
      // Simulamos guardado
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(`✅ Encuesta guardada exitosamente. Código: ${surveyCode}`);
      
      // Redirigir a la lista de encuestas después de 2 segundos
      setTimeout(() => {
        router.push('/admin/surveys');
      }, 2000);
      
    } catch (err) {
      console.error('Error al guardar:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar la encuesta');
    } finally {
      setIsSaving(false);
    }
  };

  // Subcomponentes (mantener los anteriores)
  function MethodToggle({ value, label }: { value: 'NPS' | 'CSAT' | 'STARS'; label: string }) {
    const active = method === value;
    return (
      <button
        onClick={() => setMethod(value)}
        className={`px-3 py-2 rounded-xl text-sm font-medium transition shadow-sm border ${
          active
            ? ''
            : 'bg-white/5 dark:bg-neutral-900 border-neutral-200/70 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
        }`}
        style={active ? primaryStyle : undefined}
      >
        {label}
      </button>
    );
  }

  function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className={`min-w-8 h-9 px-3 rounded-full text-sm font-medium border transition select-none ${
          active ? '' : 'bg-white dark:bg-neutral-900 border-neutral-200/70 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
        }`}
        style={active ? primaryStyle : undefined}
      >
        {children}
      </button>
    );
  }

  function Star({ filled, onClick }: { filled: boolean; onClick: () => void }) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`w-8 h-8 cursor-pointer drop-shadow-sm ${
          filled ? 'text-yellow-400 fill-current' : 'text-neutral-300 dark:text-neutral-700 fill-current'
        }`}
        onClick={onClick}
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );
  }

  // Vista de preview (mantener igual)
  if (view === 'preview') {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header de preview */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Vista previa</h1>
            <button
              onClick={() => setView('edit')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <ChevronLeft className="h-4 w-4" />
              Volver al editor
            </button>
          </div>

          {/* Preview Card (mantener igual al original) */}
          <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg p-8 space-y-6">
            {/* Contenido del preview igual al original */}
            {showLogo && logoUrl && (
              <div className="flex justify-center">
                <img src={logoUrl} alt="Logo" className="h-16 object-contain" />
              </div>
            )}
            
            <h2 className="text-xl font-semibold text-center">{title}</h2>
            
            {/* Resto del preview... */}
          </div>
        </div>
      </div>
    );
  }

  // Vista de edición
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header con navegación */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/admin/surveys"
              className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
            >
              <ChevronLeft className="h-4 w-4" />
              Volver a encuestas
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Crear nueva encuesta</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Configura los parámetros de tu encuesta de satisfacción
          </p>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {/* Card de configuración */}
          <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-6">
            <div className="space-y-6">
              {/* TÍTULO */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Título de la encuesta <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Satisfacción Tienda Centro"
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* MÉTODO */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Método de evaluación</label>
                <div className="flex gap-2">
                  <MethodToggle value="NPS" label="NPS (0-10)" />
                  <MethodToggle value="CSAT" label="CSAT (1-5)" />
                  <MethodToggle value="STARS" label="Estrellas" />
                </div>
              </div>

              {/* PREGUNTA PRINCIPAL */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Pregunta principal <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={mainQuestion}
                  onChange={(e) => setMainQuestion(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* ATRIBUTOS */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Atributos a evaluar (máx. 5)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAttribute}
                    onChange={(e) => setNewAttribute(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAttribute()}
                    placeholder="Ej: Atención al cliente"
                    className="flex-1 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={attributes.length >= 5}
                  />
                  <button
                    onClick={handleAddAttribute}
                    disabled={attributes.length >= 5 || !newAttribute.trim()}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Agregar
                  </button>
                </div>
                
                {attributes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {attributes.map((attr, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm"
                      >
                        {attr}
                        <button
                          onClick={() => handleRemoveAttribute(idx)}
                          className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* OPCIONES ADICIONALES */}
              <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                {/* Contacto */}
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={contactEnabled}
                    onChange={(e) => setContactEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300"
                  />
                  <span className="text-sm">Permitir que los usuarios soliciten ser contactados</span>
                </label>

                {/* Mensaje de agradecimiento */}
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={showThankYouMessage}
                    onChange={(e) => setShowThankYouMessage(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300"
                  />
                  <span className="text-sm">Mostrar mensaje de agradecimiento personalizado</span>
                </label>

                {/* Logo */}
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={showLogo}
                    onChange={(e) => setShowLogo(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300"
                  />
                  <span className="text-sm">Mostrar logo de la empresa</span>
                </label>
              </div>

              {/* COLOR PRIMARIO */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Color primario</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-20 rounded border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setView('preview')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium transition"
            >
              <Eye className="h-4 w-4" />
              Vista previa
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !title.trim() || !mainQuestion.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Guardando...' : 'Guardar encuesta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}