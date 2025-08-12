
-- Primeiro, vamos adicionar uma coluna cliente_id para o relacionamento correto
ALTER TABLE projetos ADD COLUMN cliente_id uuid REFERENCES clientes(id);

-- Vamos criar um índice para melhorar a performance das consultas
CREATE INDEX idx_projetos_cliente_id ON projetos(cliente_id);

-- Atualizar os projetos existentes para tentar mapear pelos nomes (se possível)
UPDATE projetos 
SET cliente_id = c.id 
FROM clientes c 
WHERE projetos.cliente = c.nome;
