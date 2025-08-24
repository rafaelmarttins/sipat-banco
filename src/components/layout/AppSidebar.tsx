import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Computer, ArrowRightLeft, FileText, Settings, BarChart3, Users, HelpCircle, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const location = useLocation();
  const { profile, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const principalItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/dashboard'
    }
  ];

  const patrimonioItems = [
    {
      icon: Computer,
      label: 'Patrimônio',
      path: '/patrimonio'
    },
    {
      icon: ArrowRightLeft,
      label: 'Movimentações',
      path: '/movimentacoes'
    },
    {
      icon: MapPin,
      label: 'Localizações',
      path: '/localizacoes'
    },
    {
      icon: FileText,
      label: 'Relatórios',
      path: '/relatorios'
    }
  ];

  const sistemaItems = [];
  if (profile?.role === 'admin') {
    sistemaItems.push(
      {
        icon: Settings,
        label: 'Configurações',
        path: '/configuracoes'
      },
      {
        icon: BarChart3,
        label: 'Estatísticas',
        path: '/estatisticas'
      },
      {
        icon: Users,
        label: 'Usuários',
        path: '/usuarios'
      }
    );
  }

  const suporteItems = [
    {
      icon: HelpCircle,
      label: 'Ajuda',
      path: '/ajuda'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItems = (items: any[]) => {
    return items.map((item) => {
      const Icon = item.icon;
      const active = isActive(item.path);
      
      return (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton asChild isActive={active} size="lg">
            <Link to={item.path} className="flex items-center gap-3">
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b">
        <div className={cn("flex items-center gap-3 p-2", collapsed && "justify-center")}>
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center flex-shrink-0">
            <Computer className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-sm">SIPAT</h2>
              <p className="text-xs text-muted-foreground">Sistema de Patrimônio</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="px-2 pb-2">
            <p className="text-xs text-muted-foreground">
              Município de Chapadão do Sul - MS
            </p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>PRINCIPAL</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(principalItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>PATRIMÔNIO</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(patrimonioItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {sistemaItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>SISTEMA</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {renderMenuItems(sistemaItems)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>SUPORTE</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(suporteItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        {/* Informações do usuário */}
        <div className="p-3">
          {!collapsed && (
            <div className="mb-3">
              <p className="text-sm font-medium truncate">{profile?.nome || 'Carregando...'}</p>
              <p className="text-xs text-muted-foreground truncate">{profile?.setor}</p>
              {profile?.role === 'admin' && (
                <p className="text-xs text-primary font-medium">Administrador</p>
              )}
            </div>
          )}
          
          {collapsed && (
            <div className="flex justify-center mb-3">
              <div 
                className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium"
                title={profile?.nome || 'Usuário'}
              >
                {profile?.nome?.charAt(0) || 'U'}
              </div>
            </div>
          )}

          {/* Botão de logout */}
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full h-10 text-destructive hover:bg-destructive/10 hover:text-destructive",
              collapsed ? "justify-center px-2" : "justify-start px-3"
            )}
          >
            <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
            {!collapsed && <span>Sair</span>}
          </Button>
        </div>
        
        {/* Versão */}
        <div className={cn("px-3 py-2 text-xs text-muted-foreground border-t", collapsed ? "text-center" : "")}>
          {collapsed ? "v1.0" : "v1.0 - Atualizado"}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}