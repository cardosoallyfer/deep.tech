-- Arquivo: supabase/queries/analytics.sql
-- Localização: /supabase/queries/analytics.sql
-- Descrição: Queries SQL úteis para análise de dados no DeepCX

-- ============================================
-- 1. MÉTRICAS BÁSICAS
-- ============================================

-- Total de respostas por pesquisa
SELECT 
    s.name as survey_name,
    s.survey_code,
    COUNT(r.id) as total_responses,
    AVG(r.main_score) as average_score,
    MIN(r.created_at) as first_response,
    MAX(r.created_at) as last_response
FROM surveys s
LEFT JOIN responses r ON s.id = r.survey_id
GROUP BY s.id, s.name, s.survey_code
ORDER BY total_responses DESC;

-- ============================================
-- 2. CÁLCULO DE NPS
-- ============================================

-- NPS por pesquisa (para pesquisas tipo NPS)
WITH nps_calc AS (
    SELECT 
        s.id,
        s.name,
        s.survey_code,
        COUNT(CASE WHEN r.main_score >= 9 THEN 1 END) as promoters,
        COUNT(CASE WHEN r.main_score >= 7 AND r.main_score <= 8 THEN 1 END) as passives,
        COUNT(CASE WHEN r.main_score <= 6 THEN 1 END) as detractors,
        COUNT(r.id) as total
    FROM surveys s
    JOIN responses r ON s.id = r.survey_id
    WHERE s.question_type = 'NPS'
    GROUP BY s.id, s.name, s.survey_code
)
SELECT 
    name,
    survey_code,
    promoters,
    passives,
    detractors,
    total,
    ROUND(((promoters::numeric / total) - (detractors::numeric / total)) * 100, 2) as nps_score
FROM nps_calc
WHERE total > 0
ORDER BY nps_score DESC;

-- ============================================
-- 3. ANÁLISE DE ATRIBUTOS
-- ============================================

-- Média de score por atributo
SELECT 
    sa.attribute_label,
    AVG(ar.score) as average_score,
    COUNT(ar.id) as total_responses,
    MIN(ar.score) as min_score,
    MAX(ar.score) as max_score
FROM survey_attributes sa
JOIN attribute_responses ar ON sa.id = ar.attribute_id
GROUP BY sa.id, sa.attribute_label
ORDER BY average_score DESC;

-- ============================================
-- 4. ANÁLISE TEMPORAL
-- ============================================

-- Respostas por dia (últimos 30 dias)
SELECT 
    DATE(created_at AT TIME ZONE 'America/Argentina/Buenos_Aires') as response_date,
    COUNT(*) as daily_responses,
    AVG(main_score) as daily_average
FROM responses
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY response_date
ORDER BY response_date DESC;

-- Respostas por hora do dia
SELECT 
    EXTRACT(HOUR FROM created_at AT TIME ZONE 'America/Argentina/Buenos_Aires') as hour_of_day,
    COUNT(*) as responses_count,
    AVG(main_score) as average_score
FROM responses
GROUP BY hour_of_day
ORDER BY hour_of_day;

-- ============================================
-- 5. ANÁLISE DE CONTATOS
-- ============================================

-- Clientes que solicitaram contato
SELECT 
    s.name as survey_name,
    r.contact_name,
    r.contact_email,
    r.contact_phone,
    r.main_score,
    r.comments,
    r.created_at
FROM responses r
JOIN surveys s ON r.survey_id = s.id
WHERE r.wants_contact = true
ORDER BY r.created_at DESC;

-- Taxa de solicitação de contato por score
SELECT 
    main_score,
    COUNT(*) as total,
    COUNT(CASE WHEN wants_contact = true THEN 1 END) as requested_contact,
    ROUND(COUNT(CASE WHEN wants_contact = true THEN 1 END)::numeric / COUNT(*)::numeric * 100, 2) as contact_rate
FROM responses
GROUP BY main_score
ORDER BY main_score;

-- ============================================
-- 6. ANÁLISE POR INSTÂNCIA/CAMPANHA
-- ============================================

-- Performance por instância (QR Code/Campanha)
SELECT 
    si.name as instance_name,
    si.instance_code,
    COUNT(r.id) as total_responses,
    AVG(r.main_score) as average_score,
    COUNT(CASE WHEN r.wants_contact = true THEN 1 END) as contact_requests
FROM survey_instances si
LEFT JOIN responses r ON si.id = r.survey_instance_id
GROUP BY si.id, si.name, si.instance_code
ORDER BY total_responses DESC;

-- ============================================
-- 7. ANÁLISE DE COMENTÁRIOS
-- ============================================

-- Últimos comentários com scores
SELECT 
    s.name as survey_name,
    r.main_score,
    r.comments,
    r.created_at
FROM responses r
JOIN surveys s ON r.survey_id = s.id
WHERE r.comments IS NOT NULL AND r.comments != ''
ORDER BY r.created_at DESC
LIMIT 50;

-- Comentários de detratores (NPS <= 6)
SELECT 
    s.name as survey_name,
    r.main_score,
    r.comments,
    r.contact_name,
    r.created_at
FROM responses r
JOIN surveys s ON r.survey_id = s.id
WHERE s.question_type = 'NPS' 
    AND r.main_score <= 6 
    AND r.comments IS NOT NULL
ORDER BY r.created_at DESC;

-- ============================================
-- 8. DASHBOARD RESUMO
-- ============================================

-- View materializada para dashboard (criar uma vez)
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_summary AS
SELECT 
    s.id as survey_id,
    s.name as survey_name,
    s.survey_code,
    s.question_type,
    COUNT(r.id) as total_responses,
    AVG(r.main_score)::numeric(4,2) as average_score,
    COUNT(CASE WHEN r.wants_contact = true THEN 1 END) as contact_requests,
    COUNT(CASE WHEN r.comments IS NOT NULL THEN 1 END) as with_comments,
    DATE(MAX(r.created_at)) as last_response_date,
    -- NPS específico
    CASE 
        WHEN s.question_type = 'NPS' THEN
            ROUND(((COUNT(CASE WHEN r.main_score >= 9 THEN 1 END)::numeric / NULLIF(COUNT(r.id), 0)) - 
                   (COUNT(CASE WHEN r.main_score <= 6 THEN 1 END)::numeric / NULLIF(COUNT(r.id), 0))) * 100, 2)
        ELSE NULL
    END as nps_score
FROM surveys s
LEFT JOIN responses r ON s.id = r.survey_id
GROUP BY s.id, s.name, s.survey_code, s.question_type;

-- Refresh da view materializada (executar periodicamente)
REFRESH MATERIALIZED VIEW dashboard_summary;

-- ============================================
-- 9. EXPORTAÇÃO PARA CSV
-- ============================================

-- Query completa para exportar respostas
SELECT 
    s.name as survey_name,
    s.survey_code,
    si.name as instance_name,
    r.main_score,
    r.wants_contact,
    r.contact_name,
    r.contact_email,
    r.contact_phone,
    r.comments,
    r.created_at AT TIME ZONE 'America/Argentina/Buenos_Aires' as response_date,
    -- Adicionar scores de atributos em colunas separadas
    MAX(CASE WHEN sa.attribute_name = 'atendimento' THEN ar.score END) as score_atendimento,
    MAX(CASE WHEN sa.attribute_name = 'qualidade' THEN ar.score END) as score_qualidade,
    MAX(CASE WHEN sa.attribute_name = 'rapidez' THEN ar.score END) as score_rapidez
FROM responses r
JOIN surveys s ON r.survey_id = s.id
LEFT JOIN survey_instances si ON r.survey_instance_id = si.id
LEFT JOIN attribute_responses ar ON r.id = ar.response_id
LEFT JOIN survey_attributes sa ON ar.attribute_id = sa.id
GROUP BY r.id, s.name, s.survey_code, si.name, r.main_score, r.wants_contact, 
         r.contact_name, r.contact_email, r.contact_phone, r.comments, r.created_at
ORDER BY r.created_at DESC;

-- ============================================
-- 10. ALERTAS E MONITORAMENTO
-- ============================================

-- Detratores recentes que querem contato (últimas 24h)
SELECT 
    s.name as survey_name,
    r.contact_name,
    r.contact_email,
    r.contact_phone,
    r.main_score,
    r.comments,
    r.created_at
FROM responses r
JOIN surveys s ON r.survey_id = s.id
WHERE r.main_score <= 6 
    AND r.wants_contact = true
    AND r.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY r.created_at DESC;

-- Taxa de resposta por período
WITH daily_stats AS (
    SELECT 
        DATE(created_at) as day,
        COUNT(*) as responses
    FROM responses
    WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY day
)
SELECT 
    day,
    responses,
    AVG(responses) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg_7_days
FROM daily_stats
ORDER BY day DESC;