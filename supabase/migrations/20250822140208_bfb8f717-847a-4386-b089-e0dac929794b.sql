
-- Primeiro, vamos garantir que as foreign keys estão corretas e adicionar as que faltam
-- Verificar se existem dados órfãos antes de criar as FKs

-- 1. Adicionar foreign keys na tabela tarefas se não existirem
DO $$ 
BEGIN
    -- FK para projetos (projeto referenciado por string, vamos assumir que precisa ser ajustado)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tarefas_projeto_fkey' 
        AND table_name = 'tarefas'
    ) THEN
        -- Primeiro, adicionar coluna projeto_id se não existir
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'tarefas' AND column_name = 'projeto_id'
        ) THEN
            ALTER TABLE tarefas ADD COLUMN projeto_id uuid;
        END IF;
        
        -- Migrar dados existentes de projeto (string) para projeto_id (uuid)
        UPDATE tarefas SET projeto_id = projetos.id 
        FROM projetos 
        WHERE tarefas.projeto = projetos.titulo;
        
        -- Criar FK para projeto_id
        ALTER TABLE tarefas 
        ADD CONSTRAINT tarefas_projeto_id_fkey 
        FOREIGN KEY (projeto_id) REFERENCES projetos(id) 
        ON UPDATE CASCADE ON DELETE RESTRICT;
    END IF;
    
    -- FK para clientes
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tarefas_cliente_id_fkey' 
        AND table_name = 'tarefas'
    ) THEN
        ALTER TABLE tarefas 
        ADD CONSTRAINT tarefas_cliente_id_fkey 
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) 
        ON UPDATE CASCADE ON DELETE RESTRICT;
    END IF;
    
    -- FK para responsável (profiles)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tarefas_responsavel_fkey' 
        AND table_name = 'tarefas'
    ) THEN
        ALTER TABLE tarefas 
        ADD CONSTRAINT tarefas_responsavel_fkey 
        FOREIGN KEY (responsavel) REFERENCES profiles(id) 
        ON UPDATE CASCADE ON DELETE RESTRICT;
    END IF;
END $$;

-- 2. Adicionar FK na tabela projetos para clientes se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'projetos_cliente_id_fkey' 
        AND table_name = 'projetos'
    ) THEN
        ALTER TABLE projetos 
        ADD CONSTRAINT projetos_cliente_id_fkey 
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) 
        ON UPDATE CASCADE ON DELETE RESTRICT;
    END IF;
END $$;

-- 3. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_tarefas_projeto_id ON tarefas(projeto_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_cliente_id ON tarefas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_responsavel ON tarefas(responsavel);
CREATE INDEX IF NOT EXISTS idx_tarefas_status ON tarefas(status);
CREATE INDEX IF NOT EXISTS idx_tarefas_data_entrega ON tarefas(data_entrega);
CREATE INDEX IF NOT EXISTS idx_projetos_cliente_id ON projetos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_projetos_status ON projetos(status);

-- 4. Criar view otimizada para tarefas com dados relacionados
CREATE OR REPLACE VIEW v_tarefas_completas AS
SELECT 
    t.id,
    t.titulo,
    t.descricao,
    t.status,
    t.prioridade,
    t.data_entrega,
    t.criado_em,
    t.atualizado_em,
    t.concluido_em,
    t.tags,
    t.squad,
    t.tipo,
    t.campos_customizados,
    
    -- Dados do projeto
    t.projeto_id,
    p.titulo as projeto_nome,
    p.status as projeto_status,
    
    -- Dados do cliente
    t.cliente_id,
    c.nome as cliente_nome,
    c.status as cliente_status,
    
    -- Dados do responsável
    t.responsavel as responsavel_id,
    pr.name as responsavel_nome,
    pr.avatar as responsavel_avatar,
    pr.department as responsavel_department
    
FROM tarefas t
LEFT JOIN projetos p ON t.projeto_id = p.id
LEFT JOIN clientes c ON t.cliente_id = c.id
LEFT JOIN profiles pr ON t.responsavel = pr.id;

-- 5. Criar view otimizada para projetos com dados relacionados
CREATE OR REPLACE VIEW v_projetos_completos AS
SELECT 
    p.id,
    p.titulo,
    p.cliente,
    p.cliente_id,
    p.status,
    p.prioridade,
    p.data_inicio,
    p.data_entrega,
    p.progresso,
    p.equipe,
    p.tags,
    p.responsavel,
    p.briefing,
    p.escopo,
    p.observacoes,
    p.materiais,
    p.criado_em,
    p.atualizado_em,
    
    -- Dados do cliente
    c.nome as cliente_nome,
    c.status as cliente_status,
    c.segmento as cliente_segmento,
    
    -- Estatísticas de tarefas do projeto
    (SELECT COUNT(*) FROM tarefas WHERE projeto_id = p.id) as total_tarefas,
    (SELECT COUNT(*) FROM tarefas WHERE projeto_id = p.id AND status = 'completed') as tarefas_concluidas,
    (SELECT COUNT(*) FROM tarefas WHERE projeto_id = p.id AND status = 'in_progress') as tarefas_em_andamento
    
FROM projetos p
LEFT JOIN clientes c ON p.cliente_id = c.id;

-- 6. Atualizar RLS policies para as views
ALTER VIEW v_tarefas_completas OWNER TO postgres;
ALTER VIEW v_projetos_completos OWNER TO postgres;

-- RLS para v_tarefas_completas
CREATE POLICY "Users can view complete tasks data" 
ON v_tarefas_completas FOR SELECT 
USING (true);

-- RLS para v_projetos_completos  
CREATE POLICY "Users can view complete projects data" 
ON v_projetos_completos FOR SELECT 
USING (auth.role() = 'authenticated'::text);

-- 7. Função para verificar dependências antes de exclusão
CREATE OR REPLACE FUNCTION check_client_dependencies(client_uuid uuid)
RETURNS TABLE(has_projects boolean, has_tasks boolean, project_count bigint, task_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXISTS(SELECT 1 FROM projetos WHERE cliente_id = client_uuid) as has_projects,
        EXISTS(SELECT 1 FROM tarefas WHERE cliente_id = client_uuid) as has_tasks,
        (SELECT COUNT(*) FROM projetos WHERE cliente_id = client_uuid) as project_count,
        (SELECT COUNT(*) FROM tarefas WHERE cliente_id = client_uuid) as task_count;
END;
$$;

CREATE OR REPLACE FUNCTION check_project_dependencies(project_uuid uuid)
RETURNS TABLE(has_tasks boolean, task_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXISTS(SELECT 1 FROM tarefas WHERE projeto_id = project_uuid) as has_tasks,
        (SELECT COUNT(*) FROM tarefas WHERE projeto_id = project_uuid) as task_count;
END;
$$;

-- 8. Inserir dados de exemplo para testar
INSERT INTO clientes (id, nome, segmento, status) VALUES 
('11111111-1111-1111-1111-111111111111', 'Cliente Teste 1', 'Tecnologia', 'ativo'),
('22222222-2222-2222-2222-222222222222', 'Cliente Teste 2', 'Saúde', 'ativo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO projetos (id, titulo, cliente_id, status, progresso) VALUES 
('33333333-3333-3333-3333-333333333333', 'Projeto Teste 1', '11111111-1111-1111-1111-111111111111', 'em_andamento', 50),
('44444444-4444-4444-4444-444444444444', 'Projeto Teste 2', '22222222-2222-2222-2222-222222222222', 'planejamento', 10)
ON CONFLICT (id) DO NOTHING;

-- Atualizar tarefas existentes para ter projeto_id correto
UPDATE tarefas SET projeto_id = '33333333-3333-3333-3333-333333333333' 
WHERE projeto = 'Projeto Teste 1';

UPDATE tarefas SET projeto_id = '44444444-4444-4444-4444-444444444444' 
WHERE projeto = 'Projeto Teste 2';
