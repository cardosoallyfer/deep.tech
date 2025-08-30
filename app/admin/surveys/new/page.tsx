'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

// Importación condicional para evitar error en build
let createClient: any;
if (typeof window !== 'undefined') {
  createClient = require('@/lib/supabase/client').createClient;
}

// Tipo para los atributos del sistema
interface SystemAttribute {
  id: string;
  code: string;
}

// Tipo para Survey retornado por Supabase
interface Survey {
  id: string;
  survey_code: string;
  // otros campos según sea necesario
}

// ===== Helpers puras (testables) =====
function addAttrPure(prev: string[], id: string, limit = 5) {
  if (prev.includes(id) || prev.length >= limit) return prev;
  return [...prev, id];
}

function removeAttrPure(prev: string[], id: string) {
  return prev.filter((x) => x !== id);
}

function clampAttrRating(v: number) {
  if (Number.isNaN(v)) return 1;
  if (v < 1) return 1;
  if (v > 3) return 3;
  return v | 0;
}

function toggleViewPure(view: 'edit' | 'preview'): 'edit' | 'preview' {
  return view === 'edit' ? 'preview' : 'edit';
}

function normalizeHex(input: string, fallback = '#4F46E5') {
  if (!input) return fallback;
  let v = input.trim().toLowerCase();
  if (!v.startsWith('#')) v = '#' + v;
  const hex = v.replace(/[^#0-9a-f]/g, '');
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(hex)) return fallback;
  if (hex.length === 4) {
    const r = hex[1];
    const g = hex[2];
    const b = hex[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return hex;
}

function hexToRgb(hex: string) {
  const h = normalizeHex(hex);
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  return { r, g, b };
}

function preferredTextColor(hexBg: string) {
  const { r, g, b } = hexToRgb(hexBg);
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 160 ? '#111111' : '#ffffff';
}

function generateSurveyCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'S'; // Prefijo para surveys
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ===== Constantes del proyecto =====
const ATTR_LIBRARY = [
  { id: 'service', label: 'Atención' },
  { id: 'price', label: 'Precio' },
  { id: 'wait_time', label: 'Tiempo de espera' },
  { id: 'quality', label: 'Calidad del producto' },
  { id: 'cleanliness', label: 'Limpieza' },
  { id: 'environment', label: 'Ambiente de la tienda' },
  { id: 'payment', label: 'Facilidad de pago' },
  { id: 'availability', label: 'Disponibilidad de productos' },
  { id: 'post_sale', label: 'Soporte posventa' },
];

const DEFAULT_MAIN_BY_METHOD = {
  NPS: '¿Qué tan probable es que recomiendes nuestra tienda a un amigo?',
  CSAT: '¿Qué tan satisfecho/a estás con tu experiencia?',
  STARS: 'Valora tu experiencia general',
} as const;

export default function SurveyBuilderPage() {
  const router = useRouter();
  
  // Estados básicos
  const [title, setTitle] = useState('Satisfacción de la Tienda — Palermo');
  const [method, setMethod] = useState<'NPS' | 'CSAT' | 'STARS'>('NPS');
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [supabaseReady, setSupabaseReady] = useState(false);

  // Colores
  const [primaryHex, setPrimaryHex] = useState<string>('#4F46E5');
  const normalizedPrimary = normalizeHex(primaryHex);
  const primaryText = preferredTextColor(normalizedPrimary);
  const primaryStyle: React.CSSProperties = {
    backgroundColor: normalizedPrimary,
    borderColor: normalizedPrimary,
    color: primaryText,
  };

  // Textos
  const [mainQuestion, setMainQuestion] = useState<string>(DEFAULT_MAIN_BY_METHOD['NPS']);
  const [mainDirty, setMainDirty] = useState(false);
  const [commentLabel, setCommentLabel] = useState('Deja un comentario (opcional)');
  const [commentText, setCommentText] = useState('');

  // Logo
  const [showLogo, setShowLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  // Atributos
  const [attrQuery, setAttrQuery] = useState('');
  const [selectedAttrIds, setSelectedAttrIds] = useState<string[]>(['service', 'price', 'wait_time']);
  const [attrRatings, setAttrRatings] = useState<Record<string, number>>({});

  // Contacto
  const [wantsContact, setWantsContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Estados de la pregunta principal (preview)
  const [nps, setNps] = useState<number | null>(null);
  const [csat, setCsat] = useState<number | null>(null);
  const [stars, setStars] = useState<number>(0);

  // Etiquetas auxiliares
  const csatLabels = ['Muy insatisfecho/a', 'Insatisfecho/a', 'Neutro', 'Satisfecho/a', 'Muy satisfecho/a'];

  // Verificar si Supabase está disponible
  useEffect(() => {
    if (typeof window !== 'undefined' && createClient) {
      setSupabaseReady(true);
    }
  }, []);

  // Efectos
  useEffect(() => {
    if (!mainDirty) setMainQuestion(DEFAULT_MAIN_BY_METHOD[method]);
  }, [method, mainDirty]);

  // Filtros
  const filtered = useMemo(() => {
    const q = attrQuery.trim().toLowerCase();
    return ATTR_LIBRARY.filter((a) => a.label.toLowerCase().includes(q));
  }, [attrQuery]);

  const canAddMore = selectedAttrIds.length < 5;

  // Acciones
  function toggleSelectAttr(id: string) {
    setSelectedAttrIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((x) => x !== id);
        setAttrRatings((r) => {
          const { [id]: _drop, ...rest } = r;
          return rest;
        });
        return next;
      }
      if (!canAddMore) return prev;
      return [...prev, id];
    });
  }

  function setAttrRating(id: string, value: number) {
    setAttrRatings((r) => ({ ...r, [id]: clampAttrRating(value) }));
  }

  function resetPreview() {
    setNps(null);
    setCsat(null);
    setStars(0);
    setAttrRatings({});
    setWantsContact(false);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setCommentText('');
  }

  // Guardar encuesta
  async function handleSave() {
    if (!supabaseReady || !createClient) {
      setError('La conexión con la base de datos no está disponible. Por favor, verifica la configuración.');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();
      
      // Obtener el usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Debes iniciar sesión para crear una encuesta');
      }

      // Generar código único
      const surveyCode = generateSurveyCode();
      const instanceCode = 'DEFAULT';

      // Crear la encuesta
      const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .insert({
          survey_code: surveyCode,
          title,
          method,
          main_question: mainQuestion,
          comment_label: commentLabel,
          show_logo: showLogo,
          logo_url: logoUrl,
          primary_color: normalizedPrimary,
          status: 'active',
          created_by: user.id,
        })
        .select()
        .single() as { data: Survey | null, error: any };

      if (surveyError) throw surveyError;
      if (!survey) throw new Error('No se pudo crear la encuesta');

      // Crear instancia por defecto
      const { error: instanceError } = await supabase
        .from('survey_instances')
        .insert({
          survey_id: survey.id,
          instance_code: instanceCode,
          name: 'Instancia principal',
          campaign_type: 'link',
          is_active: true,
        });

      if (instanceError) throw instanceError;

      // Obtener IDs de atributos del sistema
      const { data: systemAttrs, error: attrError } = await supabase
        .from('attributes')
        .select('id, code')
        .in('code', selectedAttrIds)
        .eq('is_system', true) as { data: SystemAttribute[] | null, error: any };

      if (attrError) throw attrError;

      // Relacionar atributos con la encuesta (LÍNEA CORREGIDA)
      if (systemAttrs && systemAttrs.length > 0) {
        const surveyAttrs = systemAttrs.map((attr: SystemAttribute, index: number) => ({
          survey_id: survey.id,
          attribute_id: attr.id,
          position: index,
          is_required: false,
        }));

        const { error: relError } = await supabase
          .from('survey_attributes')
          .insert(surveyAttrs);

        if (relError) throw relError;
      }

      setSuccess(`¡Encuesta creada! Código: ${surveyCode}`);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push(`/admin/surveys/${surveyCode}`);
      }, 2000);
      
    } catch (err) {
      console.error('Error al guardar:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar la encuesta');
    } finally {
      setIsSaving(false);
    }
  }

  // Subcomponentes
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

  // ===== RENDER =====
  if (view === 'preview') {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        <div className="w-full max-w-2xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Vista previa</h1>
            <button
              onClick={() => setView('edit')}
              className="px-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              ← Volver al editor
            </button>
          </div>

          {/* Preview Card */}
          <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg p-8 space-y-6">
            {/* Logo */}
            {showLogo && logoUrl && (
              <div className="flex justify-center">
                <img src={logoUrl} alt="Logo" className="h-16 object-contain" />
              </div>
            )}

            {/* Título */}
            <h2 className="text-xl font-semibold text-center">{title}</h2>

            {/* Pregunta principal */}
            <div className="space-y-4">
              <p className="text-center font-medium">{mainQuestion}</p>

              {/* NPS */}
              {method === 'NPS' && (
                <div className="flex gap-1 justify-center">
                  {Array.from({ length: 11 }, (_, i) => (
                    <Pill key={i} active={nps === i} onClick={() => setNps(i)}>
                      {i}
                    </Pill>
                  ))}
                </div>
              )}

              {/* CSAT */}
              {method === 'CSAT' && (
                <div className="flex gap-1 justify-center flex-wrap">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <Pill key={v} active={csat === v} onClick={() => setCsat(v)}>
                      {v}
                    </Pill>
                  ))}
                </div>
              )}

              {/* Stars */}
              {method === 'STARS' && (
                <div className="flex gap-1 justify-center">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <Star key={v} filled={v <= stars} onClick={() => setStars(v)} />
                  ))}
                </div>
              )}
            </div>

            {/* Atributos */}
            {!!selectedAttrIds.length && (
              <div className="mt-5 space-y-3">
                <p className="text-sm font-medium">Evalúa estos aspectos (opcional)</p>
                <div className="space-y-2">
                  {selectedAttrIds.map((id) => {
                    const label = ATTR_LIBRARY.find((x) => x.id === id)?.label || id;
                    return (
                      <div key={id} className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 p-3">
                        <span className="text-sm">{label}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setAttrRating(id, 1)}
                            className={`h-9 px-3 rounded-full text-sm border transition ${
                              attrRatings[id] === 1 
                                ? 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-800' 
                                : 'bg-white dark:bg-neutral-900 border-neutral-200/70 dark:border-neutral-800'
                            }`}
                          >
                            😞
                          </button>
                          <button
                            onClick={() => setAttrRating(id, 2)}
                            className={`h-9 px-3 rounded-full text-sm border transition ${
                              attrRatings[id] === 2 
                                ? 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-800' 
                                : 'bg-white dark:bg-neutral-900 border-neutral-200/70 dark:border-neutral-800'
                            }`}
                          >
                            😐
                          </button>
                          <button
                            onClick={() => setAttrRating(id, 3)}
                            className={`h-9 px-3 rounded-full text-sm border transition ${
                              attrRatings[id] === 3 
                                ? 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-800' 
                                : 'bg-white dark:bg-neutral-900 border-neutral-200/70 dark:border-neutral-800'
                            }`}
                          >
                            😊
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Comentario */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{commentLabel}</label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escribe aquí..."
                className="w-full h-24 px-3 py-2 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 resize-none"
              />
            </div>

            {/* Contacto */}
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={wantsContact}
                  onChange={(e) => setWantsContact(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700"
                />
                <span className="text-sm">Quiero que me contacten</span>
              </label>

              {wantsContact && (
                <div className="space-y-3 pl-7">
                  <input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nombre"
                    className="w-full h-11 px-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                  />
                  <input
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    className="w-full h-11 px-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                  />
                  <input
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Teléfono (opcional)"
                    type="tel"
                    className="w-full h-11 px-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                  />
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={resetPreview}
                className="flex-1 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                Limpiar
              </button>
              <button
                className="flex-1 h-12 rounded-xl font-medium text-white shadow-sm"
                style={primaryStyle}
              >
                Enviar respuesta
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de edición
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Crear nueva encuesta</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Configura los parámetros de tu encuesta de satisfacción
          </p>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
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
                <label htmlFor="title" className="text-sm font-medium">
                  Título de la encuesta
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Satisfacción de la Tienda — Palermo"
                  className="w-full h-11 px-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* MÉTODO */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Tipo de pregunta principal</label>
                <div className="flex gap-2 flex-wrap">
                  <MethodToggle value="NPS" label="NPS (0-10)" />
                  <MethodToggle value="CSAT" label="CSAT (1-5)" />
                  <MethodToggle value="STARS" label="Estrellas (⭐)" />
                </div>
              </div>

              {/* PREGUNTA PRINCIPAL */}
              <div className="space-y-2">
                <label htmlFor="mainQuestion" className="text-sm font-medium">
                  Pregunta principal
                </label>
                <input
                  id="mainQuestion"
                  value={mainQuestion}
                  onChange={(e) => {
                    setMainQuestion(e.target.value);
                    setMainDirty(true);
                  }}
                  placeholder="Ej: ¿Qué tan satisfecho estás con tu experiencia?"
                  className="w-full h-11 px-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* COMENTARIO */}
              <div className="space-y-2">
                <label htmlFor="commentLabel" className="text-sm font-medium">
                  Etiqueta del comentario
                </label>
                <input
                  id="commentLabel"
                  value={commentLabel}
                  onChange={(e) => setCommentLabel(e.target.value)}
                  placeholder="Ej: Deja un comentario (opcional)"
                  className="w-full h-11 px-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* ATRIBUTOS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Atributos de evaluación</label>
                  <span className="text-xs text-neutral-500">{selectedAttrIds.length}/5</span>
                </div>

                {/* Chips seleccionados */}
                {!!selectedAttrIds.length && (
                  <div className="flex gap-2 flex-wrap">
                    {selectedAttrIds.map((id) => {
                      const label = ATTR_LIBRARY.find((x) => x.id === id)?.label || id;
                      return (
                        <span key={id} className="inline-flex items-center gap-2 px-3 h-9 rounded-full text-sm border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                          {label}
                          <button
                            onClick={() => toggleSelectAttr(id)}
                            className="w-6 h-6 grid place-items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Biblioteca */}
                <details className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 p-4">
                  <summary className="text-sm font-medium cursor-pointer">Gestionar atributos</summary>
                  <div className="mt-3 space-y-3">
                    <input
                      value={attrQuery}
                      onChange={(e) => setAttrQuery(e.target.value)}
                      placeholder="Buscar atributo..."
                      className="w-full h-11 px-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-auto">
                      {filtered.map((a) => {
                        const checked = selectedAttrIds.includes(a.id);
                        const disabled = !checked && !canAddMore;
                        return (
                          <label
                            key={a.id}
                            className={`flex items-center gap-2 rounded-xl border p-2 text-sm cursor-pointer transition ${
                              checked
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700'
                                : disabled
                                ? 'opacity-50 cursor-not-allowed bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800'
                                : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 border-neutral-200 dark:border-neutral-800'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={disabled}
                              onChange={() => toggleSelectAttr(a.id)}
                              className="w-4 h-4 rounded"
                            />
                            <span>{a.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </details>
              </div>

              {/* PERSONALIZACIÓN */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Personalización</label>
                <div className="space-y-3">
                  {/* Logo */}
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={showLogo}
                      onChange={(e) => setShowLogo(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">Mostrar logo</span>
                  </label>

                  {showLogo && (
                    <input
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="URL del logo (ej: https://ejemplo.com/logo.png)"
                      className="w-full h-11 px-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                    />
                  )}

                  {/* Color */}
                  <div className="flex items-center gap-3">
                    <label htmlFor="primaryColor" className="text-sm">Color principal:</label>
                    <input
                      id="primaryColor"
                      value={primaryHex}
                      onChange={(e) => setPrimaryHex(e.target.value)}
                      placeholder="#4F46E5"
                      className="w-32 h-11 px-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                    />
                    <div
                      className="w-11 h-11 rounded-xl border border-neutral-300 dark:border-neutral-700"
                      style={{ backgroundColor: normalizedPrimary }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setView('preview')}
              className="px-6 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Vista previa →
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !supabaseReady}
              className="px-6 py-3 rounded-xl font-medium text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={primaryStyle}
            >
              {isSaving ? 'Guardando...' : 'Guardar encuesta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}