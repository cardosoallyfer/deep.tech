'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

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
  const supabase = createClient();
  
  // Estados básicos
  const [title, setTitle] = useState('Satisfacción de la Tienda — Palermo');
  const [method, setMethod] = useState<'NPS' | 'CSAT' | 'STARS'>('NPS');
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
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
        .single();

      if (surveyError) throw surveyError;

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
        .eq('is_system', true);

      if (attrError) throw attrError;

      // Relacionar atributos con la encuesta
      if (systemAttrs && systemAttrs.length > 0) {
        const surveyAttrs = systemAttrs.map((attr, index) => ({
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
          filled ? 'fill-yellow-400' : 'fill-neutral-300 dark:fill-neutral-700'
        }`}
        onClick={onClick}
      >
        <path d="M12 .587l3.668 7.429 8.2 1.193-5.934 5.788 1.402 8.168L12 18.896l-7.336 3.869 1.402-8.168L.132 9.209l8.2-1.193L12 .587z" />
      </svg>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        {/* Encabezado */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Crear encuesta</h1>
            <p className="text-sm opacity-70 mt-1">Configura tu encuesta de satisfacción</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/admin/surveys')}
              className="h-10 px-4 rounded-xl font-medium border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 shadow-sm"
            >
              Cancelar
            </button>
            <button
              onClick={() => setView(toggleViewPure(view))}
              className="h-10 px-4 rounded-xl font-medium border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 shadow-sm"
            >
              {view === 'edit' ? 'Ver vista previa' : 'Volver a edición'}
            </button>
          </div>
        </header>

        {/* Alertas */}
        {error && (
          <div className="mb-4 p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
            {success}
          </div>
        )}

        {view === 'edit' ? (
          // ====== EDITOR ======
          <section className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/60 backdrop-blur p-5 shadow-sm">
            <div className="space-y-6">
              {/* TÍTULO */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Título de la encuesta</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej.: Satisfacción de la tienda — Recoleta"
                  className="w-full h-11 px-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* METODOLOGÍA + Pregunta principal */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Metodología</label>
                <div className="flex gap-2 flex-wrap">
                  <MethodToggle value="NPS" label="NPS (0–10)" />
                  <MethodToggle value="CSAT" label="CSAT (1–5)" />
                  <MethodToggle value="STARS" label="Estrellas (★ 1–5)" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-neutral-500">Texto de la pregunta principal</label>
                  <input
                    value={mainQuestion}
                    onChange={(e) => {
                      setMainQuestion(e.target.value);
                      if (!mainDirty) setMainDirty(true);
                    }}
                    placeholder={DEFAULT_MAIN_BY_METHOD[method]}
                    className="w-full h-11 px-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Apariencia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color primario</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={normalizedPrimary}
                      onChange={(e) => setPrimaryHex(e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded"
                    />
                    <input
                      value={primaryHex}
                      onChange={(e) => setPrimaryHex(e.target.value)}
                      placeholder="#4F46E5"
                      className="flex-1 h-10 px-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Logo (opcional)</label>
                  <div className="flex gap-2">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={showLogo} onChange={(e) => setShowLogo(e.target.checked)} />
                      Mostrar
                    </label>
                    <input
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="URL del logo"
                      disabled={!showLogo}
                      className="flex-1 h-10 px-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Campo abierto */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Texto del campo de comentario</label>
                <input
                  value={commentLabel}
                  onChange={(e) => setCommentLabel(e.target.value)}
                  placeholder="Ej.: Deja un comentario (opcional)"
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
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-800'
                                : 'bg-white dark:bg-neutral-900 border-neutral-200/70 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <input 
                              type="checkbox" 
                              checked={checked}
                              onChange={() => (!disabled || checked) ? toggleSelectAttr(a.id) : null}
                              disabled={disabled}
                            />
                            <span>{a.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </details>
              </div>

              {/* ACCIONES */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !title.trim()}
                  className="h-11 px-6 rounded-xl font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={(!isSaving && title.trim()) ? primaryStyle : undefined}
                >
                  {isSaving ? 'Guardando...' : 'Guardar encuesta'}
                </button>
                <button
                  onClick={resetPreview}
                  className="h-11 px-4 rounded-xl font-medium border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  Limpiar vista previa
                </button>
              </div>
            </div>
          </section>
        ) : (
          // ====== VISTA PREVIA ======
          <section className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/60 backdrop-blur p-5 shadow-sm">
            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm">
                {/* Encabezado de la encuesta */}
                <div className="mb-4 flex items-center gap-3">
                  {showLogo && logoUrl && (
                    <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-xl object-cover border border-neutral-200 dark:border-neutral-800" />
                  )}
                  <h3 className="text-base font-semibold">{title || 'Título de la encuesta'}</h3>
                </div>

                {/* Pregunta principal */}
                <div className="space-y-2">
                  <p className="text-sm">{mainQuestion || DEFAULT_MAIN_BY_METHOD[method]}</p>

                  {method === 'NPS' && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {Array.from({ length: 11 }, (_, i) => i).map((i) => (
                          <Pill key={i} active={nps === i} onClick={() => setNps(i)}>
                            {i}
                          </Pill>
                        ))}
                      </div>
                      <div className="flex justify-between text-[11px] text-neutral-500">
                        <span>No recomendaría</span>
                        <span>Recomendaría mucho</span>
                      </div>
                    </div>
                  )}

                  {method === 'CSAT' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
                          <Pill key={i} active={csat === i} onClick={() => setCsat(i)}>
                            {i}
                          </Pill>
                        ))}
                      </div>
                      <div className="flex justify-between text-[11px] text-neutral-500">
                        {csatLabels.map((l) => (
                          <span key={l} className="text-center flex-1">{l}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {method === 'STARS' && (
                    <div className="flex items-center justify-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
                        <Star key={i} filled={i <= stars} onClick={() => setStars(i)} />
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
                                    ? 'bg-emerald-100 border-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-800' 
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

                {/* Campo de comentario */}
                <div className="mt-5 space-y-2">
                  <label className="text-sm font-medium">{commentLabel || 'Comentario'}</label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                    placeholder="Escribe aquí..."
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                {/* Acciones */}
                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                  <button
                    onClick={() => setWantsContact(!wantsContact)}
                    className="h-12 px-5 rounded-xl font-semibold border-2 transition bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    {wantsContact ? '✓ Quiero que me contacten' : 'Quiero que me contacten'}
                  </button>
                  <button
                    className="h-12 px-5 rounded-xl font-semibold shadow hover:brightness-110"
                    style={primaryStyle}
                  >
                    Enviar respuesta
                  </button>
                </div>

                {/* Campos de contacto */}
                {wantsContact && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Nombre"
                      className="h-11 px-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                    />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Email"
                      className="h-11 px-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                    />
                    <input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Teléfono"
                      className="h-11 px-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}