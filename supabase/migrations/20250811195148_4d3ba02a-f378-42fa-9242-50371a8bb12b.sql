
-- Criar tipos enum
CREATE TYPE client_status AS ENUM ('ativo', 'inativo', 'prospect');
CREATE TYPE client_temperature AS ENUM ('frio', 'morno', 'quente');
CREATE TYPE contract_type AS ENUM ('recorrente', 'pontual', 'projeto_unico');
CREATE TYPE company_size AS ENUM ('micro', 'pequeno', 'medio', 'grande');
CREATE TYPE contact_type AS ENUM ('principal', 'financeiro', 'operacional', 'outro');

-- Criar função para atualizar campo atualizado_em
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar tabela principal clientes
CREATE TABLE public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    segmento TEXT,
    porte company_size,
    status client_status DEFAULT 'ativo',
    temperatura client_temperature,
    tipo_contrato contract_type,
    cliente_desde DATE,
    gestor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    nps_atual INTEGER CHECK (nps_atual >= 0 AND nps_atual <= 10),
    nps_atual_data DATE,
    endereco TEXT,
    cidade TEXT,
    uf TEXT,
    site TEXT,
    logo_url TEXT,
    tags TEXT[],
    redes_sociais JSONB,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Criar trigger para atualizar campo atualizado_em
CREATE TRIGGER trigger_clientes_updated_at
    BEFORE UPDATE ON public.clientes
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- Criar índices para performance
CREATE INDEX idx_clientes_status ON public.clientes(status);
CREATE INDEX idx_clientes_nome_search ON public.clientes USING GIN(to_tsvector('portuguese', nome));
CREATE INDEX idx_clientes_tags ON public.clientes USING GIN(tags);

-- Criar tabela cliente_contatos
CREATE TABLE public.cliente_contatos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    tipo contact_type DEFAULT 'outro',
    nome TEXT NOT NULL,
    cargo TEXT,
    email TEXT,
    telefone TEXT,
    observacoes TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para cliente_contatos
CREATE TRIGGER trigger_cliente_contatos_updated_at
    BEFORE UPDATE ON public.cliente_contatos
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- Criar tabela cliente_acessos
CREATE TABLE public.cliente_acessos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    plataforma TEXT NOT NULL,
    usuario TEXT,
    senha TEXT,
    notas TEXT,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para cliente_acessos
CREATE TRIGGER trigger_cliente_acessos_updated_at
    BEFORE UPDATE ON public.cliente_acessos
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- Criar tabela cliente_reunioes
CREATE TABLE public.cliente_reunioes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    data_hora TIMESTAMPTZ NOT NULL,
    tipo TEXT,
    titulo TEXT NOT NULL,
    participantes TEXT[],
    duracao INTEGER, -- em minutos
    resumo TEXT,
    link_gravacao TEXT,
    observacoes TEXT,
    criado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para cliente_reunioes
CREATE TRIGGER trigger_cliente_reunioes_updated_at
    BEFORE UPDATE ON public.cliente_reunioes
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- Políticas RLS para clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all clients" ON public.clientes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert clients" ON public.clientes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update clients" ON public.clientes
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete clients" ON public.clientes
    FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para cliente_contatos
ALTER TABLE public.cliente_contatos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all client contacts" ON public.cliente_contatos
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage client contacts" ON public.cliente_contatos
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas RLS para cliente_acessos
ALTER TABLE public.cliente_acessos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all client accesses" ON public.cliente_acessos
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage client accesses" ON public.cliente_acessos
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas RLS para cliente_reunioes
ALTER TABLE public.cliente_reunioes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all client meetings" ON public.cliente_reunioes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage client meetings" ON public.cliente_reunioes
    FOR ALL USING (auth.role() = 'authenticated');
