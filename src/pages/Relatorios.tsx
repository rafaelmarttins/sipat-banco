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
  MapPin 
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { useMovimentacoes } from '@/hooks/useMovimentacoes';
import { useUsuarios } from '@/hooks/useUsuarios';
import { useLocalizacoes } from '@/hooks/useLocalizacoes';
import { RelatorioService } from '@/utils/relatorioService';
import { toast } from 'sonner';

const Relatorios = () => {
  const { equipamentos } = useEquipamentos();
  const { movimentacoes } = useMovimentacoes();
  const { usuarios } = useUsuarios();
  const { localizacoes } = useLocalizacoes();

  const [tipoRelatorio, setTipoRelatorio] = useState('equipamentos');
  const [formato, setFormato] = useState('pdf');
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const [filtroLocalizacao, setFiltroLocalizacao] = useState('all');
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
        status: filtroStatus !== 'all' ? filtroStatus : undefined
      };

      // Filtrar dados baseado nos critérios
      let dadosFiltrados: any[] = [];
      
      switch (tipoRelatorio) {
        case 'equipamentos':
          dadosFiltrados = equipamentos.filter(eq => {
            const matchLocalizacao = filtroLocalizacao === 'all' || eq.localizacao_id === filtroLocalizacao;
            const matchStatus = filtroStatus === 'all' || eq.status === filtroStatus;
            const matchDataInicio = !dataInicio || new Date(eq.created_at) >= dataInicio;
            const matchDataFim = !dataFim || new Date(eq.created_at) <= dataFim;
            
            return matchLocalizacao && matchStatus && matchDataInicio && matchDataFim;
          });
          
          if (formato === 'pdf') {
            await RelatorioService.gerarRelatorioEquipamentosPDF(dadosFiltrados, filtros);
          } else {
            await RelatorioService.gerarRelatorioEquipamentosXLSX(dadosFiltrados, filtros);
          }
          break;
          
        case 'movimentacoes':
          dadosFiltrados = movimentacoes.filter(mov => {
            const matchDataInicio = !dataInicio || new Date(mov.data_movimentacao) >= dataInicio;
            const matchDataFim = !dataFim || new Date(mov.data_movimentacao) <= dataFim;
            
            return matchDataInicio && matchDataFim;
          });
          
          if (formato === 'pdf') {
            await RelatorioService.gerarRelatorioMovimentacoesPDF(dadosFiltrados, filtros);
          } else {
            await RelatorioService.gerarRelatorioMovimentacoesXLSX(dadosFiltrados);
          }
          break;
          
        case 'usuarios':
          dadosFiltrados = usuarios.filter(user => {
            const matchLocalizacao = filtroLocalizacao === 'all' || user.setor === filtroLocalizacao;
            return matchLocalizacao;
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
          <h1 className="text-3xl font-bold text-slate-800">Relatórios</h1>
          <p className="text-slate-600">Gere relatórios detalhados em PDF ou XLSX</p>
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
                  <p className="text-sm font-medium text-slate-600">Equipamentos</p>
                  <p className="text-xl font-bold text-slate-800">{equipamentos.length}</p>
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
                  <p className="text-sm font-medium text-slate-600">Movimentações</p>
                  <p className="text-xl font-bold text-slate-800">{movimentacoes.length}</p>
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
                  <p className="text-sm font-medium text-slate-600">Usuários</p>
                  <p className="text-xl font-bold text-slate-800">{usuarios.length}</p>
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
                  <p className="text-sm font-medium text-slate-600">Localizações</p>
                  <p className="text-xl font-bold text-slate-800">{localizacoes.length}</p>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Filtro de Data */}
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
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
                          "justify-start text-left font-normal",
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

                {/* Filtros específicos baseados no tipo */}
                {(tipoRelatorio === 'equipamentos' || tipoRelatorio === 'usuarios') && (
                  <div className="space-y-2">
                    <Label>Localização</Label>
                    <Select value={filtroLocalizacao} onValueChange={setFiltroLocalizacao}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as localizações" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as localizações</SelectItem>
                        {localizacoesOptions.map(loc => (
                          <SelectItem key={loc.id} value={loc.id}>{loc.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

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

            <Separator />

            {/* Preview e Geração */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getTipoRelatorioIcon()}
                <div>
                  <p className="font-medium">
                    Relatório de {tipoRelatorio.charAt(0).toUpperCase() + tipoRelatorio.slice(1)}
                  </p>
                  <p className="text-sm text-slate-600">
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