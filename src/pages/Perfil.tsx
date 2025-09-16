import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Settings, Activity, BarChart3, Phone, Mail, Calendar, Building } from 'lucide-react';

const Perfil = () => {
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState('dados-pessoais');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="" alt={profile?.nome} />
          <AvatarFallback className="text-lg">
            {profile?.nome ? getInitials(profile.nome) : 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e preferências do sistema
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dados-pessoais" className="flex items-center gap-2">
            <User size={16} />
            Dados Pessoais
          </TabsTrigger>
          <TabsTrigger value="preferencias" className="flex items-center gap-2">
            <Settings size={16} />
            Preferências
          </TabsTrigger>
          <TabsTrigger value="atividades" className="flex items-center gap-2">
            <Activity size={16} />
            Atividades
          </TabsTrigger>
          <TabsTrigger value="estatisticas" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Estatísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dados-pessoais">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Suas informações básicas de cadastro no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" alt={profile?.nome} />
                  <AvatarFallback className="text-lg">
                    {profile?.nome ? getInitials(profile.nome) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{profile?.nome || 'Nome do Servidor'}</h3>
                  <p className="text-muted-foreground">Cargo / Função</p>
                  <p className="text-sm text-muted-foreground">{profile?.setor || 'Secretaria / Departamento / Setor'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={profile?.nome || ''}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone" className="flex items-center gap-2">
                    <Phone size={16} />
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    placeholder="(67) 99999-9999"
                    className="bg-muted"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Input
                    id="matricula"
                    placeholder="2025001"
                    className="bg-muted"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data-admissao" className="flex items-center gap-2">
                    <Calendar size={16} />
                    Data de Admissão
                  </Label>
                  <Input
                    id="data-admissao"
                    placeholder="14/01/2020"
                    className="bg-muted"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cargo" className="flex items-center gap-2">
                    <Building size={16} />
                    Cargo
                  </Label>
                  <Input
                    id="cargo"
                    placeholder="Cargo / Função"
                    className="bg-muted"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Input
                    id="departamento"
                    value={profile?.setor || ''}
                    className="bg-muted"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                      Ativo
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferencias">
          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>
                Configure suas preferências do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center py-12">
                  <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Preferências</h3>
                  <p className="text-muted-foreground">
                    Configurações de preferências em desenvolvimento
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atividades">
          <Card>
            <CardHeader>
              <CardTitle>Atividades</CardTitle>
              <CardDescription>
                Histórico de suas atividades no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center py-12">
                  <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Atividades</h3>
                  <p className="text-muted-foreground">
                    Histórico de atividades em desenvolvimento
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estatisticas">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>
                Estatísticas de uso do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center py-12">
                  <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Estatísticas</h3>
                  <p className="text-muted-foreground">
                    Estatísticas de uso em desenvolvimento
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Perfil;