
import React from 'react';
import { Volume2, VolumeX, Mic, MicOff, Phone, PhoneOff, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChat } from '@/contexts/ChatContext';
import { ChatChannel } from '@/types/chat';

interface VoiceChannelProps {
  channel: ChatChannel;
}

const VoiceChannel: React.FC<VoiceChannelProps> = ({ channel }) => {
  const { 
    currentUser, 
    users, 
    voiceStates, 
    joinVoiceChannel, 
    leaveVoiceChannel, 
    toggleMute 
  } = useChat();

  const voiceState = voiceStates.find(vs => vs.channelId === channel.id);
  const connectedUsers = voiceState?.connectedUsers || [];
  const isUserConnected = connectedUsers.some(u => u.userId === currentUser.id);
  const currentUserVoiceState = connectedUsers.find(u => u.userId === currentUser.id);

  const handleJoinLeave = () => {
    if (isUserConnected) {
      leaveVoiceChannel(channel.id, currentUser.id);
    } else {
      joinVoiceChannel(channel.id, currentUser.id);
    }
  };

  const handleMuteToggle = () => {
    if (isUserConnected) {
      toggleMute(channel.id, currentUser.id);
    }
  };

  const getUserById = (id: string) => {
    return users.find(u => u.id === id);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            <span>{channel.name}</span>
            {connectedUsers.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {connectedUsers.length} conectado{connectedUsers.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {isUserConnected && (
              <Button
                variant={currentUserVoiceState?.isMuted ? "destructive" : "secondary"}
                size="sm"
                onClick={handleMuteToggle}
              >
                {currentUserVoiceState?.isMuted ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            )}
            
            <Button
              variant={isUserConnected ? "destructive" : "default"}
              size="sm"
              onClick={handleJoinLeave}
            >
              {isUserConnected ? (
                <>
                  <PhoneOff className="w-4 h-4 mr-2" />
                  Sair
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Entrar
                </>
              )}
            </Button>
          </div>
        </CardTitle>
        
        {channel.description && (
          <p className="text-sm text-muted-foreground">{channel.description}</p>
        )}
      </CardHeader>

      {connectedUsers.length > 0 && (
        <CardContent>
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuários Conectados
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              {connectedUsers.map(userState => {
                const user = getUserById(userState.userId);
                if (!user) return null;
                
                return (
                  <div
                    key={userState.userId}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <div className="flex items-center gap-1">
                        {userState.isMuted && (
                          <MicOff className="w-3 h-3 text-destructive" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {userState.isMuted ? 'Mudo' : 'Ativo'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default VoiceChannel;
