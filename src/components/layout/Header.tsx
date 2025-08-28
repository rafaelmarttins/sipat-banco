
import React, { useState } from 'react';
import { Bell, LogOut, Key, Building2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const { profile, logout } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Patrimônio', path: '/patrimonio' },
    { name: 'Relatórios', path: '/relatorios' },
    { name: 'Ajuda', path: '/ajuda' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Logo e Nome do Sistema */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-600/30 transform hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">SIPAT</h1>
            <p className="text-xs text-slate-500">Sistema de Patrimônio</p>
          </div>
        </div>

        {/* Navegação Central */}
        <nav className="flex items-center space-x-1">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-600 hover:text-slate-800 hover:transform hover:scale-105'
              }`}
              style={
                !isActive(item.path) 
                  ? {
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                      transition: 'all 0.2s ease-out'
                    }
                  : undefined
              }
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.textShadow = '1px 1px 2px rgba(0,0,0,0.1)';
                }
              }}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Ações do Usuário */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100">
            <Search className="w-5 h-5" />
          </Button>

          <div className="relative">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100">
              <Bell className="w-5 h-5" />
            </Button>
            <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 text-white border-white">
              3
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-slate-600 hover:bg-slate-100 h-auto p-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {profile?.nome?.charAt(0)}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <div className="text-sm font-medium text-slate-700">{profile?.nome}</div>
                <div className="text-xs text-slate-500">Município de Chapadão do Sul - MS</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsChangePasswordOpen(true)}>
                <Key className="w-4 h-4 mr-2" />
                Alterar Senha
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <ChangePasswordModal 
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />
    </header>
  );
};

export default Header;
