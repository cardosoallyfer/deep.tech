// Arquivo: components/survey-form.tsx
// Localização: /components/survey-form.tsx
// Descrição: Componente de formulário interativo para pesquisas

'use client';

import { useState } from 'react';
import { SurveyWithAttributes, ResponseSubmission } from '@/types/database';

interface SurveyFormProps {
  surveyData: SurveyWithAttributes;
}

export default function SurveyForm({ surveyData }: SurveyFormProps) {
  const [mainScore, setMainScore] = useState<number | null>(null);
  const [attributeScores, setAttributeScores] = useState<Record<string, number>>({});
  const [wantsContact, setWantsContact] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const getScoreLabel = (type: string, score: number) => {
    if (type === 'NPS') {
      if (score <= 6) return 'Detractor';
      if (score <= 8) return 'Pasivo';
      return 'Promotor';
    }
    if (type === 'CSAT') {
      const labels = ['Muy Insatisfecho', 'Insatisfecho', 'Neutral', 'Satisfecho', 'Muy Satisfecho'];
      return labels[Math.min(Math.floor(score / 2), 4)];
    }
    return `${score} ${score === 1 ? 'estrella' : 'estrellas'}`;
  };

  const getMaxScore = () => {
    switch (surveyData.question_type) {
      case 'STARS': return 5;
      case 'CSAT': return 5;
      default: return 10;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mainScore === null) {
      setError('Por favor, selecciona una puntuación');
      return;
    }

    // Validar atributos requeridos
    const requiredAttributes = surveyData.attributes?.filter(a => a.is_required) || [];
    for (const attr of requiredAttributes) {
      if (!attributeScores[attr.id]) {
        setError(`Por favor, evalúa: ${attr.attribute_label}`);
        return;
      }
    }

    // Validar información de contacto si quiere ser contactado
    if (wantsContact) {
      if (!contactInfo.name || (!contactInfo.email && !contactInfo.phone)) {
        setError('Por favor, completa tu información de contacto');
        return;
      }
    }

    setIsSubmitting(true);
    setError('');

    const submission: ResponseSubmission = {
      survey_id: surveyData.id,
      survey_instance_id: surveyData.instance?.id,
      main_score: mainScore,
      attribute_scores: attributeScores,
      wants_contact: wantsContact,
      contact_name: wantsContact ? contactInfo.name : undefined,
      contact_email: wantsContact ? contactInfo.email : undefined,
      contact_phone: wantsContact ? contactInfo.phone : undefined,
      comments: comments || undefined
    };

    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar la respuesta');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar la respuesta');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {surveyData.thank_you_message || '¡Gracias por tu feedback!'}
        </h2>
        <p className="text-gray-600">Tu opinión es muy importante para nosotros.</p>
      </div>
    );
  }

  const maxScore = getMaxScore();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Pregunta Principal */}
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-4">
          {surveyData.main_question}
        </label>
        
        <div className="grid grid-cols-6 md:grid-cols-11 gap-2">
          {Array.from({ length: maxScore + 1 }, (_, i) => i).map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => setMainScore(score)}
              className={`
                aspect-square rounded-lg font-semibold text-sm md:text-base
                transition-all duration-200 transform hover:scale-110
                ${mainScore === score 
                  ? surveyData.question_type === 'NPS'
                    ? score <= 6 
                      ? 'bg-red-500 text-white shadow-lg'
                      : score <= 8
                      ? 'bg-yellow-500 text-white shadow-lg'
                      : 'bg-green-500 text-white shadow-lg'
                    : 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {surveyData.question_type === 'STARS' ? '★' : score}
            </button>
          ))}
        </div>
        
        {mainScore !== null && (
          <p className="mt-3 text-sm text-gray-600 text-center">
            {getScoreLabel(surveyData.question_type, mainScore)}
          </p>
        )}
      </div>

      {/* Atributos Opcionales */}
      {surveyData.attributes && surveyData.attributes.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Evalúa los siguientes aspectos:
          </h3>
          
          {surveyData.attributes.map((attribute) => (
            <div key={attribute.id}>
              <label className="block text-gray-700 mb-3">
                {attribute.attribute_label}
                {attribute.is_required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setAttributeScores(prev => ({
                      ...prev,
                      [attribute.id]: score
                    }))}
                    className={`
                      flex-1 py-2 px-3 rounded-lg font-medium
                      transition-all duration-200
                      ${attributeScores[attribute.id] === score
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {'★'.repeat(score)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comentarios */}
      <div>
        <label htmlFor="comments" className="block text-gray-700 font-medium mb-2">
          Comentarios adicionales (opcional)
        </label>
        <textarea
          id="comments"
          rows={4}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Comparte tu experiencia con nosotros..."
        />
      </div>

      {/* Opción de Contacto */}
      <div className="bg-gray-50 rounded-lg p-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={wantsContact}
            onChange={(e) => setWantsContact(e.target.checked)}
            className="mr-3 h-5 w-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-700 font-medium">
            Me gustaría ser contactado para seguimiento
          </span>
        </label>
        
        {wantsContact && (
          <div className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Nombre *"
              value={contactInfo.name}
              onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={wantsContact}
            />
            <input
              type="email"
              placeholder="Email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500">
              * Debes proporcionar al menos email o teléfono
            </p>
          </div>
        )}
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Botão de Envio */}
      <button
        type="submit"
        disabled={isSubmitting || mainScore === null}
        className={`
          w-full py-3 px-6 rounded-lg font-semibold text-white
          transition-all duration-200 transform
          ${isSubmitting || mainScore === null
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 hover:shadow-lg active:scale-95'
          }
        `}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Respuesta'}
      </button>
    </form>
  );
}