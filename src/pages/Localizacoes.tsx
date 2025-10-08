import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, MapPin, Trash2, Edit } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalizacoes } from '@/hooks/useLocalizacoes';

const Localizacoes = () => {
  const { profile } = useAuth();
  const { localizacoes, loading, addLocalizacao, deleteLocalizacao } = useLocalizacoes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novaLocalizacao, setNovaLocalizacao] = useState('');

  const isAdmin = profile?.role === 'admin';

  const handleAddLocalizacao = async () => {
    if (novaLocalizacao.trim()) {
      const result = await addLocalizacao(novaLocalizacao);
      if (result.success) {
        setNovaLocalizacao('');
        setIsDialogOpen(false);
      }
    }
  };

  const handleDeleteLocalizacao = async (id: string) => {
    await deleteLocalizacao(id);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Localizações</h1>
            <p className="text-muted-foreground dark:text-white/90">Gerenciar localizações disponíveis</p>
          </div>
          {isAdmin && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Localização
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nova Localização</DialogTitle>
                <DialogDescription>
                  Adicione uma nova localização ao sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nome" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="nome"
                    value={novaLocalizacao}
                    onChange={(e) => setNovaLocalizacao(e.target.value)}
                    className="col-span-3"
                    placeholder="Digite o nome da localização"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddLocalizacao}>
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Localizações Cadastradas</CardTitle>
            <CardDescription>
              {loading ? 'Carregando...' : `${localizacoes.length} localizações disponíveis`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Localização</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-slate-500">
                        Carregando localizações...
                      </TableCell>
                    </TableRow>
                  ) : localizacoes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-slate-500">
                        Nenhuma localização cadastrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    localizacoes.map((localizacao) => (
                      <TableRow key={localizacao.id} className="hover:bg-muted/50 dark:hover:bg-muted/20">
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{localizacao.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isAdmin && (
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteLocalizacao(localizacao.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Localizacoes;