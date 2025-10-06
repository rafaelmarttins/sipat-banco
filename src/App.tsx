
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Patrimonio from "@/pages/Patrimonio";
import Movimentacoes from "@/pages/Movimentacoes";
import Localizacoes from "@/pages/Localizacoes";
import Relatorios from "@/pages/Relatorios";
import Configuracoes from "@/pages/Configuracoes";
import Estatisticas from "@/pages/Estatisticas";
import Usuarios from "@/pages/Usuarios";
import Ajuda from "@/pages/Ajuda";
import Perfil from "@/pages/Perfil";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patrimonio" 
              element={
                <ProtectedRoute>
                  <Patrimonio />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/movimentacoes" 
              element={
                <ProtectedRoute>
                  <Movimentacoes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/localizacoes" 
              element={
                <ProtectedRoute>
                  <Localizacoes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/relatorios" 
              element={
                <ProtectedRoute>
                  <Relatorios />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/configuracoes" 
              element={
                <ProtectedRoute>
                  <Configuracoes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/estatisticas" 
              element={
                <ProtectedRoute>
                  <Estatisticas />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/usuarios" 
              element={
                <ProtectedRoute>
                  <Usuarios />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ajuda" 
              element={
                <ProtectedRoute>
                  <Ajuda />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/perfil" 
              element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
