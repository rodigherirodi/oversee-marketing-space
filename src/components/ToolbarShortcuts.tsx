
import React, { useState } from 'react';
import { 
  Mail, 
  Calendar, 
  MessageCircle, 
  FileText, 
  Clock, 
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import UserProfile from './UserProfile';

const ToolbarShortcuts = () => {
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();

  const shortcuts = [
    { 
      icon: Mail, 
      label: 'Email', 
      onClick: () => window.open('https://mail.google.com/mail/u/0/#inbox', '_blank'),
      badge: 5
    },
    { 
      icon: Calendar, 
      label: 'Agenda', 
      onClick: () => window.open('https://calendar.google.com/calendar/u/0/r', '_blank')
    },
    { 
      icon: MessageCircle, 
      label: 'Chat', 
      onClick: () => navigate('/chat'),
      badge: 2
    },
    { 
      icon: FileText, 
      label: 'Bloco de Notas', 
      onClick: () => console.log('Notas clicked') 
    },
    { 
      icon: Clock, 
      label: 'Controle de Tempo', 
      onClick: () => console.log('Tempo clicked') 
    }
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Shortcuts */}
      <div className="hidden md:flex items-center gap-1">
        {shortcuts.map((shortcut, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={shortcut.onClick}
                className="relative h-8 w-8 p-0"
              >
                <shortcut.icon className="h-4 w-4" />
                {shortcut.badge && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                    {shortcut.badge}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{shortcut.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Notifications */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Notificações</p>
        </TooltipContent>
      </Tooltip>

      {/* User Profile */}
      <UserProfile />
    </div>
  );
};

export default ToolbarShortcuts;
