
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, Mail, Key, Globe } from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';

const SettingsDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { notifications, updateNotifications, isLoading } = useSystemSettings();
  const [localNotifications, setLocalNotifications] = useState({
    email: false,
    push: false,
    sms: false
  });

  useEffect(() => {
    if (notifications) {
      setLocalNotifications(notifications);
    }
  }, [notifications]);

  const handleNotificationChange = (type: keyof typeof localNotifications, value: boolean) => {
    setLocalNotifications(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSave = () => {
    updateNotifications(localNotifications);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Settings className="w-4 h-4 mr-2" />
          Configurações do Sistema
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Configurações do Sistema</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Notificações */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificações
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Notificações por Email</p>
                  <p className="text-xs text-gray-600">Receber alertas via email</p>
                </div>
                <Switch 
                  checked={localNotifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Push Notifications</p>
                  <p className="text-xs text-gray-600">Notificações no navegador</p>
                </div>
                <Switch 
                  checked={localNotifications.push}
                  onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">SMS</p>
                  <p className="text-xs text-gray-600">Alertas críticos por SMS</p>
                </div>
                <Switch 
                  checked={localNotifications.sms}
                  onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                />
              </div>
            </div>
          </div>

          {/* Integrações */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Integrações
            </h4>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled>
                <Mail className="w-4 h-4 mr-2" />
                Configurar SMTP
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                <Key className="w-4 h-4 mr-2" />
                Chaves de API
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                <Globe className="w-4 h-4 mr-2" />
                Webhooks
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
