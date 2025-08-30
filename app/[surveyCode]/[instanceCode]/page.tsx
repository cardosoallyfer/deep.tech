// Arquivo: app/[surveyCode]/[instanceCode]/page.tsx
// Localização: /app/[surveyCode]/[instanceCode]/page.tsx
// Descrição: Página pública para responder pesquisas

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SurveyWithAttributes } from '@/types/database';
import SurveyForm from '@/components/survey-form';

interface PageProps {
  params: Promise<{
    surveyCode: string;
    instanceCode: string;
  }>;
}

async function getSurveyData(
  surveyCode: string, 
  instanceCode: string
): Promise<SurveyWithAttributes | null> {
  const supabase = await createClient();

  // Buscar pesquisa pelo código
  const { data: survey, error: surveyError } = await supabase
    .from('surveys')
    .select('*')
    .eq('survey_code', surveyCode)
    .eq('status', 'active')
    .single();

  if (surveyError || !survey) {
    return null;
  }

  // Buscar instância
  const { data: instance, error: instanceError } = await supabase
    .from('survey_instances')
    .select('*')
    .eq('survey_id', survey.id)
    .eq('instance_code', instanceCode)
    .eq('is_active', true)
    .single();

  if (instanceError || !instance) {
    return null;
  }

  // Buscar atributos da pesquisa
  const { data: attributes } = await supabase
    .from('survey_attributes')
    .select('*')
    .eq('survey_id', survey.id)
    .order('display_order', { ascending: true });

  return {
    ...survey,
    attributes: attributes || [],
    instance
  };
}

export default async function SurveyPage({ params }: PageProps) {
  const { surveyCode, instanceCode } = await params;
  
  const surveyData = await getSurveyData(surveyCode, instanceCode);

  if (!surveyData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {surveyData.name}
          </h1>
          
          {surveyData.instance?.name && (
            <p className="text-gray-600 mb-6">
              {surveyData.instance.name}
            </p>
          )}

          <SurveyForm surveyData={surveyData} />
        </div>
      </div>
    </div>
  );
}