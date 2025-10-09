import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Computer, ArrowRightLeft, FileText, Settings, BarChart3, Users, HelpCircle, MapPin, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed
}) => {
  const location = useLocation();
  const { profile, logout } = useAuth();

  const menuSections = [
    {
      title: 'PRINCIPAL',
      items: [
        { icon: Home, label: 'Dashboard', path: '/dashboard' }
      ]
    },
    {
      title: 'PATRIMÔNIO',
      items: [
        { icon: Computer, label: 'Patrimônio', path: '/patrimonio' },
        { icon: ArrowRightLeft, label: 'Movimentações', path: '/movimentacoes' },
        { icon: MapPin, label: 'Localizações', path: '/localizacoes' },
        { icon: FileText, label: 'Relatórios', path: '/relatorios' }
      ]
    }
  ];

  // Adiciona seção SISTEMA apenas para admins
  if (profile?.role === 'admin') {
    menuSections.push({
      title: 'SISTEMA',
      items: [
        { icon: Settings, label: 'Configurações', path: '/configuracoes' },
        { icon: BarChart3, label: 'Estatísticas', path: '/estatisticas' },
        { icon: Users, label: 'Usuários', path: '/usuarios' }
      ]
    });
  }

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <Button
        key={item.path}
        variant="ghost"
        asChild
        className={cn(
          "w-full h-12 mb-1 transition-all duration-200",
          isCollapsed ? "px-2 justify-center" : "justify-start px-4",
          isActive 
            ? "bg-sidebar-accent text-sidebar-accent-foreground rounded-full shadow-md" 
            : "text-sidebar-foreground hover:bg-sidebar-accent/10 rounded-xl"
        )}
      >
        <a href={item.path} title={isCollapsed ? item.label : undefined}>
          <Icon className={cn("h-5 w-5", !isCollapsed ? "mr-3" : "")} />
          {!isCollapsed && <span className="font-medium">{item.label}</span>}
        </a>
      </Button>
    );
  };

  const renderSection = (section: any) => {
    return (
      <div key={section.title} className="mb-6">
        {!isCollapsed && (
          <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wide mb-3 px-4">
            {section.title}
          </h3>
        )}
        <div className="space-y-1">
          {section.items.map(renderMenuItem)}
        </div>
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "flex flex-col bg-sidebar transition-[width] duration-300 ease-in-out relative h-screen",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo clicável */}
      <a 
        href="/dashboard" 
        className="flex items-center gap-3 p-4 mb-2 hover:opacity-80 transition-opacity cursor-pointer"
        title="Ir para Dashboard"
      >
        <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center flex-shrink-0">
          <Computer className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">SIPAT</h1>
            <p className="text-xs text-sidebar-foreground/60">Sistema de Patrimônio</p>
          </div>
        )}
      </a>

      {/* Botão de toggle */}
      <div className="absolute top-24 -right-3 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-6 w-6 rounded-full bg-primary dark:bg-primary/90 border-2 border-background dark:border-border shadow-lg hover:bg-primary/90 dark:hover:bg-primary transition-all duration-200"
        >
          <ChevronRight 
            className={cn(
              "h-3 w-3 transition-transform duration-300 text-primary-foreground",
              !isCollapsed ? "rotate-180" : ""
            )} 
          />
        </Button>
      </div>

      {/* Conteúdo da sidebar */}
      <div className="flex-1 flex flex-col min-h-0 pt-6">
        {/* Menu Sections */}
        <nav className="flex-1 px-3 space-y-2">
          {menuSections.map(renderSection)}
        </nav>

        {/* Área inferior com Ajuda e Log out */}
        <div className="p-3 mt-auto space-y-2">
          <div className="bg-muted/10 rounded-2xl p-3 space-y-2">
            <Button
              variant="ghost"
              asChild
              className={cn(
                "w-full h-12 transition-all duration-200",
                isCollapsed ? "justify-center px-2" : "justify-start px-4",
                location.pathname === '/ajuda'
                  ? "bg-sidebar-accent/20 text-sidebar-accent rounded-xl" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10 rounded-xl"
              )}
            >
              <a href="/ajuda" title={isCollapsed ? 'Ajuda' : undefined}>
                <HelpCircle className={cn("h-5 w-5", !isCollapsed ? "mr-3" : "")} />
                {!isCollapsed && <span className="font-medium">Ajuda</span>}
              </a>
            </Button>
            
            <Button
              variant="ghost"
              onClick={logout}
              className={cn(
                "w-full h-12 text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200",
                isCollapsed ? "justify-center px-2" : "justify-start px-4"
              )}
              title={isCollapsed ? 'Sair' : undefined}
            >
              <LogOut className={cn("h-5 w-5", !isCollapsed ? "mr-3" : "")} />
              {!isCollapsed && <span className="font-medium">Sair</span>}
            </Button>
          </div>
          
          {/* Versão */}
          {!isCollapsed && (
            <div className="text-xs text-sidebar-foreground/40 text-center font-medium px-2">
              v0.1.3
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;