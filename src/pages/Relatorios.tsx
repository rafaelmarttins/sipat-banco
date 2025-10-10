import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  CalendarIcon, 
  Users, 
  Monitor, 
  ArrowRightLeft,
  MapPin,
  Building2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { useMovimentacoes } from '@/hooks/useMovimentacoes';
import { useUsuarios } from '@/hooks/useUsuarios';
import { useLocalizacoes } from '@/hooks/useLocalizacoes';
import { useSecretarias } from '@/hooks/useSecretarias';
import { RelatorioService } from '@/utils/relatorioService';
import { toast } from 'sonner';

const Relatorios = () => {
  const { equipamentos } = useEquipamentos();
  const { movimentacoes } = useMovimentacoes();
  const { usuarios } = useUsuarios();
  const { localizacoes } = useLocalizacoes();
  const { secretarias } = useSecretarias();

  const [tipoRelatorio, setTipoRelatorio] = useState('equipamentos');
  const [formato, setFormato] = useState('pdf');
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const [filtroLocalizacao, setFiltroLocalizacao] = useState('all');
  const [filtroSecretaria, setFiltroSecretaria] = useState('all');
  const [filtroStatus, setFiltroStatus] = useState('all');
  const [gerando, setGerando] = useState(false);
  // Obter localizações para filtro
  const localizacoesOptions = localizacoes;

  const handleGerarRelatorio = async () => {
    try {
      setGerando(true);
      
      const filtros = {
        dataInicio,
        dataFim,
        localizacao: filtroLocalizacao !== 'all' ? filtroLocalizacao : undefined,
        secretaria: filtroSecretaria !== 'all' ? filtroSecretaria : undefined,
        status: filtroStatus !== 'all' ? filtroStatus : undefined
      };

      // Filtrar dados baseado nos critérios
      let dadosFiltrados: any[] = [];
      
      switch (tipoRelatorio) {
        case 'equipamentos':
          dadosFiltrados = equipamentos.filter(eq => {
            const matchLocalizacao = filtroLocalizacao === 'all' || eq.localizacao_id === filtroLocalizacao;
            const matchSecretaria = filtroSecretaria === 'all' || eq.secretaria_id === filtroSecretaria;
            const matchStatus = filtroStatus === 'all' || eq.status === filtroStatus;
            const matchDataInicio = !dataInicio || new Date(eq.created_at) >= dataInicio;
            const matchDataFim = !dataFim || new Date(eq.created_at) <= dataFim;
            
            return matchLocalizacao && matchSecretaria && matchStatus && matchDataInicio && matchDataFim;
          });
          
          if (formato === 'pdf') {
            await RelatorioService.gerarRelatorioEquipamentosPDF(dadosFiltrados, filtros);
          } else {
            await RelatorioService.gerarRelatorioEquipamentosXLSX(dadosFiltrados, filtros);
          }
          break;
          
        case 'movimentacoes':
          dadosFiltrados = movimentacoes.filter(mov => {
            const matchSecretariaOrigem = filtroSecretaria === 'all' || mov.secretaria_origem?.id === filtroSecretaria;
            const matchSecretariaDestino = filtroSecretaria === 'all' || mov.secretaria_destino?.id === filtroSecretaria;
            const matchSecretaria = filtroSecretaria === 'all' || matchSecretariaOrigem || matchSecretariaDestino;
            const matchDataInicio = !dataInicio || new Date(mov.data_movimentacao) >= dataInicio;
            const matchDataFim = !dataFim || new Date(mov.data_movimentacao) <= dataFim;
            
            return matchSecretaria && matchDataInicio && matchDataFim;
          });
          
          if (formato === 'pdf') {
            await RelatorioService.gerarRelatorioMovimentacoesPDF(dadosFiltrados, filtros);
          } else {
            await RelatorioService.gerarRelatorioMovimentacoesXLSX(dadosFiltrados);
          }
          break;
          
        case 'usuarios':
          dadosFiltrados = usuarios.filter(user => {
            const matchLocalizacao = filtroLocalizacao === 'all' || user.localizacao === filtroLocalizacao;
            const matchSecretaria = filtroSecretaria === 'all'; // Users don't have secretaria in current interface
            return matchLocalizacao && matchSecretaria;
          });
          
          if (formato === 'pdf') {
            await RelatorioService.gerarRelatorioUsuariosPDF(dadosFiltrados);
          } else {
            await RelatorioService.gerarRelatorioUsuariosXLSX(dadosFiltrados);
          }
          break;
      }

      toast.success(`Relatório ${formato.toUpperCase()} gerado com sucesso!`);
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setGerando(false);
    }
  };

  const getTipoRelatorioIcon = () => {
    switch (tipoRelatorio) {
      case 'equipamentos': return <Monitor className="w-5 h-5" />;
      case 'movimentacoes': return <ArrowRightLeft className="w-5 h-5" />;
      case 'usuarios': return <Users className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getContadorDados = () => {
    switch (tipoRelatorio) {
      case 'equipamentos': return equipamentos.length;
      case 'movimentacoes': return movimentacoes.length;
      case 'usuarios': return usuarios.length;
      default: return 0;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">Gere relatórios detalhados em PDF ou XLSX</p>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Equipamentos</p>
                  <p className="text-xl font-bold text-foreground">{equipamentos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ArrowRightLeft className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Movimentações</p>
                  <p className="text-xl font-bold text-foreground">{movimentacoes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usuários</p>
                  <p className="text-xl font-bold text-foreground">{usuarios.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Localizações</p>
                  <p className="text-xl font-bold text-foreground">{localizacoes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gerador de Relatórios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Gerador de Relatórios</span>
            </CardTitle>
            <CardDescription>
              Configure os parâmetros e gere relatórios personalizados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Configurações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Relatório</Label>
                <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equipamentos">Equipamentos</SelectItem>
                    <SelectItem value="movimentacoes">Movimentações</SelectItem>
                    <SelectItem value="usuarios">Usuários</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="formato">Formato</Label>
                <Select value={formato} onValueChange={setFormato}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="xlsx">XLSX (Excel)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Filtros */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Filtros</h3>
              
              {/* Filtros de Data */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Período</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data Início</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dataInicio && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Selecionar"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dataInicio}
                          onSelect={setDataInicio}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Data Fim</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dataFim && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataFim ? format(dataFim, "dd/MM/yyyy") : "Selecionar"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dataFim}
                          onSelect={setDataFim}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Filtros por Categoria */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Filtros por Categoria</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Filtro de Localização */}
                  {(tipoRelatorio === 'equipamentos' || tipoRelatorio === 'usuarios') && (
                    <div className="space-y-2">
                      <Label className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>Localização</span>
                      </Label>
                      <Select value={filtroLocalizacao} onValueChange={setFiltroLocalizacao}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas as localizações" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as localizações</SelectItem>
                          {localizacoes.map(loc => (
                            <SelectItem key={loc.id} value={loc.id}>{loc.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Filtro de Secretaria */}
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4" />
                      <span>Secretaria</span>
                    </Label>
                    <Select value={filtroSecretaria} onValueChange={setFiltroSecretaria}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as secretarias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as secretarias</SelectItem>
                        {secretarias.map(sec => (
                          <SelectItem key={sec.id} value={sec.id}>{sec.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filtro de Status */}
                  {tipoRelatorio === 'equipamentos' && (
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os status</SelectItem>
                          <SelectItem value="Ativo">Ativo</SelectItem>
                          <SelectItem value="Desativado">Desativado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* Filtros Ativos */}
              {(dataInicio || dataFim || filtroLocalizacao !== 'all' || filtroSecretaria !== 'all' || filtroStatus !== 'all') && (
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Filtros Aplicados:</h4>
                  <div className="flex flex-wrap gap-2">
                    {dataInicio && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100">
                        Início: {format(dataInicio, "dd/MM/yyyy")}
                      </span>
                    )}
                    {dataFim && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100">
                        Fim: {format(dataFim, "dd/MM/yyyy")}
                      </span>
                    )}
                    {filtroLocalizacao !== 'all' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100">
                        Localização: {localizacoes.find(l => l.id === filtroLocalizacao)?.nome}
                      </span>
                    )}
                    {filtroSecretaria !== 'all' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100">
                        Secretaria: {secretarias.find(s => s.id === filtroSecretaria)?.nome}
                      </span>
                    )}
                    {filtroStatus !== 'all' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100">
                        Status: {filtroStatus}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Preview e Geração */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getTipoRelatorioIcon()}
                <div>
                  <p className="font-medium text-foreground">
                    Relatório de {tipoRelatorio.charAt(0).toUpperCase() + tipoRelatorio.slice(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {getContadorDados()} registros • Formato {formato.toUpperCase()}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleGerarRelatorio}
                disabled={gerando}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {gerando ? (
                  <>Gerando...</>
                ) : (
                  <>
                    {formato === 'pdf' ? <FileText className="w-4 h-4 mr-2" /> : <FileSpreadsheet className="w-4 h-4 mr-2" />}
                    <Download className="w-4 h-4 mr-2" />
                    Gerar {formato.toUpperCase()}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Relatorios;