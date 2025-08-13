
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SystemSettings, NotificationSettings } from '@/types/admin';

export const useSystemSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async (): Promise<SystemSettings[]> => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('key');

      if (error) throw error;
      return data || [];
    },
  });

  const { data: notifications } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async (): Promise<NotificationSettings> => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', ['notifications.email.enabled', 'notifications.push.enabled', 'notifications.sms.enabled']);

      if (error) throw error;

      const settingsMap = data?.reduce((acc: any, setting: any) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {}) || {};

      return {
        email: settingsMap['notifications.email.enabled'] || false,
        push: settingsMap['notifications.push.enabled'] || false,
        sms: settingsMap['notifications.sms.enabled'] || false,
      };
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key,
          value,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }, {
          onConflict: 'key'
        });

      if (error) throw error;
      return { key, value };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      toast({
        title: "Configuração atualizada!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar configuração",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateNotifications = async (notifications: NotificationSettings) => {
    const promises = [
      updateSetting.mutateAsync({ key: 'notifications.email.enabled', value: notifications.email }),
      updateSetting.mutateAsync({ key: 'notifications.push.enabled', value: notifications.push }),
      updateSetting.mutateAsync({ key: 'notifications.sms.enabled', value: notifications.sms })
    ];

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  return {
    settings,
    notifications,
    isLoading,
    updateSetting: updateSetting.mutate,
    updateNotifications,
    isUpdating: updateSetting.isPending,
  };
};
