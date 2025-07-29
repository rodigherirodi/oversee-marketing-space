
-- Adicionar todas as permissões de workspace para administradores
INSERT INTO workspace_permissions (user_id, workspace_id, can_access, can_admin)
SELECT 
  ur.user_id,
  ws.workspace_id,
  true,
  true
FROM user_roles ur
CROSS JOIN (
  VALUES 
    ('operacao'),
    ('academy'),
    ('cultura'),
    ('comercial'),
    ('gestao')
) AS ws(workspace_id)
WHERE ur.role = 'admin'
ON CONFLICT (user_id, workspace_id) DO UPDATE SET
  can_access = true,
  can_admin = true;

-- Criar tabela para métricas de produtividade
CREATE TABLE IF NOT EXISTS user_productivity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  productivity_score INTEGER DEFAULT 75,
  hours_worked_month INTEGER DEFAULT 160,
  avg_completion_time NUMERIC DEFAULT 3.5,
  active_streak INTEGER DEFAULT 7,
  punctuality_index INTEGER DEFAULT 95,
  collaboration_index INTEGER DEFAULT 88,
  innovation_score INTEGER DEFAULT 92,
  client_satisfaction NUMERIC DEFAULT 4.5,
  active_projects INTEGER DEFAULT 2,
  completed_projects INTEGER DEFAULT 8,
  collaborative_projects INTEGER DEFAULT 5,
  individual_projects INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS para user_productivity
ALTER TABLE user_productivity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own productivity" ON user_productivity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own productivity" ON user_productivity
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all productivity" ON user_productivity
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Criar tabela para conquistas recentes
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  badge TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para user_achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage achievements" ON user_achievements
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Criar tabela para histórico de pontos
CREATE TABLE IF NOT EXISTS user_points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points INTEGER NOT NULL,
  activity TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para user_points_history
ALTER TABLE user_points_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own points history" ON user_points_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage points history" ON user_points_history
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Atualizar tabela user_goals para incluir campos necessários
ALTER TABLE user_goals 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS current_value INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS target_value INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS deadline DATE;

-- Renomear coluna goal para description se necessário
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_goals' AND column_name='goal') THEN
    ALTER TABLE user_goals RENAME COLUMN goal TO description;
  END IF;
END $$;

-- Inserir dados iniciais de produtividade para usuários existentes
INSERT INTO user_productivity (user_id, productivity_score, hours_worked_month, avg_completion_time)
SELECT 
  id,
  FLOOR(RANDOM() * 20 + 80)::INTEGER, -- Score entre 80-100
  FLOOR(RANDOM() * 40 + 140)::INTEGER, -- Horas entre 140-180
  ROUND((RANDOM() * 2 + 2)::NUMERIC, 1) -- Tempo entre 2-4 dias
FROM profiles
ON CONFLICT (user_id) DO NOTHING;

-- Inserir algumas conquistas de exemplo
INSERT INTO user_achievements (user_id, name, badge, date)
SELECT 
  p.id,
  'Projeto Concluído',
  '🏆',
  CURRENT_DATE - INTERVAL '5 days'
FROM profiles p
WHERE NOT EXISTS (SELECT 1 FROM user_achievements WHERE user_id = p.id)
LIMIT 3;

-- Inserir histórico de pontos de exemplo
INSERT INTO user_points_history (user_id, points, activity, date)
SELECT 
  p.id,
  50,
  'Tarefa concluída no prazo',
  CURRENT_DATE - INTERVAL '2 days'
FROM profiles p
WHERE NOT EXISTS (SELECT 1 FROM user_points_history WHERE user_id = p.id)
LIMIT 5;
