
-- Add cliente_id column to tarefas table if it doesn't exist
ALTER TABLE tarefas ADD COLUMN IF NOT EXISTS cliente_id uuid;

-- Add foreign key constraint to reference clientes table
ALTER TABLE tarefas ADD CONSTRAINT fk_tarefas_cliente_id 
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL;

-- Update existing records to set cliente_id based on cliente text field
UPDATE tarefas 
SET cliente_id = clientes.id 
FROM clientes 
WHERE tarefas.cliente = clientes.nome;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tarefas_cliente_id ON tarefas(cliente_id);
