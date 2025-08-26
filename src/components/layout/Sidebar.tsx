import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Computer, ArrowRightLeft, FileText, Settings, BarChart3, Users, HelpCircle, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}
const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const { profile } = useAuth();
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
  const suporteItems = [{
    icon: HelpCircle,
    label: 'Ajuda',
    path: '/ajuda'
  }];
  const MenuItem = ({ item, isActive }: { item: any; isActive: boolean }) => {
    const Icon = item.icon;
    return (
      <a 
        href={item.path}
        className={cn(
          "flex items-center w-full text-left space-x-3 px-4 py-2.5 rounded-md text-sm transition-all duration-200 group",
          isActive 
            ? "bg-green-600 text-white" 
            : "text-white hover:bg-slate-700 hover:text-white",
          isCollapsed && "justify-center px-2"
        )}
        title={isCollapsed ? item.label : undefined}
      >
        <Icon className={cn("w-4 h-4 flex-shrink-0", isCollapsed && "w-5 h-5")} />
        <span className={cn("transition-all duration-200", isCollapsed && "sr-only")}>
          {item.label}
        </span>
      </a>
    );
  };
  const SectionTitle = ({ title }: { title: string }) => (
    <div className={cn("px-4 py-2", isCollapsed && "px-2")}>
      {!isCollapsed && (
        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {isCollapsed && <div className="h-px bg-slate-700 mx-2"></div>}
    </div>
  );
  return (
    <div 
      className={cn(
        "bg-slate-800 text-white h-screen flex flex-col transition-all duration-300 relative",
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      {/* Botão para recolher/expandir */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white border-2 border-slate-800 text-slate-800 hover:bg-slate-100 transition-all duration-200 flex items-center justify-center shadow-md z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Header do Sidebar */}
      <div className={cn("p-4 border-b border-slate-700", isCollapsed && "px-2")}>
        <div className={cn("flex items-center space-x-3", isCollapsed && "justify-center space-x-0")}>
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center flex-shrink-0">
            <Computer className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-sm">SIPAT</h2>
              <p className="text-xs text-slate-400">Sistema de Patrimônio</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <div className="mt-3 text-xs text-slate-400">
            Município de Chapadão do Sul - MS
          </div>
        )}
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <SectionTitle title="PRINCIPAL" />
        <div className={cn("px-2 space-y-1", isCollapsed && "px-1")}>
          {principalItems.map(item => (
            <MenuItem 
              key={item.path} 
              item={item} 
              isActive={location.pathname === item.path} 
            />
          ))}
        </div>

        <div className="mt-6">
          <SectionTitle title="PATRIMÔNIO" />
          <div className={cn("px-2 space-y-1", isCollapsed && "px-1")}>
            {patrimonioItems.map(item => (
              <MenuItem 
                key={item.path} 
                item={item} 
                isActive={location.pathname === item.path} 
              />
            ))}
          </div>
        </div>

        {sistemaItems.length > 0 && (
          <div className="mt-6">
            <SectionTitle title="SISTEMA" />
            <div className={cn("px-2 space-y-1", isCollapsed && "px-1")}>
              {sistemaItems.map(item => (
                <MenuItem 
                  key={item.path} 
                  item={item} 
                  isActive={location.pathname === item.path} 
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <SectionTitle title="SUPORTE" />
          <div className={cn("px-2 space-y-1", isCollapsed && "px-1")}>
            {suporteItems.map(item => (
              <MenuItem 
                key={item.path} 
                item={item} 
                isActive={location.pathname === item.path} 
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Rodapé */}
      <div className="border-t border-slate-700 mt-auto">
        <div className={cn("px-4 py-2 text-xs text-slate-500", isCollapsed && "px-2 text-center")}>
          {isCollapsed ? "v1.0" : "v1.0 - Atualizado"}
        </div>
      </div>
    </div>
  );
};
export default Sidebar;