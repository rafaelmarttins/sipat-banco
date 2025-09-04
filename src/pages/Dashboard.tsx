
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Computer, Monitor, Printer, Calculator, Users, Clock, FileText, Laptop, Zap, Plus, Edit, BarChart3, MapPin,
  TrendingUp, TrendingDown, Minus, Wifi, WifiOff, RefreshCw, Bell,
  AlertCircle, CheckCircle, Info, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { useMovimentacoes } from '@/hooks/useMovimentacoes';
import { useLocalizacoes } from '@/hooks/useLocalizacoes';
import Layout from '@/components/layout/Layout';

// Hook para status online
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Hook para perfil do usuário
const usePerfil = () => {
  const [perfil, setPerfil] = useState(() => {
    try {
      const dadosPerfil = localStorage.getItem('perfil-usuario');
      if (dadosPerfil) {
        const parsed = JSON.parse(dadosPerfil);
        const nomeCompleto = parsed.dadosPessoais?.nome || '';
        
        return {
          nome: nomeCompleto,
          cargo: parsed.dadosPessoais?.cargo || 'Servidor Municipal',
          ultimoAcesso: parsed.ultimaAtualizacao || new Date().toISOString()
        };
      }
      
      return {
        nome: '',
        cargo: 'Servidor Municipal',
        ultimoAcesso: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      return {
        nome: '',
        cargo: 'Servidor Municipal',
        ultimoAcesso: new Date().toISOString()
      };
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const dadosPerfil = localStorage.getItem('perfil-usuario');
        if (dadosPerfil) {
          const parsed = JSON.parse(dadosPerfil);
          const nomeCompleto = parsed.dadosPessoais?.nome || '';
          
          setPerfil({
            nome: nomeCompleto,
            cargo: parsed.dadosPessoais?.cargo || 'Servidor Municipal',
            ultimoAcesso: parsed.ultimaAtualizacao || new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profile-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profile-updated', handleStorageChange);
    };
  }, []);
  
  return perfil;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { equipamentos } = useEquipamentos();
  const { movimentacoes } = useMovimentacoes();
  const { localizacoes } = useLocalizacoes();
  const perfil = usePerfil();
  const isOnline = useOnlineStatus();
  
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(new Date());
  
  const totalEquipamentos = equipamentos.length;
  const totalSetores = localizacoes.length;
  
  // Cálculos memoizados para performance
  const estatisticas = useMemo(() => {
    const equipamentosPorTipo = {
      pc: equipamentos.filter(e => e.modelo === 'PC').length,
      monitor: equipamentos.filter(e => e.modelo === 'Monitor').length,
      impressora: equipamentos.filter(e => e.modelo === 'Impressora').length,
      notebook: equipamentos.filter(e => e.modelo === 'Notebook').length,
      nobreak: equipamentos.filter(e => e.modelo === 'Nobreak').length,
    };

    const agora = new Date();
    const movimentacoesEsteMes = movimentacoes.filter(m => {
      const dataMovimentacao = new Date(m.data_movimentacao);
      return dataMovimentacao.getMonth() === agora.getMonth() && 
             dataMovimentacao.getFullYear() === agora.getFullYear();
    }).length;

    const movimentacoesRecentes = movimentacoes.slice(0, 5);

    return {
      equipamentosPorTipo,
      movimentacoesEsteMes,
      movimentacoesRecentes
    };
  }, [equipamentos, movimentacoes]);

  // Função para saudação personalizada
  const obterSaudacao = useCallback(() => {
    const agora = new Date();
    const hora = agora.getHours();
    const nomeUsuario = perfil?.nome || 'Servidor';
    
    let saudacao = '';
    if (hora < 12) {
      saudacao = 'Bom dia';
    } else if (hora < 18) {
      saudacao = 'Boa tarde';
    } else {
      saudacao = 'Boa noite';
    }
    
    return `${saudacao}, ${nomeUsuario}!`;
  }, [perfil?.nome]);

  const atualizarDados = useCallback(() => {
    setUltimaAtualizacao(new Date());
    // Aqui você pode adicionar lógica para refetch dos dados se necessário
  }, []);

  return (
    <Layout>
      <div className="space-y-8 font-sans" role="main" aria-label="Dashboard principal">
        {/* Status de Conexão */}
        {!isOnline && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 flex items-center gap-4 animate-fade-in">
            <div className="p-3 bg-red-200 rounded-full">
              <WifiOff className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h4 className="font-semibold text-red-900">Modo Offline</h4>
              <p className="text-sm text-red-700">Algumas funcionalidades podem estar limitadas</p>
            </div>
          </div>
        )}

        {/* Header Personalizado com Gradiente */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-8 text-white shadow-lg animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {obterSaudacao()} 
                <span className="inline-block animate-pulse ml-2">👋</span>
              </h1>
              <p className="text-blue-100 text-lg font-medium mb-1">
                Bem-vindo ao Sistema de Gestão de Patrimônio
              </p>
              {perfil?.ultimoAcesso && (
                <p className="text-blue-200 text-sm">
                  Último acesso: {new Date(perfil.ultimoAcesso).toLocaleString('pt-BR')}
                </p>
              )}
            </div>
            
            {/* Widget Status Sistema */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 min-w-[220px] border border-white/30">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">
                  {new Date().toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="text-sm text-blue-100 mb-3">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Wifi className="h-4 w-4" />
                  <span>{isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center gap-4">
              {isOnline && (
                <Button
                  onClick={atualizarDados}
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              )}
            </div>

            <div className="text-xs text-blue-200">
              Última atualização: {ultimaAtualizacao.toLocaleTimeString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Estatísticas Principais com Design Moderno */}
        <div className="grid md:grid-cols-4 gap-6">
          {/* Card Equipamentos */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Equipamentos cadastrados</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-foreground">{totalEquipamentos}</p>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-semibold">+2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card Setores */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Setores cadastrados</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-foreground">{totalSetores}</p>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-semibold">+5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Movimentações */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Movimentações este mês</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-foreground">{estatisticas.movimentacoesEsteMes}</p>
                  <div className="flex items-center gap-1 text-red-500">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-xs font-semibold">-3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card Relatórios */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Relatórios gerados</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-foreground">5</p>
                  <Badge variant="secondary" className="text-xs">
                    Este mês
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Ações Rápidas Modernizada */}
        <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
          <h2 className="md:col-span-3 text-2xl font-bold text-foreground mb-2">Ações Rápidas</h2>
          
          {/* Novo Equipamento */}
          <div 
            className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md cursor-pointer group transition-all duration-300"
            onClick={() => navigate('/patrimonio')}
            role="button"
            tabIndex={0}
            aria-label="Cadastrar novo equipamento"
            onKeyDown={(e) => e.key === 'Enter' && navigate('/patrimonio')}
          >
            <div className="flex items-center mb-4">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-foreground">Novo Equipamento</h3>
                <p className="text-sm text-muted-foreground">Cadastrar novo item</p>
              </div>
            </div>
          </div>

          {/* Nova Localização */}
          <div 
            className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md cursor-pointer group transition-all duration-300"
            onClick={() => navigate('/localizacoes')}
            role="button"
            tabIndex={0}
            aria-label="Cadastrar nova localização"
            onKeyDown={(e) => e.key === 'Enter' && navigate('/localizacoes')}
          >
            <div className="flex items-center mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-foreground">Nova Localização</h3>
                <p className="text-sm text-muted-foreground">Cadastrar novo setor</p>
              </div>
            </div>
          </div>

          {/* Relatórios */}
          <div 
            className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md cursor-pointer group transition-all duration-300"
            onClick={() => navigate('/relatorios')}
            role="button"
            tabIndex={0}
            aria-label="Gerar relatórios"
            onKeyDown={(e) => e.key === 'Enter' && navigate('/relatorios')}
          >
            <div className="flex items-center mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-foreground">Relatórios</h3>
                <p className="text-sm text-muted-foreground">Análises e estatísticas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo por Categoria Modernizado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Computer className="h-6 w-6 text-primary" />
              Equipamentos por Categoria
            </h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-200 rounded-lg">
                      <Computer className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-blue-900">Computadores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {estatisticas.equipamentosPorTipo.pc}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-200 rounded-lg">
                      <Monitor className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium text-green-900">Monitores</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {estatisticas.equipamentosPorTipo.monitor}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-200 rounded-lg">
                      <Printer className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium text-purple-900">Impressoras</span>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {estatisticas.equipamentosPorTipo.impressora}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-200 rounded-lg">
                      <Laptop className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="font-medium text-indigo-900">Notebooks</span>
                  </div>
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                    {estatisticas.equipamentosPorTipo.notebook}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-200 rounded-lg">
                      <Zap className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-medium text-amber-900">Nobreaks</span>
                  </div>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    {estatisticas.equipamentosPorTipo.nobreak}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary" />
              Movimentações Recentes
            </h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="space-y-3">
                {estatisticas.movimentacoesRecentes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p>Nenhuma movimentação recente</p>
                  </div>
                ) : (
                  estatisticas.movimentacoesRecentes.map((mov) => (
                    <div 
                      key={mov.id} 
                      className="flex items-start space-x-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl hover:shadow-sm transition-all duration-200"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm text-foreground">
                            {mov.equipamento?.modelo} #{mov.equipamento?.patrimonio}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(mov.data_movimentacao).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {mov.localizacao_origem?.nome} → {mov.localizacao_destino?.nome}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
