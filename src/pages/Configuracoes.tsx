import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Settings, Monitor, Computer, Printer, Laptop, Zap, Tablet, Smartphone, Headphones, Router, HardDrive, Trash2, Building2, Edit } from 'lucide-react';
import { useTiposEquipamento } from '@/hooks/useTiposEquipamento';
import { useSecretarias } from '@/hooks/useSecretarias';
import { TipoEquipamentoModal } from '@/components/modals/TipoEquipamentoModal';
import { SecretariaModal } from '@/components/modals/SecretariaModal';
import { useAuth } from '@/contexts/AuthContext';

const iconComponents = {
  Computer,
  Monitor,
  Printer,
  Laptop,
  Zap,
  Tablet,
  Smartphone,
  Headphones,
  Router,
  HardDrive,
} as const;

const Configuracoes = () => {
  const { profile } = useAuth();
  const { tipos, loading, deleteTipo, refetch: refetchTipos } = useTiposEquipamento();
  const { secretarias, loading: loadingSecretarias, deleteSecretaria, fetchSecretarias } = useSecretarias();
  const [tipoModalOpen, setTipoModalOpen] = useState(false);
  const [secretariaModalOpen, setSecretariaModalOpen] = useState(false);
  const [selectedSecretaria, setSelectedSecretaria] = useState<any>(null);
  const isAdmin = profile?.role === 'admin';

  const getIconComponent = (iconeName?: string) => {
    if (!iconeName || !(iconeName in iconComponents)) {
      return Settings;
    }
    return iconComponents[iconeName as keyof typeof iconComponents];
  };

  const handleTipoModalSubmit = async () => {
    await refetchTipos();
  };

  const handleSecretariaModalSubmit = async () => {
    await fetchSecretarias();
  };

  const handleEditSecretaria = (secretaria: any) => {
    setSelectedSecretaria(secretaria);
    setSecretariaModalOpen(true);
  };

  const handleCloseSecretariaModal = () => {
    setSelectedSecretaria(null);
    setSecretariaModalOpen(false);
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Configurações</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        </div>

        <Tabs defaultValue="secretarias" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="secretarias">Secretarias</TabsTrigger>
            <TabsTrigger value="tipos-equipamento">Tipos de Equipamento</TabsTrigger>
          </TabsList>

          <TabsContent value="secretarias">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Secretarias
                    </CardTitle>
                    <CardDescription>
                      Gerencie as secretarias do município
                    </CardDescription>
                  </div>
                  <Button onClick={() => setSecretariaModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Secretaria
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingSecretarias ? (
                  <p>Carregando secretarias...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Criado em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {secretarias.map((secretaria) => (
                        <TableRow key={secretaria.id}>
                          <TableCell className="font-medium">{secretaria.nome}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {secretaria.descricao || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={secretaria.ativo ? "default" : "secondary"}>
                              {secretaria.ativo ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(secretaria.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditSecretaria(secretaria)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir secretaria</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir "{secretaria.nome}"? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteSecretaria(secretaria.id)}>
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tipos-equipamento">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Tipos de Equipamento</CardTitle>
                    <CardDescription>
                      Gerencie os tipos de equipamento disponíveis no sistema
                    </CardDescription>
                  </div>
                  <Button onClick={() => setTipoModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Tipo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Carregando tipos...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ícone</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Criado em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tipos.map((tipo) => {
                        const IconComponent = getIconComponent(tipo.icone);
                        return (
                          <TableRow key={tipo.id}>
                            <TableCell>
                              <IconComponent className="w-5 h-5" />
                            </TableCell>
                            <TableCell className="font-medium">{tipo.nome}</TableCell>
                            <TableCell>
                              <Badge variant={tipo.ativo ? "default" : "secondary"}>
                                {tipo.ativo ? "Ativo" : "Inativo"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(tipo.created_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell className="text-right">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir tipo de equipamento</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o tipo "{tipo.nome}"? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteTipo(tipo.id)}>
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <TipoEquipamentoModal
          open={tipoModalOpen}
          onOpenChange={setTipoModalOpen}
          onSubmit={handleTipoModalSubmit}
        />

        <SecretariaModal
          open={secretariaModalOpen}
          onOpenChange={handleCloseSecretariaModal}
          secretaria={selectedSecretaria}
          onSubmit={handleSecretariaModalSubmit}
        />
      </div>
    </Layout>
  );
};

export default Configuracoes;