import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto bg-background">{children}</main>
        <footer className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background border-t border-border/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
          <div className="relative mx-auto max-w-7xl px-6 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse"></div>
                  <span className="font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    SIPAT
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    v0.1.3
                  </span>
                </div>
                <span className="hidden md:inline">•</span>
                <span>© 2025 CEGIT • Diretoria de Tecnologia • Prefeitura de Chapadão do Sul - Uma cidade bem melhor</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">Desenvolvido por</span>
                <a 
                  href="https://www.linkedin.com/in/rafaamartins/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-foreground font-medium transition-all duration-300 hover:from-primary/20 hover:to-accent/20 hover:scale-105 border border-primary/20 hover:border-primary/40"
                >
                  <span className="relative z-10">Rafael Martins</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
