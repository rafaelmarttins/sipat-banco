import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        {/* Rodapé similar ao CEGIT */}
        <footer className="bg-green-600 text-white px-6 py-2 flex-shrink-0">
          <div className="flex items-center justify-between text-sm">
            <span>SIPAT © 2025 CEGIT • Diretoria de Tecnologia</span>
            <div className="flex items-center space-x-4">
              <span>Desenvolvido por <a href="https://www.linkedin.com/in/rafaamartins/" target="_blank" rel="noopener noreferrer" className="hover:underline">Rafael Martins</a></span>
              <span className="text-xs opacity-70">v0.1.3</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
