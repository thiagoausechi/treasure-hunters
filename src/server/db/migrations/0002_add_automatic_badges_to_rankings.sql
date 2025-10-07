-- PASSO 1: Remover a view base e todas as suas dependências (outras views)
DROP MATERIALIZED VIEW IF EXISTS "treasure-hunters_player_rankings" CASCADE;

-- Como o CASCADE já removeu as outras, podemos recriar tudo do zero.
-- O Drizzle pode mostrar um aviso sobre as outras views não existirem, mas isso é esperado.
DROP MATERIALIZED VIEW IF EXISTS "treasure-hunters_match_metrics";
DROP MATERIALIZED VIEW IF EXISTS "treasure-hunters_relevance_score_ranking";


-- PASSO 2: Recriar a view base de jogadores com as alterações desejadas
CREATE MATERIALIZED VIEW "treasure-hunters_player_rankings" AS
WITH player_matches AS (
    SELECT
        p.id AS player_id,
        m.id AS match_id,
        CASE WHEN m."bluePlayerId" = p.id THEN m."blueScore" ELSE m."pinkScore" END AS score_for,
        CASE WHEN m."bluePlayerId" = p.id THEN m."pinkScore" ELSE m."blueScore" END AS score_against,
        CASE 
            WHEN m."bluePlayerId" = p.id AND m."blueScore" > m."pinkScore" THEN 1
            WHEN m."pinkPlayerId" = p.id AND m."pinkScore" > m."blueScore" THEN 1
            ELSE 0 
        END AS is_win
    FROM "treasure-hunters_player" p
    JOIN "treasure-hunters_match" m ON p.id = m."bluePlayerId" OR p.id = m."pinkPlayerId"
),
player_stats AS (
    SELECT
        player_id,
        COUNT(match_id) AS total_matches,
        SUM(is_win) AS total_wins,
        SUM(score_for) AS total_score_for,
        SUM(score_against) AS total_score_against,
        (SUM(score_for) - SUM(score_against)) AS score_difference
    FROM player_matches
    GROUP BY player_id
),
ranked_stats AS (
    SELECT
        *,
        NTILE(5) OVER(ORDER BY score_difference DESC) as performance_tier
    FROM player_stats
)
SELECT
    s.player_id,
    p.name as player_name,
    s.total_matches,
    s.total_wins,
    s.total_score_for,
    s.total_score_against,
    s.score_difference,
    CASE 
        WHEN s.total_matches > 0 THEN (s.total_wins::decimal / s.total_matches::decimal)
        ELSE 0 
    END AS win_rate,
    ROW_NUMBER() OVER(ORDER BY s.total_wins DESC, s.score_difference DESC) as rank,
    s.performance_tier
FROM ranked_stats s
JOIN "treasure-hunters_player" p ON s.player_id = p.id;

-- Recria o índice para a view principal
CREATE UNIQUE INDEX ON "treasure-hunters_player_rankings"(player_id);


-- PASSO 3: Recriar as views dependentes que foram removidas pelo CASCADE

-- View para métricas de partidas
CREATE MATERIALIZED VIEW "treasure-hunters_match_metrics" AS
SELECT
    m.id AS match_id,
    m."createdAt",
    p_blue.id as blue_player_id,
    p_blue.name as blue_player_name,
    m."blueScore",
    p_pink.id as pink_player_id,
    p_pink.name as pink_player_name,
    m."pinkScore",
    ABS(m."blueScore" - m."pinkScore") AS score_dispute,
    (m."blueScore" + m."pinkScore") AS total_score,
    (r_blue.rank + r_pink.rank) AS titans_clash_score
FROM "treasure-hunters_match" m
JOIN "treasure-hunters_player" p_blue ON m."bluePlayerId" = p_blue.id
JOIN "treasure-hunters_player" p_pink ON m."pinkPlayerId" = p_pink.id
LEFT JOIN "treasure-hunters_player_rankings" r_blue ON m."bluePlayerId" = r_blue.player_id
LEFT JOIN "treasure-hunters_player_rankings" r_pink ON m."pinkPlayerId" = r_pink.player_id;

-- View para o Score de Relevância
CREATE MATERIALIZED VIEW "treasure-hunters_relevance_score_ranking" AS
WITH normalized_metrics AS (
    SELECT
        match_id,
        CASE 
            WHEN (MAX(score_dispute) OVER() - MIN(score_dispute) OVER()) > 0 
            THEN 1 - ( (score_dispute - MIN(score_dispute) OVER()) / (MAX(score_dispute) OVER() - MIN(score_dispute) OVER()) )
            ELSE 1
        END AS dispute_score,
        CASE
            WHEN (MAX(total_score) OVER() - MIN(total_score) OVER()) > 0
            THEN ( (total_score - MIN(total_score) OVER()) / (MAX(total_score) OVER() - MIN(total_score) OVER()) )
            ELSE 1
        END AS punctuation_score
    FROM "treasure-hunters_match_metrics"
)
SELECT
    m.*,
    (n.dispute_score * 0.6 + n.punctuation_score * 0.4) AS relevance_score
FROM "treasure-hunters_match_metrics" m
JOIN normalized_metrics n ON m.match_id = n.match_id;

-- Recria os índices para as views dependentes
CREATE UNIQUE INDEX ON "treasure-hunters_match_metrics"(match_id);
CREATE UNIQUE INDEX ON "treasure-hunters_relevance_score_ranking"(match_id);