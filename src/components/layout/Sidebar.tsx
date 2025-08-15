
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const AppSidebar = () => {
  const location = useLocation();
  const { logout, profile } = useAuth();
  const { state, open } = useSidebar();
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
  
  if (profile?.role === 'admin') {
    sistemaItems.push(
      { icon: Settings, label: 'Configurações', path: '/configuracoes' },
      { icon: BarChart3, label: 'Estatísticas', path: '/estatisticas' },
      { icon: Users, label: 'Usuários', path: '/usuarios' }
    );
  }

  const suporteItems = [
    { icon: HelpCircle, label: 'Ajuda', path: '/ajuda' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItems = (items: any[]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton asChild isActive={isActive(item.path)}>
            <NavLink to={item.path}>
              <item.icon className="w-4 h-4" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar className="bg-slate-800 text-white border-slate-700">
      {/* Header */}
      <SidebarHeader className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
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
          <SidebarTrigger className="text-slate-300 hover:text-white" />
        </div>
        {!collapsed && (
          <div className="mt-3 text-xs text-slate-400">
            Município de Chapadão do Sul - MS
          </div>
        )}
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider px-4">
            {!collapsed ? 'PRINCIPAL' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            {renderMenuItems(principalItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider px-4 mt-6">
            {!collapsed ? 'PATRIMÔNIO' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            {renderMenuItems(patrimonioItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {sistemaItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider px-4 mt-6">
              {!collapsed ? 'SISTEMA' : ''}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              {renderMenuItems(sistemaItems)}
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider px-4 mt-6">
            {!collapsed ? 'SUPORTE' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            {renderMenuItems(suporteItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-slate-700">
        <div className="p-4">
          {!collapsed && (
            <>
              <div className="mb-3">
                <p className="text-sm font-medium">{profile?.nome || 'Carregando...'}</p>
                <p className="text-xs text-slate-400">{profile?.setor}</p>
                {profile?.role === 'admin' && (
                  <p className="text-xs text-green-400 font-medium">Administrador</p>
                )}
              </div>
              <div className="mb-3 h-px bg-slate-600" />
            </>
          )}
          <button
            onClick={logout}
            className="flex items-center space-x-2 w-full px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-md transition-colors text-sm"
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
