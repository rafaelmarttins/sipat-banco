import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Computer, ArrowRightLeft, FileText, Settings, BarChart3, Users, HelpCircle, MapPin, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}
const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed
}) => {
  const location = useLocation();
  const {
    profile,
    logout
  } = useAuth();
  const principalItems = [{
    icon: Home,
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
  const MenuItem = ({
    item,
    isActive
  }: {
    item: any;
    isActive: boolean;
  }) => {
    const Icon = item.icon;
    return <a href={item.path} className={cn("flex items-center w-full text-left space-x-3 py-3 px-4 rounded-full text-sm font-medium transition-all duration-200 group mb-1", isActive ? "bg-green-500 text-white shadow-lg" : "text-slate-300 hover:bg-slate-700/50 hover:text-white", isCollapsed && "justify-center px-2 rounded-lg")} title={isCollapsed ? item.label : undefined}>
        <Icon className={cn("w-4 h-4 flex-shrink-0", isCollapsed && "w-5 h-5")} />
        <span className={cn("transition-all duration-200", isCollapsed && "sr-only")}>
          {item.label}
        </span>
      </a>;
  };
  const SectionTitle = ({
    title
  }: {
    title: string;
  }) => <div className={cn("py-2", isCollapsed && "px-2")}>
      {!isCollapsed && <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {title}
        </h3>}
      {isCollapsed && <div className="h-px bg-slate-700 mx-2"></div>}
    </div>;
  return <div className={cn("bg-slate-800 text-white h-screen flex flex-col transition-all duration-300 relative", isCollapsed ? "w-16" : "w-56")}>
      {/* Botão para recolher/expandir */}
      <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white border-2 border-slate-800 text-slate-800 hover:bg-slate-100 transition-all duration-200 flex items-center justify-center shadow-md z-10 py-0 my-[80px]">
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>


      {/* Menu Principal */}
      <nav className="flex-1 py-6 px-3 flex flex-col">{/* Removido overflow-y-auto */}
        <SectionTitle title="PRINCIPAL" />
        <div className={cn("space-y-1", isCollapsed && "px-1")}>
          {principalItems.map(item => <MenuItem key={item.path} item={item} isActive={location.pathname === item.path} />)}
        </div>

        <div className="mt-6">
          <SectionTitle title="PATRIMÔNIO" />
          <div className={cn("space-y-1", isCollapsed && "px-1")}>
            {patrimonioItems.map(item => <MenuItem key={item.path} item={item} isActive={location.pathname === item.path} />)}
          </div>
        </div>

        {sistemaItems.length > 0 && <div className="mt-6">
            <SectionTitle title="SISTEMA" />
            <div className={cn("space-y-1", isCollapsed && "px-1")}>
              {sistemaItems.map(item => <MenuItem key={item.path} item={item} isActive={location.pathname === item.path} />)}
            </div>
          </div>}

        {/* Botões de Ajuda e Sair */}
        <div className="mt-auto">
          <div className="rounded-xl p-4 space-y-2 mx-0 bg-[313e4e] bg-[#313e4e]">
            <a href="/ajuda" className={cn("flex items-center w-full text-left space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group", location.pathname === '/ajuda' ? "bg-green-500 text-white shadow-lg" : "text-slate-300 hover:bg-slate-600/50 hover:text-white", isCollapsed && "justify-center px-2")} title={isCollapsed ? 'Ajuda' : undefined}>
              <HelpCircle className={cn("w-4 h-4 flex-shrink-0", isCollapsed && "w-5 h-5")} />
              <span className={cn("transition-all duration-200", isCollapsed && "sr-only")}>
                Ajuda
              </span>
            </a>
            
            <button onClick={logout} className={cn("flex items-center w-full text-left space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group text-red-400 hover:bg-red-500/20 hover:text-red-300", isCollapsed && "justify-center px-2")} title={isCollapsed ? 'Sair' : undefined}>
              <LogOut className={cn("w-4 h-4 flex-shrink-0", isCollapsed && "w-5 h-5")} />
              <span className={cn("transition-all duration-200", isCollapsed && "sr-only")}>
                Sair
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Rodapé */}
      <div className="pb-4">
        <div className={cn("px-4 text-xs text-slate-500 text-center", isCollapsed && "px-2")}>
          v0.1.3
        </div>
      </div>
    </div>;
};
export default Sidebar;