import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Settings, Monitor, Computer, Printer, Laptop, Zap, Tablet, Smartphone, Headphones, Router, HardDrive, Trash2 } from 'lucide-react';
import { useTiposEquipamento } from '@/hooks/useTiposEquipamento';
import { TipoEquipamentoModal } from '@/components/modals/TipoEquipamentoModal';
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
  const { tipos, loading, deleteTipo } = useTiposEquipamento();
  const [modalOpen, setModalOpen] = useState(false);
  const isAdmin = profile?.role === 'admin';

  const getIconComponent = (iconeName?: string) => {
    if (!iconeName || !(iconeName in iconComponents)) {
      return Settings;
    }
    return iconComponents[iconeName as keyof typeof iconComponents];
  };

  const handleModalSubmit = () => {
    // Refresh será feito automaticamente pelo hook
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

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Tipos de Equipamento</CardTitle>
                <CardDescription>
                  Gerencie os tipos de equipamento disponíveis no sistema
                </CardDescription>
              </div>
              <Button onClick={() => setModalOpen(true)}>
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

        <TipoEquipamentoModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSubmit={handleModalSubmit}
        />
      </div>
    </Layout>
  );
};

export default Configuracoes;