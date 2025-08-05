
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Filter, Plus, Computer, Monitor, Printer, CalendarIcon, Eye, Edit, Trash2, Laptop } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import EquipamentoForm from '@/components/forms/EquipamentoForm';
import EquipamentoDetailsModal from '@/components/modals/EquipamentoDetailsModal';
import EditEquipamentoModal from '@/components/modals/EditEquipamentoModal';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useEquipamentos, Equipamento } from '@/hooks/useEquipamentos';

const Patrimonio = () => {
  const { profile } = useAuth();
  const { equipamentos, loading, toggleStatusEquipamento, updateEquipamento } = useEquipamentos();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSetor, setFilterSetor] = useState('all');
  const [filterTipo, setFilterTipo] = useState('all');
  const [filterEstado, setFilterEstado] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEquipamento, setSelectedEquipamento] = useState<Equipamento | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isAdmin = profile?.role === 'admin';

  const setores = [...new Set(equipamentos.map(e => e.setor))];
  const tipos = [...new Set(equipamentos.map(e => e.modelo))];

  const filteredEquipamentos = equipamentos.filter(equipamento => {
    const matchSearch = searchTerm === '' || 
      equipamento.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipamento.processado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipamento.patrimonio.toString().includes(searchTerm);
    
    const matchTipo = filterTipo === 'all' || equipamento.modelo === filterTipo;
    const matchEstado = filterEstado === 'all' || equipamento.estado_conservacao === filterEstado;
    const matchStatus = filterStatus === 'all' || equipamento.status === filterStatus;
    
    const equipamentoDate = new Date(equipamento.created_at);
    const matchDataInicio = !dataInicio || equipamentoDate >= dataInicio;
    const matchDataFim = !dataFim || equipamentoDate <= dataFim;

    return matchSearch && matchTipo && matchEstado && matchStatus && matchDataInicio && matchDataFim;
  });

  const handleAddEquipamento = () => {
    // Recarrega a lista após adicionar equipamento
    setIsFormOpen(false);
  };

  const handleEditEquipamento = async (id: string, updatedData: any) => {
    await updateEquipamento(id, updatedData);
    setIsEditModalOpen(false);
  };

  const handleDesactivateEquipamento = async (id: string) => {
    await toggleStatusEquipamento(id);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterTipo('all');
    setFilterEstado('all');
    setFilterStatus('all');
    setDataInicio(undefined);
    setDataFim(undefined);
  };

  const handleViewEquipamento = (equipamento: Equipamento) => {
    setSelectedEquipamento(equipamento);
    setIsDetailsModalOpen(true);
  };

  const handleEditClick = (equipamento: Equipamento) => {
    setSelectedEquipamento(equipamento);
    setIsEditModalOpen(true);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Meia-vida':
        return <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white">Meia-vida</Badge>;
      case 'Fim-da-vida':
        return <Badge variant="destructive">Fim-da-vida</Badge>;
      case 'Conservado':
        return <Badge className="bg-green-600 hover:bg-green-700">Conservado</Badge>;
      case 'Novo':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Novo</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'Ativo' 
      ? <Badge className="bg-green-600 hover:bg-green-700">Ativo</Badge>
      : <Badge variant="destructive">Desativado</Badge>;
  };

  const getIconForType = (tipo: string) => {
    switch (tipo) {
      case 'PC':
        return <Computer className="w-4 h-4" />;
      case 'Monitor':
        return <Monitor className="w-4 h-4" />;
      case 'Impressora':
        return <Printer className="w-4 h-4" />;
      case 'Nobreak':
        return <Computer className="w-4 h-4" />;
      case 'Notebook':
        return <Laptop className="w-4 h-4" />;
      default:
        return <Computer className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Patrimônio</h1>
            <p className="text-slate-600">Gestão de equipamentos de informática</p>
          </div>
          {isAdmin && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsFormOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Equipamento
            </Button>
          )}
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Buscar equipamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  {tipos.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Estados</SelectItem>
                  <SelectItem value="Novo">Novo</SelectItem>
                  <SelectItem value="Conservado">Conservado</SelectItem>
                  <SelectItem value="Meia-vida">Meia-vida</SelectItem>
                  <SelectItem value="Fim-da-vida">Fim-da-vida</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Desativado">Desativado</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !dataInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Data Início"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataInicio}
                    onSelect={setDataInicio}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !dataFim && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? format(dataFim, "dd/MM/yyyy") : "Data Fim"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataFim}
                    onSelect={setDataFim}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <Button variant="outline" onClick={handleClearFilters}>
                <Filter className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Equipamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Equipamentos Cadastrados</CardTitle>
            <CardDescription>
              {loading ? 'Carregando...' : `${filteredEquipamentos.length} equipamentos encontrados`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patrimônio</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Modelo/Processador</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                        Carregando equipamentos...
                      </TableCell>
                    </TableRow>
                  ) : filteredEquipamentos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                        Nenhum equipamento encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEquipamentos.map((equipamento) => (
                      <TableRow key={equipamento.id} className="hover:bg-slate-50">
                        <TableCell className="font-mono text-blue-600 font-bold">
                          #{equipamento.patrimonio}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getIconForType(equipamento.modelo)}
                            <span className="font-medium">{equipamento.modelo}</span>
                          </div>
                        </TableCell>
                        <TableCell>{equipamento.processado}</TableCell>
                        <TableCell>{equipamento.setor}</TableCell>
                        <TableCell>{equipamento.localizacao?.nome || 'N/A'}</TableCell>
                        <TableCell>{getEstadoBadge(equipamento.estado_conservacao)}</TableCell>
                        <TableCell>{getStatusBadge(equipamento.status)}</TableCell>
                        <TableCell>{format(new Date(equipamento.created_at), "dd/MM/yyyy")}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewEquipamento(equipamento)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {isAdmin && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditClick(equipamento)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className={equipamento.status === 'Ativo' ? 'hover:bg-red-50' : 'hover:bg-green-50'}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        {equipamento.status === 'Ativo' ? 'Desativar' : 'Ativar'} Equipamento
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja {equipamento.status === 'Ativo' ? 'desativar' : 'ativar'} o equipamento 
                                        #{equipamento.patrimonio}? {equipamento.status === 'Ativo' 
                                          ? 'Ele ficará inativo no sistema.' 
                                          : 'Ele voltará a ficar ativo no sistema.'}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDesactivateEquipamento(equipamento.id)}>
                                        {equipamento.status === 'Ativo' ? 'Desativar' : 'Ativar'}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                          </div>
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

      <EquipamentoForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAddEquipamento}
      />

      <EquipamentoDetailsModal
        equipamento={selectedEquipamento as any}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
      />

      <EditEquipamentoModal
        equipamento={selectedEquipamento as any}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleEditEquipamento}
      />
    </Layout>
  );
};

export default Patrimonio;
