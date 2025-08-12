
-- Adicionar campos opcionais sugeridos na tabela cliente_acessos
ALTER TABLE cliente_acessos 
ADD COLUMN IF NOT EXISTS categoria text,
ADD COLUMN IF NOT EXISTS status boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS url text;

-- Criar índice para melhorar performance das consultas
CREATE INDEX IF NOT EXISTS idx_cliente_acessos_cliente_plataforma 
ON cliente_acessos (cliente_id, plataforma);

-- Comentários para documentação
COMMENT ON COLUMN cliente_acessos.categoria IS 'Categoria do acesso (social, ads, analytics, email, hosting, other)';
COMMENT ON COLUMN cliente_acessos.status IS 'Status do acesso - true para ativo, false para inativo';
COMMENT ON COLUMN cliente_acessos.url IS 'URL da plataforma para acesso direto';
