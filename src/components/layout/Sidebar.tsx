import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Computer, ArrowRightLeft, FileText, Settings, BarChart3, Users, HelpCircle, LogOut, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
const Sidebar = () => {
  const location = useLocation();
  const {
    logout,
    profile
  } = useAuth();
  const principalItems = [{
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/dashboard'
  }];
  const patrimonioItems = [{
    icon: Computer,
    label: 'Patrimônio',
    path: '/patrimonio'
  }, {
    icon: ArrowRightLeft,
    label: 'Movimentações',
    path: '/movimentacoes'
  }, {
    icon: MapPin,
    label: 'Localizações',
    path: '/localizacoes'
  }, {
    icon: FileText,
    label: 'Relatórios',
    path: '/relatorios'
  }];
  const sistemaItems = [];
  console.log('Profile in sidebar:', profile);
  console.log('Profile role:', profile?.role);
  if (profile?.role === 'admin') {
    console.log('User is admin - showing admin menu items');
    sistemaItems.push({
      icon: Settings,
      label: 'Configurações',
      path: '/configuracoes'
    }, {
      icon: BarChart3,
      label: 'Estatísticas',
      path: '/estatisticas'
    }, {
      icon: Users,
      label: 'Usuários',
      path: '/usuarios'
    });
  } else {
    console.log('User is not admin or profile not loaded');
  }
  const suporteItems = [{
    icon: HelpCircle,
    label: 'Ajuda',
    path: '/ajuda'
  }];
  const MenuItem = ({
    item,
    isActive
  }: {
    item: any;
    isActive: boolean;
  }) => {
    const Icon = item.icon;
    return <a href={item.path} className={cn("flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm transition-colors", isActive ? "bg-green-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white")}>
        <Icon className="w-4 h-4" />
        <span>{item.label}</span>
      </a>;
  };
  const SectionTitle = ({
    title
  }: {
    title: string;
  }) => <div className="px-4 py-2">
      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</h3>
    </div>;
  return <div className="w-56 bg-slate-800 text-white min-h-screen flex flex-col">
      {/* Header do Sidebar */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
            <Computer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm">SIPAT</h2>
            <p className="text-xs text-slate-400">Sistema de Patrimônio</p>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          Município de Chapadão do Sul - MS
        </div>
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 py-4">
        <SectionTitle title="PRINCIPAL" />
        <div className="px-2 space-y-1">
          {principalItems.map(item => <MenuItem key={item.path} item={item} isActive={location.pathname === item.path} />)}
        </div>

        <div className="mt-6">
          <SectionTitle title="PATRIMÔNIO" />
          <div className="px-2 space-y-1">
            {patrimonioItems.map(item => <MenuItem key={item.path} item={item} isActive={location.pathname === item.path} />)}
          </div>
        </div>

        {sistemaItems.length > 0 && <div className="mt-6">
            <SectionTitle title="SISTEMA" />
            <div className="px-2 space-y-1">
              {sistemaItems.map(item => <MenuItem key={item.path} item={item} isActive={location.pathname === item.path} />)}
            </div>
          </div>}

        <div className="mt-6">
          <SectionTitle title="SUPORTE" />
          <div className="px-2 space-y-1">
            {suporteItems.map(item => <MenuItem key={item.path} item={item} isActive={location.pathname === item.path} />)}
          </div>
        </div>
      </nav>

      {/* Rodapé */}
      <div className="border-t border-slate-700">
        <div className="p-4">
          <div className="mb-3">
            <p className="text-sm font-medium">{profile?.nome || 'Carregando...'}</p>
            <p className="text-xs text-slate-400">{profile?.setor}</p>
            {profile?.role === 'admin' && <p className="text-xs text-green-400 font-medium">Administrador</p>}
          </div>
          
          
        </div>
        <div className="px-4 py-2 text-xs text-slate-500 border-t border-slate-700">
          v1.0 - Atualizado
        </div>
      </div>
    </div>;
};
export default Sidebar;