
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRightLeft, Plus, Calendar, User } from 'lucide-react';
import { mockMovimentacoes } from '@/data/mockData';
import Layout from '@/components/layout/Layout';

const Movimentacoes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMovimentacoes = mockMovimentacoes.filter(movimentacao =>
    searchTerm === '' ||
    movimentacao.equipamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimentacao.patrimonio.toString().includes(searchTerm) ||
    movimentacao.setorOrigem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimentacao.setorDestino.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimentacao.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Movimentações</h1>
          <p className="text-slate-600">Histórico de movimentações entre setores</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full p-3 bg-blue-100 mr-4">
                <ArrowRightLeft className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Movimentações</p>
                <p className="text-2xl font-bold text-slate-800">{mockMovimentacoes.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full p-3 bg-green-100 mr-4">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Este Mês</p>
                <p className="text-2xl font-bold text-slate-800">3</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full p-3 bg-purple-100 mr-4">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Setores Envolvidos</p>
                <p className="text-2xl font-bold text-slate-800">5</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Buscar Movimentações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input
                placeholder="Buscar por equipamento, patrimônio, setor ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Filtrar por Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Movimentações */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Movimentações</CardTitle>
            <CardDescription>
              {filteredMovimentacoes.length} movimentações encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>Patrimônio</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Motivo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovimentacoes.map((movimentacao) => (
                    <TableRow key={movimentacao.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">
                        {new Date(movimentacao.dataMovimentacao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{movimentacao.equipamento}</TableCell>
                      <TableCell className="font-mono text-blue-600">
                        #{movimentacao.patrimonio}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          {movimentacao.setorOrigem}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-600 hover:bg-green-700">
                          {movimentacao.setorDestino}
                        </Badge>
                      </TableCell>
                      <TableCell>{movimentacao.responsavel}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {movimentacao.motivo}
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

export default Movimentacoes;
