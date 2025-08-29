// Archivo: lib/types/survey.ts
// Tipos y utilidades para el sistema de encuestas DeepCX

export type SurveyMethod = 'NPS' | 'CSAT' | 'STARS';
export type SurveyStatus = 'draft' | 'active' | 'paused' | 'archived';
export type CampaignType = 'qr' | 'link' | 'email' | 'whatsapp';
export type AttributeRating = 1 | 2 | 3; // 1=malo, 2=ok, 3=excelente

// Interfaces de base de datos
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  primary_color: string;
  created_at: string;
  updated_at: string;
  settings?: Record<string, any>;
}

export interface Store {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  address?: string;
  city: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Survey {
  id: string;
  organization_id?: string;
  survey_code: string;
  title: string;
  method: SurveyMethod;
  main_question: string;
  comment_label: string;
  show_logo: boolean;
  logo_url?: string;
  primary_color: string;
  status: SurveyStatus;
  created_by?: string;
  created_at: string;
  updated_at: string;
  settings?: Record<string, any>;
}

export interface SurveyInstance {
  id: string;
  survey_id: string;
  instance_code: string;
  store_id?: string;
  name?: string;
  campaign_type?: CampaignType;
  qr_location?: string;
  is_active: boolean;
  created_at: string;
  expires_at?: string;
  metadata?: Record<string, any>;
}

export interface Attribute {
  id: string;
  organization_id?: string;
  code: string;
  label: string;
  is_system: boolean;
  created_at: string;
}

export interface SurveyAttribute {
  id: string;
  survey_id: string;
  attribute_id: string;
  position: number;
  is_required: boolean;
  attribute?: Attribute; // Joined data
}

export interface Response {
  id: string;
  survey_id: string;
  instance_id?: string;
  store_id?: string;
  
  // Scores según método
  nps_score?: number;
  csat_score?: number;
  stars_score?: number;
  
  // Comentario y contacto
  comment?: string;
  wants_contact: boolean;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  
  // Metadata
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AttributeRatingRecord {
  id: string;
  response_id: string;
  attribute_id: string;
  rating: AttributeRating;
}

// Tipos para vistas y métricas
export interface NPSMetrics {
  survey_id: string;
  total_responses: number;
  promoters: number;
  passives: number;
  detractors: number;
  nps_score: number;
}

export interface CSATMetrics {
  survey_id: string;
  total_responses: number;
  avg_csat: number;
  satisfied_count: number;
  satisfaction_rate: number;
}

// Tipos para formularios
export interface SurveyFormData {
  title: string;
  method: SurveyMethod;
  main_question: string;
  comment_label: string;
  show_logo: boolean;
  logo_url?: string;
  primary_color: string;
  attributes: string[]; // IDs de atributos seleccionados
}

export interface ResponseFormData {
  survey_code: string;
  instance_code?: string;
  
  // Score (solo uno)
  score?: number;
  
  // Atributos
  attribute_ratings?: Record<string, AttributeRating>;
  
  // Comentario
  comment?: string;
  
  // Contacto
  wants_contact: boolean;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
}

// Utilidades
export class SurveyUtils {
  // Generar código único para encuesta
  static generateSurveyCode(prefix = 'S'): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix;
    for (let i = 0; i < 7; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Generar código de instancia
  static generateInstanceCode(prefix = 'I'): string {
    return this.generateSurveyCode(prefix);
  }

  // Calcular NPS
  static calculateNPS(scores: number[]): number {
    if (scores.length === 0) return 0;
    
    const promoters = scores.filter(s => s >= 9).length;
    const detractors = scores.filter(s => s <= 6).length;
    
    return Math.round(((promoters - detractors) / scores.length) * 100);
  }

  // Calcular CSAT promedio
  static calculateCSAT(scores: number[]): number {
    if (scores.length === 0) return 0;
    
    const sum = scores.reduce((acc, curr) => acc + curr, 0);
    return Number((sum / scores.length).toFixed(2));
  }

  // Calcular tasa de satisfacción
  static calculateSatisfactionRate(scores: number[]): number {
    if (scores.length === 0) return 0;
    
    const satisfied = scores.filter(s => s >= 4).length;
    return Math.round((satisfied / scores.length) * 100);
  }

  // Formatear fecha para UI
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  // Validar email
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar teléfono argentino
  static isValidPhoneAR(phone: string): boolean {
    // Acepta formatos: +54 11 1234-5678, 011 1234-5678, 11 1234 5678, etc.
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 13;
  }
}

// Constantes
export const DEFAULT_PRIMARY_COLOR = '#4F46E5';

export const SURVEY_METHOD_LABELS = {
  NPS: 'Net Promoter Score',
  CSAT: 'Customer Satisfaction',
  STARS: 'Valoración con estrellas'
};

export const NPS_LABELS = {
  detractor: 'Detractor',
  passive: 'Pasivo',
  promoter: 'Promotor'
};

export const CSAT_LABELS = [
  'Muy insatisfecho/a',
  'Insatisfecho/a',
  'Neutro',
  'Satisfecho/a',
  'Muy satisfecho/a'
];

export const ATTRIBUTE_EMOJI_MAP: Record<AttributeRating, string> = {
  1: '😞',
  2: '😐',
  3: '😊'
};

export const SYSTEM_ATTRIBUTES = [
  { code: 'service', label: 'Atención' },
  { code: 'price', label: 'Precio' },
  { code: 'wait_time', label: 'Tiempo de espera' },
  { code: 'quality', label: 'Calidad del producto' },
  { code: 'cleanliness', label: 'Limpieza' },
  { code: 'environment', label: 'Ambiente de la tienda' },
  { code: 'payment', label: 'Facilidad de pago' },
  { code: 'availability', label: 'Disponibilidad de productos' },
  { code: 'post_sale', label: 'Soporte posventa' }
];

// Helpers para colores
export function normalizeHexColor(input: string, fallback = DEFAULT_PRIMARY_COLOR): string {
  if (!input) return fallback;
  let hex = input.trim().toLowerCase();
  if (!hex.startsWith('#')) hex = '#' + hex;
  hex = hex.replace(/[^#0-9a-f]/g, '');
  
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(hex)) return fallback;
  
  if (hex.length === 4) {
    // #abc -> #aabbcc
    const [_, r, g, b] = hex.split('');
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  
  return hex;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = normalizeHexColor(hex);
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return { r, g, b };
}

export function getContrastColor(hexBg: string): string {
  const { r, g, b } = hexToRgb(hexBg);
  // Calcular luminancia relativa
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 160 ? '#111111' : '#ffffff';
}