
import React, { useState } from 'react';
import { 
  Bell, 
  LogOut, 
  Key, 
  Building2, 
  Search, 
  Settings,
  User,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const { profile, logout } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', path: '/' },
    { id: 'patrimonio', name: 'Patrimônio', path: '/patrimonio' },
    { id: 'movimentacoes', name: 'Movimentações', path: '/movimentacoes' },
    { id: 'usuarios', name: 'Usuários', path: '/usuarios' },
    { id: 'localizacoes', name: 'Localizações', path: '/localizacoes' },
    { id: 'estatisticas', name: 'Estatísticas', path: '/estatisticas' },
    { id: 'relatorios', name: 'Relatórios', path: '/relatorios' },
    { id: 'configuracoes', name: 'Configurações', path: '/configuracoes' },
    { id: 'ajuda', name: 'Ajuda', path: '/ajuda' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <TooltipProvider>
      <header className="h-20 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex flex-col justify-center px-6 shadow-sm backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-2xl shadow-lg shadow-green-600/30 hover:scale-105 transition-all duration-300">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                SIPAT
              </h1>
              <p className="text-xs text-slate-500">Sistema de Patrimônio</p>
            </div>
          </div>

          {/* Navegação principal centralizada - Desktop */}
          <nav className="hidden lg:flex items-center space-x-2 flex-1 justify-center">
            {navigationItems.slice(0, 5).map((item) => (
              <Button 
                key={item.id}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`text-sm font-medium px-6 py-3 rounded-full transition-all duration-300 ${
                  isActive(item.path) 
                    ? 'bg-blue-500 text-white shadow-lg hover:shadow-xl' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 hover:scale-105 hover:font-bold'
                }`}
                onClick={() => handleNavigate(item.path)}
              >
                {item.name}
              </Button>
            ))}
          </nav>

          {/* Menu Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10 rounded-full hover:bg-slate-100 transition-all duration-200 hover:font-bold"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Busca e Ações */}
          <div className="flex items-center space-x-3">
            {/* Campo de Busca */}
            <div className="hidden md:flex items-center relative">
              {searchOpen ? (
                <div className="flex items-center space-x-2 animate-fade-in">
                  <Input
                    placeholder="Buscar equipamentos..."
                    className="w-64 h-10 rounded-full border-slate-300 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                  />
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-full hover:bg-slate-100 transition-all duration-300 hover:scale-110 hover:font-bold"
                      onClick={() => setSearchOpen(true)}
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Buscar (Ctrl+K)</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Notificações */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-full hover:bg-slate-100 transition-all duration-300 hover:scale-110 hover:font-bold relative"
                  >
                    <Bell className="h-5 w-5" />
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center rounded-full animate-pulse"
                    >
                      3
                    </Badge>
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notificações (3 novas)</p>
              </TooltipContent>
            </Tooltip>

            {/* Perfil do usuário */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-110 transition-all duration-300">
                  <Avatar className="h-10 w-10 border-2 border-blue-500/20 shadow-md">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Usuário" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold">
                      {profile?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'US'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white/95 backdrop-blur-xl border-slate-200 shadow-xl">
                <div className="p-4 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="Usuário" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold">
                        {profile?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'US'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{profile?.nome || 'Usuário'}</p>
                      <p className="text-sm text-slate-600 truncate">{profile?.email || 'usuario@exemplo.com'}</p>
                      <p className="text-xs text-slate-500 truncate">Município de Chapadão do Sul - MS</p>
                    </div>
                  </div>
                </div>
                <DropdownMenuItem onClick={() => handleNavigate('/configuracoes')} className="p-3 cursor-pointer hover:bg-slate-50">
                  <Settings className="h-4 w-4 mr-3" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsChangePasswordOpen(true)} className="p-3 cursor-pointer hover:bg-slate-50">
                  <Key className="h-4 w-4 mr-3" />
                  <span>Alterar Senha</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="p-3 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="h-4 w-4 mr-3" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-lg animate-fade-in">
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`w-full justify-start text-left rounded-xl transition-all duration-300 ${
                    isActive(item.path) 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'hover:bg-slate-100'
                  }`}
                  onClick={() => handleNavigate(item.path)}
                >
                  {item.name}
                </Button>
              ))}
              <div className="pt-4 border-t border-slate-200">
                <Input
                  placeholder="Buscar equipamentos..."
                  className="w-full rounded-xl"
                />
              </div>
            </nav>
          </div>
        )}
        
        <ChangePasswordModal 
          open={isChangePasswordOpen}
          onOpenChange={setIsChangePasswordOpen}
        />
      </header>
    </TooltipProvider>
  );
};

export default Header;
