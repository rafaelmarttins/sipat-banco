
import React, { useState } from 'react';
import { Bell, LogOut, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal';

const Header = () => {
  const { profile, logout } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Sistema de Patrimônio</h1>
              <p className="text-xs text-slate-500">Município de Chapadão do Sul - MS</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-green-600 font-medium">Sistema Online</span>
          </div>
          
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>

          <div className="flex items-center space-x-2 pl-4 border-l border-slate-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {profile?.nome?.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{profile?.nome}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
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
      </div>
      
      <ChangePasswordModal 
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />
    </header>
  );
};

export default Header;
