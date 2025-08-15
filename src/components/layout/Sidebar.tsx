
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Computer, 
  ArrowRightLeft, 
  FileText, 
  Settings,
  BarChart3,
  Users,
  HelpCircle,
  LogOut,
  MapPin 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

const AppSidebar = () => {
  const location = useLocation();
  const { logout, profile } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const principalItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  ];

  const patrimonioItems = [
    { icon: Computer, label: 'Patrimônio', path: '/patrimonio' },
    { icon: ArrowRightLeft, label: 'Movimentações', path: '/movimentacoes' },
    { icon: MapPin, label: 'Localizações', path: '/localizacoes' },
    { icon: FileText, label: 'Relatórios', path: '/relatorios' },
  ];

  const sistemaItems = [];
  
  console.log('Profile in sidebar:', profile);
  console.log('Profile role:', profile?.role);
  
  if (profile?.role === 'admin') {
    console.log('User is admin - showing admin menu items');
    sistemaItems.push(
      { icon: Settings, label: 'Configurações', path: '/configuracoes' },
      { icon: BarChart3, label: 'Estatísticas', path: '/estatisticas' },
      { icon: Users, label: 'Usuários', path: '/usuarios' }
    );
  } else {
    console.log('User is not admin or profile not loaded');
  }

  const suporteItems = [
    { icon: HelpCircle, label: 'Ajuda', path: '/ajuda' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={cn("bg-slate-800 text-white border-r border-slate-700", collapsed ? "w-14" : "w-56")} collapsible="icon">
      <SidebarHeader className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
            <Computer className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-sm">SIPAT</h2>
              <p className="text-xs text-slate-400">Sistema de Patrimônio</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="mt-3 text-xs text-slate-400">
            Município de Chapadão do Sul - MS
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider">PRINCIPAL</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {principalItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm transition-colors",
                          isActive 
                            ? "bg-green-600 text-white" 
                            : "text-slate-300 hover:bg-slate-700 hover:text-white"
                        )
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider">PATRIMÔNIO</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {patrimonioItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm transition-colors",
                          isActive 
                            ? "bg-green-600 text-white" 
                            : "text-slate-300 hover:bg-slate-700 hover:text-white"
                        )
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {sistemaItems.length > 0 && (
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider">SISTEMA</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {sistemaItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm transition-colors",
                            isActive 
                              ? "bg-green-600 text-white" 
                              : "text-slate-300 hover:bg-slate-700 hover:text-white"
                          )
                        }
                      >
                        <item.icon className="w-4 h-4" />
                        {!collapsed && <span>{item.label}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider">SUPORTE</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {suporteItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm transition-colors",
                          isActive 
                            ? "bg-green-600 text-white" 
                            : "text-slate-300 hover:bg-slate-700 hover:text-white"
                        )
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-700">
        <div className="p-4">
          {!collapsed && (
            <div className="mb-3">
              <p className="text-sm font-medium">{profile?.nome || 'Carregando...'}</p>
              <p className="text-xs text-slate-400">{profile?.setor}</p>
              {profile?.role === 'admin' && (
                <p className="text-xs text-green-400 font-medium">Administrador</p>
              )}
            </div>
          )}
          {!collapsed && <Separator className="mb-3 bg-slate-600" />}
          <button
            onClick={logout}
            className={cn(
              "flex items-center w-full px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-md transition-colors text-sm",
              collapsed ? "justify-center" : "space-x-2"
            )}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
        {!collapsed && (
          <div className="px-4 py-2 text-xs text-slate-500 border-t border-slate-700">
            v1.0 - Atualizado
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
