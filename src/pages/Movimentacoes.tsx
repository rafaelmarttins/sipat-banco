
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowRightLeft, Plus, Calendar, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useMovimentacoes } from '@/hooks/useMovimentacoes';
import { format } from 'date-fns';

const Movimentacoes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { movimentacoes, loading } = useMovimentacoes();

  const filteredMovimentacoes = movimentacoes.filter(movimentacao =>
    searchTerm === '' ||
    (movimentacao.equipamento?.modelo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (movimentacao.equipamento?.patrimonio?.toString() || '').includes(searchTerm) ||
    (movimentacao.localizacao_origem?.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (movimentacao.localizacao_destino?.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (movimentacao.secretaria_origem?.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (movimentacao.secretaria_destino?.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (movimentacao.responsavel?.nome || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredMovimentacoes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMovimentacoes = filteredMovimentacoes.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calcular estatísticas
  const totalMovimentacoes = movimentacoes.length;
  const movimentacoesEsteMes = movimentacoes.filter(m => {
    const dataMovimentacao = new Date(m.data_movimentacao);
    const agora = new Date();
    return dataMovimentacao.getMonth() === agora.getMonth() && 
           dataMovimentacao.getFullYear() === agora.getFullYear();
  }).length;
  
  const setoresUnicos = new Set([
    ...movimentacoes.map(m => m.localizacao_origem?.nome).filter(Boolean),
    ...movimentacoes.map(m => m.localizacao_destino?.nome).filter(Boolean)
  ]).size;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Movimentações</h1>
          <p className="text-muted-foreground dark:text-white/90">Histórico de movimentações entre setores</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-950/50 mr-4">
                <ArrowRightLeft className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground dark:text-white/70">Total de Movimentações</p>
                <p className="text-2xl font-bold text-foreground dark:text-white">{totalMovimentacoes}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full p-3 bg-green-100 dark:bg-green-950/50 mr-4">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground dark:text-white/70">Este Mês</p>
                <p className="text-2xl font-bold text-foreground dark:text-white">{movimentacoesEsteMes}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full p-3 bg-purple-100 dark:bg-purple-950/50 mr-4">
                <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground dark:text-white/70">Setores Envolvidos</p>
                <p className="text-2xl font-bold text-foreground dark:text-white">{setoresUnicos}</p>
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
              {loading ? 'Carregando...' : `${filteredMovimentacoes.length} movimentações encontradas${filteredMovimentacoes.length > itemsPerPage ? ` - Página ${currentPage} de ${totalPages}` : ''}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Equipamento</TableHead>
                      <TableHead>Patrimônio</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Secretaria</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Motivo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                          Carregando movimentações...
                        </TableCell>
                      </TableRow>
                    ) : filteredMovimentacoes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                          Nenhuma movimentação encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedMovimentacoes.map((movimentacao) => (
                        <TableRow key={movimentacao.id} className="hover:bg-muted/50 dark:hover:bg-muted/20">
                          <TableCell className="font-medium">
                            {format(new Date(movimentacao.data_movimentacao), "dd/MM/yyyy HH:mm")}
                          </TableCell>
                          <TableCell>{movimentacao.equipamento?.modelo || 'N/A'}</TableCell>
                          <TableCell className="font-mono text-blue-600">
                            #{movimentacao.equipamento?.patrimonio || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-red-600 border-red-600">
                                  {movimentacao.localizacao_origem?.nome || 'N/A'}
                                </Badge>
                                <span className="text-xs text-slate-500">→</span>
                                <Badge className="bg-green-600 hover:bg-green-700">
                                  {movimentacao.localizacao_destino?.nome || 'N/A'}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {(movimentacao.secretaria_origem?.nome || movimentacao.secretaria_destino?.nome) && (
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                                    {movimentacao.secretaria_origem?.nome || 'N/A'}
                                  </Badge>
                                  <span className="text-xs text-slate-500">→</span>
                                  <Badge className="bg-orange-600 hover:bg-orange-700">
                                    {movimentacao.secretaria_destino?.nome || 'N/A'}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{movimentacao.responsavel?.nome || 'N/A'}</TableCell>
                          <TableCell className="max-w-xs">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="truncate cursor-help">
                                  {movimentacao.motivo}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-md">
                                <p>{movimentacao.motivo}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              {filteredMovimentacoes.length > itemsPerPage && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TooltipProvider>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Movimentacoes;
