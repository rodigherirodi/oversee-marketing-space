
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Profile = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Página de perfil em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
