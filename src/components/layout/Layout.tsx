import React from "react";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b px-6">
            <SidebarTrigger className="mr-4" />
            <Header />
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
          <footer className="bg-primary text-primary-foreground px-6 py-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="font-medium">SIPAT v1.0</span>
                <span>© 2025 SIPAT • Prefeitura Municipal</span>
              </div>
              <span>Desenvolvido por Rafael Martins</span>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
