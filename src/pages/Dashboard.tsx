
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Computer, Monitor, Printer, Calculator, Users, Clock, FileText, Laptop, Zap, Plus, Edit, BarChart3, MapPin, RefreshCw } from 'lucide-react';
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
        {/* Header com saudação personalizada - estilo SIGEV */}
        <div className="bg-primary rounded-3xl p-8 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                Bom dia, Servidor! 
                <span className="inline-block animate-pulse ml-2">👋</span>
              </h1>
              <p className="text-primary-foreground/90 text-lg font-medium mb-1">
                Bem-vindo ao Sistema de Patrimônio. Gerencie seus equipamentos com facilidade.
              </p>
              <p className="text-primary-foreground/70 text-sm">
                Último acesso: {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            {/* Widget do relógio */}
            <div className="bg-primary-foreground/20 backdrop-blur-md rounded-2xl p-6 min-w-[220px] border border-primary-foreground/30">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">
                  {new Date().toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
                <div className="text-sm opacity-90">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Controles */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-primary-foreground/20">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm font-medium bg-primary-foreground/20 hover:bg-primary-foreground/30 px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm">
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium bg-primary-foreground/20 px-3 py-2 rounded-xl backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas - Estilo moderno */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-2">Equipamentos cadastrados</p>
                  <p className="text-3xl font-bold text-blue-900">{totalEquipamentos}</p>
                </div>
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calculator className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-2">Setores cadastrados</p>
                  <p className="text-3xl font-bold text-green-900">{totalSetores}</p>
                </div>
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-2">Movimentações este mês</p>
                  <p className="text-3xl font-bold text-purple-900">{movimentacoesEsteMes}</p>
                </div>
                <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-2">Relatórios gerados</p>
                  <p className="text-3xl font-bold text-orange-900">5</p>
                </div>
                <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-7 h-7 text-white" />
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
                className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-blue-900">Novo Equipamento</p>
                  <p className="text-sm text-blue-600">Cadastrar novo item</p>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/localizacoes')}
                className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-green-900">Nova Localização</p>
                  <p className="text-sm text-green-600">Cadastrar novo setor</p>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/relatorios')}
                className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-purple-900">Relatórios</p>
                  <p className="text-sm text-purple-600">Gerar relatórios</p>
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
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Computer className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Computadores</span>
                  </div>
                  <span className="font-bold text-blue-600">{equipamentosPorTipo.pc}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Monitor className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Monitores</span>
                  </div>
                  <span className="font-bold text-green-600">{equipamentosPorTipo.monitor}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Printer className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Impressoras</span>
                  </div>
                  <span className="font-bold text-purple-600">{equipamentosPorTipo.impressora}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Laptop className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium">Notebooks</span>
                  </div>
                  <span className="font-bold text-indigo-600">{equipamentosPorTipo.notebook}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium">Nobreaks</span>
                  </div>
                  <span className="font-bold text-yellow-600">{equipamentosPorTipo.nobreak}</span>
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
                  <p className="text-sm text-slate-500 text-center py-4">Nenhuma movimentação recente</p>
                ) : (
                  movimentacoesRecentes.map((mov) => (
                    <div key={mov.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{mov.equipamento?.modelo} #{mov.equipamento?.patrimonio}</p>
                        <p className="text-xs text-slate-500">
                          {mov.localizacao_origem?.nome} → {mov.localizacao_destino?.nome}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400">
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
