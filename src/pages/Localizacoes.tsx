import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, MapPin, Trash2, Edit } from 'lucide-react';
import { mockLocalizacoes } from '@/data/mockData';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Localizacoes = () => {
  const { profile } = useAuth();
  const [localizacoes, setLocalizacoes] = useState(mockLocalizacoes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novaLocalizacao, setNovaLocalizacao] = useState('');
  const { toast } = useToast();

  const isAdmin = profile?.role === 'admin';

  const handleAddLocalizacao = () => {
    if (novaLocalizacao.trim()) {
      setLocalizacoes([...localizacoes, novaLocalizacao.trim()]);
      setNovaLocalizacao('');
      setIsDialogOpen(false);
      toast({
        title: "Localização adicionada",
        description: "Nova localização foi cadastrada com sucesso.",
      });
    }
  };

  const handleDeleteLocalizacao = (index: number) => {
    const novasLocalizacoes = localizacoes.filter((_, i) => i !== index);
    setLocalizacoes(novasLocalizacoes);
    toast({
      title: "Localização removida",
      description: "A localização foi removida com sucesso.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Localizações</h1>
            <p className="text-slate-600">Gerenciar localizações disponíveis</p>
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
              {localizacoes.length} localizações disponíveis
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
                  {localizacoes.map((localizacao, index) => (
                    <TableRow key={index} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{localizacao}</span>
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
                              onClick={() => handleDeleteLocalizacao(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
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