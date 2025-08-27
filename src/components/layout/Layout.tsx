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
        <footer className="bg-slate-50 border-t border-slate-200 px-6 py-3">
          <div className="flex items-center justify-center text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-blue-600">SIPAT</span>
              <span className="text-blue-600">v0.1.3</span>
              <span className="text-slate-400 mx-2">•</span>
              <span>© 2025 CEGIT • Diretoria de Tecnologia</span>
              <span className="text-slate-400 mx-2">•</span>
              <span>Desenvolvido por</span>
              <a 
                href="https://www.linkedin.com/in/rafaamartins/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-700 ml-1 transition-colors duration-200"
              >
                Rafael Martins
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
