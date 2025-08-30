// Arquivo: app/api/responses/route.ts
// Localização: /app/api/responses/route.ts
// Descrição: API endpoint para salvar respostas de pesquisas

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ResponseSubmission } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body: ResponseSubmission = await request.json();
    const supabase = await createClient();
    
    // Obter IP e User Agent
    const ip_address = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const user_agent = request.headers.get('user-agent') || '';

    // Validar dados básicos
    if (!body.survey_id || body.main_score === undefined) {
      return NextResponse.json(
        { error: 'Datos requeridos faltantes' },
        { status: 400 }
      );
    }

    // Validar score baseado no tipo de pesquisa
    if (body.main_score < 0 || body.main_score > 10) {
      return NextResponse.json(
        { error: 'Puntuación inválida' },
        { status: 400 }
      );
    }

    // Iniciar transação para salvar resposta principal e atributos
    // 1. Salvar resposta principal
    const { data: response, error: responseError } = await supabase
      .from('responses')
      .insert({
        survey_id: body.survey_id,
        survey_instance_id: body.survey_instance_id || null,
        main_score: body.main_score,
        wants_contact: body.wants_contact || false,
        contact_name: body.contact_name || null,
        contact_email: body.contact_email || null,
        contact_phone: body.contact_phone || null,
        comments: body.comments || null,
        ip_address,
        user_agent
      })
      .select()
      .single();

    if (responseError) {
      console.error('Error saving response:', responseError);
      return NextResponse.json(
        { error: 'Error al guardar la respuesta' },
        { status: 500 }
      );
    }

    // 2. Salvar respostas dos atributos (se houver)
    if (body.attribute_scores && Object.keys(body.attribute_scores).length > 0) {
      const attributeResponses = Object.entries(body.attribute_scores).map(
        ([attribute_id, score]) => ({
          response_id: response.id,
          attribute_id,
          score
        })
      );

      const { error: attributeError } = await supabase
        .from('attribute_responses')
        .insert(attributeResponses);

      if (attributeError) {
        console.error('Error saving attribute responses:', attributeError);
        // Não vamos falhar toda a operação se os atributos falharem
        // mas vamos logar o erro
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: '¡Gracias por tu feedback!',
        response_id: response.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Error inesperado al procesar la respuesta' },
      { status: 500 }
    );
  }
}

// GET endpoint para verificar se a API está funcionando
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'API de respuestas funcionando'
  });
}