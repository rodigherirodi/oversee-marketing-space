
import React, { useState } from 'react';
import { 
  Mail, 
  Calendar, 
  MessageCircle, 
  FileText, 
  Clock, 
  User,
  Bell,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ToolbarShortcuts = () => {
  const [notifications, setNotifications] = useState(3);

  const shortcuts = [
    { 
      icon: Mail, 
      label: 'Email', 
      onClick: () => console.log('Email clicked'),
      badge: 5
    },
    { 
      icon: Calendar, 
      label: 'Agenda', 
      onClick: () => console.log('Agenda clicked') 
    },
    { 
      icon: MessageCircle, 
      label: 'Chat', 
      onClick: () => console.log('Chat clicked'),
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

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 h-8">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
              U
            </div>
            <span className="hidden sm:inline text-sm">Usuário</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>
            <User className="h-4 w-4 mr-2" />
            Meu Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            Configurações
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ToolbarShortcuts;
