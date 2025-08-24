
import React, { useState } from 'react';
import { Bell, LogOut, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal';

const Header = () => {
  const { profile, logout } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <div className="flex items-center justify-between flex-1">
      <div className="flex items-center space-x-2 text-sm">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        <span className="text-green-600 font-medium">Sistema Online</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <Bell className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                {profile?.nome?.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">{profile?.nome}</div>
                <div className="text-xs text-muted-foreground">Ver perfil</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setIsChangePasswordOpen(true)}>
              <Key className="w-4 h-4 mr-2" />
              Alterar Senha
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <ChangePasswordModal 
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />
    </div>
  );
};

export default Header;
