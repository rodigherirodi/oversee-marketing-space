
import { Client } from '@/types/entities';
import { SupabaseClient } from '@/hooks/useSupabaseClients';

export const transformSupabaseClientToClient = (supabaseClient: SupabaseClient): Client => {
  return {
    id: supabaseClient.id,
    name: supabaseClient.nome,
    segment: supabaseClient.segmento || '',
    description: supabaseClient.descricao || '',
    logo: supabaseClient.logo_url || undefined,
    status: supabaseClient.status === 'ativo' ? 'active' : 
            supabaseClient.status === 'inativo' ? 'inactive' : 'onboarding',
    size: supabaseClient.porte === 'micro' ? 'MEI' : 
          supabaseClient.porte === 'pequeno' ? 'PME' :
          supabaseClient.porte === 'medio' ? 'PME' : 'large',
    address: supabaseClient.endereco || '',
    website: supabaseClient.site,
    primaryContact: {
      name: '',
      phone: '',
      email: '',
    },
    financialContact: {
      name: '',
      phone: '',
      email: '',
    },
    socialMedia: supabaseClient.redes_sociais || {},
    contractType: supabaseClient.tipo_contrato === 'recorrente' ? 'recurring' : 
                  supabaseClient.tipo_contrato === 'projeto_unico' ? 'project' : 'one-time',
    temperature: supabaseClient.temperatura === 'frio' ? 'cold' : 
                 supabaseClient.temperatura === 'morno' ? 'warm' : 'hot',
    nps: supabaseClient.nps_atual,
    entryDate: supabaseClient.cliente_desde || '',
    responsibleManager: supabaseClient.gestor_id || '',
    createdAt: supabaseClient.criado_em,
  };
};
