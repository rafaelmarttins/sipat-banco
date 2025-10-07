
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Computer, Monitor, Printer, Calculator, Users, Clock, FileText, Laptop, Zap, Plus, Edit, BarChart3, MapPin } from 'lucide-react';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { useMovimentacoes } from '@/hooks/useMovimentacoes';
import { useLocalizacoes } from '@/hooks/useLocalizacoes';
import Layout from '@/components/layout/Layout';

const Dashboard = () => {
  const navigate = useNavigate();
  const { equipamentos } = useEquipamentos();
  const { movimentacoes } = useMovimentacoes();
  const { localizacoes } = useLocalizacoes();
  
  const totalEquipamentos = equipamentos.length;
  
  // Calcular setores únicos (localizações cadastradas)
  const totalSetores = localizacoes.length;
  
  const equipamentosPorTipo = {
    pc: equipamentos.filter(e => e.modelo === 'PC').length,
    monitor: equipamentos.filter(e => e.modelo === 'Monitor').length,
    impressora: equipamentos.filter(e => e.modelo === 'Impressora').length,
    notebook: equipamentos.filter(e => e.modelo === 'Notebook').length,
    nobreak: equipamentos.filter(e => e.modelo === 'Nobreak').length,
  };

  // Calcular movimentações deste mês
  const agora = new Date();
  const movimentacoesEsteMes = movimentacoes.filter(m => {
    const dataMovimentacao = new Date(m.data_movimentacao);
    return dataMovimentacao.getMonth() === agora.getMonth() && 
           dataMovimentacao.getFullYear() === agora.getFullYear();
  }).length;

  const movimentacoesRecentes = movimentacoes.slice(0, 5);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema de patrimônio</p>
        </div>

        {/* Cards de Estatísticas - Estilo similar ao CEGIT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Equipamentos cadastrados</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalEquipamentos}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">Setores cadastrados</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{totalSetores}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Movimentações este mês</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{movimentacoesEsteMes}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">Relatórios gerados</p>
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">5</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => navigate('/patrimonio')}
                className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-blue-900 dark:text-blue-100">Novo Equipamento</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Cadastrar novo item</p>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/localizacoes')}
                className="flex items-center space-x-3 p-4 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-emerald-900 dark:text-emerald-100">Nova Localização</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Cadastrar novo setor</p>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/relatorios')}
                className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-purple-900 dark:text-purple-100">Relatórios</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Gerar relatórios</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Resumo por Categoria */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Equipamentos por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Computer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-foreground">Computadores</span>
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{equipamentosPorTipo.pc}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Monitor className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-medium text-foreground">Monitores</span>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{equipamentosPorTipo.monitor}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Printer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-foreground">Impressoras</span>
                  </div>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{equipamentosPorTipo.impressora}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Laptop className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-medium text-foreground">Notebooks</span>
                  </div>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{equipamentosPorTipo.notebook}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="font-medium text-foreground">Nobreaks</span>
                  </div>
                  <span className="font-bold text-yellow-600 dark:text-yellow-400">{equipamentosPorTipo.nobreak}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Movimentações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {movimentacoesRecentes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhuma movimentação recente</p>
                ) : (
                  movimentacoesRecentes.map((mov) => (
                    <div key={mov.id} className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/20 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-foreground">{mov.equipamento?.modelo} #{mov.equipamento?.patrimonio}</p>
                        <p className="text-xs text-muted-foreground">
                          {mov.localizacao_origem?.nome} → {mov.localizacao_destino?.nome}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(mov.data_movimentacao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
