
import React, { useState } from 'react';
import { Bell, LogOut, Key, Building2, Search, User, Settings, Clock, X, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const { profile, logout } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // Mock notifications data
  const notifications = [
    {
      id: '1',
      type: 'info',
      title: 'Nova versão disponível',
      message: 'SIPAT v2.3.3 com novos módulos e interface redesenhada',
      timestamp: '09/09/2025, 07:47:06',
      category: 'sistema',
      read: false,
      action: {
        text: 'Ver novidades',
        onClick: () => console.log('Ver novidades')
      }
    },
    {
      id: '2',
      type: 'success',
      title: 'Novo recurso',
      message: 'Agora você pode exportar relatórios em Excel',
      timestamp: '08/09/2025, 08:17:06',
      category: 'sistema',
      read: false,
      action: {
        text: 'Ver relatórios',
        onClick: () => console.log('Ver relatórios')
      }
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

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
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Ações do Usuário */}
        <div className="flex items-center space-x-3">
          {/* Busca */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center space-x-2 animate-in slide-in-from-right-2 duration-200">
                <Input
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 h-9 rounded-full border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) setSearchOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-600 hover:bg-slate-100 hover:font-bold transition-all"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Notificações */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100 hover:font-bold transition-all">
                  <Bell className="w-5 h-5" />
                </Button>
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 text-white border-white flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 p-0">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">Notificações</h3>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700">
                      Marcar todas como lidas
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Bell className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>Nenhuma notificação</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full mt-1 ${
                          notification.type === 'error' ? 'bg-red-100' :
                          notification.type === 'warning' ? 'bg-amber-100' :
                          notification.type === 'success' ? 'bg-emerald-100' :
                          'bg-blue-100'
                        }`}>
                          {notification.type === 'error' ? (
                            <X className="h-4 w-4 text-red-600" />
                          ) : notification.type === 'warning' ? (
                            <Clock className="h-4 w-4 text-amber-600" />
                          ) : notification.type === 'success' ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Info className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className={`font-medium text-sm ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock className="h-3 w-3" />
                              <span>{notification.timestamp}</span>
                              <Badge variant="outline" className="text-xs">
                                {notification.category}
                              </Badge>
                            </div>
                          </div>
                          {notification.action && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2 h-7 text-xs"
                              onClick={notification.action.onClick}
                            >
                              {notification.action.text}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Perfil */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-110 transition-all duration-300">
                <Avatar className="h-9 w-9 border-2 border-slate-200">
                  <AvatarImage src="" alt="Usuário" />
                  <AvatarFallback className="bg-blue-500 text-white font-semibold text-sm">
                    {profile?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-0">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 border-2 border-slate-200">
                    <AvatarImage src="" alt="Usuário" />
                    <AvatarFallback className="bg-blue-500 text-white font-semibold">
                      {profile?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{profile?.nome || 'Servidor'}</p>
                    <p className="text-sm text-slate-600 truncate">{profile?.email || 'servidor@exemplo.com'}</p>
                    <p className="text-xs text-slate-500 truncate">Município de Chapadão do Sul - MS</p>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <DropdownMenuItem className="px-4 py-3 cursor-pointer hover:bg-slate-50">
                  <User className="w-4 h-4 mr-3 text-slate-600" />
                  <span className="font-medium">Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsChangePasswordOpen(true)} className="px-4 py-3 cursor-pointer hover:bg-slate-50">
                  <Settings className="w-4 h-4 mr-3 text-slate-600" />
                  <span className="font-medium">Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="px-4 py-3 cursor-pointer text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-3" />
                  <span className="font-medium">Sair</span>
                </DropdownMenuItem>
              </div>
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
