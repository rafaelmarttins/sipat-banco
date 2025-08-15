
import React from 'react';
import AppSidebar from './Sidebar';
import Header from './Header';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="p-2">
            <SidebarTrigger className="ml-2" />
          </div>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
          {/* Rodapé similar ao CEGIT */}
          <footer className="bg-green-600 text-white px-6 py-2">
            <div className="flex items-center justify-between text-sm">
              <span>Sistema de Patrimônio v1.0 © 2025 SIPAT. Prefeitura Municipal. Todos os direitos reservados.</span>
              <span>Aledevs</span>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
