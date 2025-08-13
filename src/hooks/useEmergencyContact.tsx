
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { emergencyContactSchema, EmergencyContactData } from '@/schemas/emergencyContactSchema';

export const useEmergencyContact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchEmergencyContact = async (profileId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('emergency_contact_name, emergency_contact_phone, emergency_contact_relationship')
        .eq('id', profileId)
        .single();

      if (error) {
        throw error;
      }

      return {
        emergency_contact_name: data?.emergency_contact_name || '',
        emergency_contact_phone: data?.emergency_contact_phone || '',
        emergency_contact_relationship: data?.emergency_contact_relationship || '',
      };
    } catch (error) {
      console.error('Error fetching emergency contact:', error);
      toast({
        title: "Erro ao carregar contato de emergência",
        description: "Não foi possível carregar as informações do contato de emergência.",
        variant: "destructive",
      });
      return {
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relationship: '',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmergencyContact = async (profileId: string, data: EmergencyContactData) => {
    try {
      setIsLoading(true);

      // Validate data
      const validatedData = emergencyContactSchema.parse(data);

      const { error } = await supabase
        .from('profiles')
        .update({
          emergency_contact_name: validatedData.emergency_contact_name || null,
          emergency_contact_phone: validatedData.emergency_contact_phone || null,
          emergency_contact_relationship: validatedData.emergency_contact_relationship || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profileId);

      if (error) {
        throw error;
      }

      toast({
        title: "Contato de emergência atualizado",
        description: "As informações foram salvas com sucesso.",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error updating emergency contact:', error);
      
      if (error.issues) {
        toast({
          title: "Dados inválidos",
          description: error.issues[0]?.message || "Verifique os dados informados.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar as informações do contato de emergência.",
          variant: "destructive",
        });
      }

      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchEmergencyContact,
    updateEmergencyContact,
    isLoading,
  };
};
