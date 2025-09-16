
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Bell, 
  User, 
  AlertTriangle,
  X,
  Settings,
  LogOut,
  Menu,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Trash2,
  TrendingUp,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

  // Mock notifications data
  const notifications = [
    {
      id: '1',
      type: 'info',
      title: 'Nova versão disponível',
      message: 'SIPAT v2.3.3 com novos módulos e interface redesenhada',
      timestamp: new Date('2025-09-09T07:47:06'),
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
      timestamp: new Date('2025-09-08T08:17:06'),
      category: 'sistema',
      read: false,
      action: {
        text: 'Ver relatórios',
        onClick: () => navigate('/relatorios')
      }
    }
  ];

  // Mock alerts data
  const alerts = [
    {
      id: '1',
      type: 'warning',
      title: 'Atualização de Sistema',
      message: 'Manutenção programada para às 02:00 de quinta-feira',
      author: 'Administração',
      priority: 'media',
      dismissible: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/' },
    { id: 'patrimonio', label: 'Patrimônio', path: '/patrimonio' },
    { id: 'relatorios', label: 'Relatórios', path: '/relatorios' },
    { id: 'ajuda', label: 'Ajuda', path: '/ajuda' },
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

  const markAsRead = (id: string) => {
    // Mock function to mark notification as read
    console.log('Mark as read:', id);
  };

  const markAllAsRead = () => {
    // Mock function to mark all notifications as read
    console.log('Mark all as read');
  };

  const deleteNotification = (id: string) => {
    // Mock function to delete notification
    console.log('Delete notification:', id);
  };

  const dismissAlert = (id: string) => {
    // Mock function to dismiss alert
    console.log('Dismiss alert:', id);
  };

  return (
    <TooltipProvider>
      <header className="h-20 glass border-b border-header-border flex flex-col justify-center px-6 shadow-elegant backdrop-blur-xl bg-gradient-to-r from-header/95 to-header/90 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="bg-gradient-emerald p-3 rounded-2xl shadow-emerald hover-scale transition-all duration-300">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-header-foreground tracking-tight font-display">
                SIPAT
              </h1>
              <p className="text-xs text-muted-foreground">Sistema de Patrimônio</p>
            </div>
          </div>

          {/* Navegação principal centralizada - Desktop */}
          <nav className="hidden lg:flex items-center space-x-2 flex-1 justify-center">
            {navigationItems.map((item) => (
              <Button 
                key={item.id}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`text-sm font-medium px-6 py-3 rounded-full transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gradient-primary text-white shadow-blue hover:shadow-glow' 
                    : 'text-header-foreground hover:bg-background/60 hover:text-foreground hover:scale-105 backdrop-blur-sm'
                }`}
                onClick={() => handleNavigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Menu Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10 rounded-full hover:bg-muted/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Busca e Ações */}
          <div className="flex items-center space-x-3">
            {/* Campo de Busca */}
            <div className="hidden md:flex items-center relative">
              {searchOpen ? (
                <div className="flex items-center space-x-2 animate-scale-in">
                  <Input
                    placeholder="Buscar..."
                    className="w-64 h-10 rounded-full border-muted bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all duration-300"
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
                      className="h-10 w-10 rounded-full hover:bg-muted/50 transition-all duration-300 hover:scale-110"
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

            {/* Avisos Importantes */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-full hover:bg-muted/50 transition-all duration-300 hover:scale-110 relative"
                      >
                        <ShieldAlert className="h-5 w-5" />
                        {alerts.length > 0 && (
                          <Badge 
                            variant="secondary" 
                            className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center rounded-full bg-amber-500 text-white"
                          >
                            {alerts.length}
                          </Badge>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Avisos importantes ({alerts.length})</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 glass backdrop-blur-xl border-muted shadow-large z-50">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Avisos Importantes</h3>
                    {alerts.length > 0 && (
                      <Badge variant="secondary" className="rounded-full">{alerts.length}</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {alerts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-emerald-500" />
                        <p>Nenhum aviso no momento</p>
                      </div>
                    ) : (
                      alerts.map((alert) => (
                        <div key={alert.id} className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-xl transition-all duration-200 hover-lift">
                          <div className={`p-2 rounded-full ${
                            alert.type === 'urgent' ? 'bg-red-100' :
                            alert.type === 'warning' ? 'bg-amber-100' :
                            alert.type === 'success' ? 'bg-emerald-100' :
                            'bg-blue-100'
                          }`}>
                            <AlertTriangle className={`h-4 w-4 ${
                              alert.type === 'urgent' ? 'text-red-600' :
                              alert.type === 'warning' ? 'text-amber-600' :
                              alert.type === 'success' ? 'text-emerald-600' :
                              'text-blue-600'
                            }`} />
                          </div>
                          <div className="flex-1 text-sm">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-foreground">{alert.title}</p>
                              {alert.dismissible && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
                                  onClick={() => dismissAlert(alert.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                            <p className="text-muted-foreground mt-1">{alert.message}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-muted-foreground">Por: {alert.author}</p>
                              <Badge variant="outline" className="text-xs">
                                {alert.priority === 'alta' ? 'Alta' : 
                                 alert.priority === 'media' ? 'Média' : 'Baixa'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notificações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-full hover:bg-muted/50 transition-all duration-300 hover:scale-110 relative"
                      >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center rounded-full animate-pulse"
                          >
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </Badge>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Notificações {unreadCount > 0 ? `(${unreadCount} nova${unreadCount > 1 ? 's' : ''})` : ''}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 glass backdrop-blur-xl border-muted shadow-large z-50">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Notificações</h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="rounded-full">{unreadCount} nova{unreadCount > 1 ? 's' : ''}</Badge>
                      )}
                      {notifications.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                          className="text-xs h-6"
                        >
                          Marcar todas como lidas
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                        <p>Nenhuma notificação</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-xl transition-all duration-200 hover-lift cursor-pointer ${
                            !notification.read ? 'bg-primary/5 border border-primary/20' : ''
                          }`}
                          onClick={() => {
                            markAsRead(notification.id);
                            notification.action?.onClick();
                          }}
                        >
                          <div className={`p-2 rounded-full ${
                            notification.type === 'error' ? 'bg-red-100' :
                            notification.type === 'warning' ? 'bg-amber-100' :
                            notification.type === 'success' ? 'bg-emerald-100' :
                            'bg-blue-100'
                          }`}>
                            {notification.type === 'error' ? (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            ) : notification.type === 'warning' ? (
                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                            ) : notification.type === 'success' ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Info className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 text-sm">
                            <div className="flex items-center justify-between">
                              <p className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </p>
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-muted-foreground mt-1">{notification.message}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {notification.timestamp.toLocaleString('pt-BR')}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {notification.category}
                              </Badge>
                            </div>
                            {notification.action && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2 h-7 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.action?.onClick();
                                  markAsRead(notification.id);
                                }}
                              >
                                {notification.action.text}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Perfil do usuário */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-110 transition-all duration-300">
                  <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-medium">
                    <AvatarImage src="" alt="Usuário" />
                    <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                      {profile?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 glass backdrop-blur-xl border-muted shadow-large z-50">
                <div className="p-4 border-b border-muted">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src="" alt="Usuário" />
                      <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                        {profile?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{profile?.nome || 'Servidor'}</p>
                      <p className="text-sm text-muted-foreground truncate">{profile?.email || 'servidor@exemplo.com'}</p>
                      <p className="text-xs text-muted-foreground truncate">Município de Chapadão do Sul - MS</p>
                    </div>
                  </div>
                </div>
                <DropdownMenuItem 
                  className="p-3 cursor-pointer" 
                  onClick={() => navigate('/perfil')}
                >
                  <User className="h-4 w-4 mr-3" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsChangePasswordOpen(true)} className="p-3 cursor-pointer">
                  <Settings className="h-4 w-4 mr-3" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="p-3 cursor-pointer text-destructive hover:text-destructive">
                  <LogOut className="h-4 w-4 mr-3" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-muted shadow-large animate-slide-in-up z-40">
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`w-full justify-start text-left rounded-xl transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-primary text-white shadow-blue' 
                      : 'hover:bg-muted/80'
                  }`}
                  onClick={() => handleNavigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
              <div className="pt-4 border-t border-muted">
                <Input
                  placeholder="Buscar..."
                  className="w-full rounded-xl"
                />
              </div>
            </nav>
          </div>
        )}
      </header>
      
      <ChangePasswordModal 
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />
    </TooltipProvider>
  );
};

export default Header;
