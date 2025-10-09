import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Computer, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Auth = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);

    const result = await login(loginEmail, loginPassword);

    if (result.success) {
      toast.success("Login realizado com sucesso!");
      // Navigation will be handled by auth state change
    } else {
      toast.error(result.error || "Erro ao fazer login");
    }

    setIsLoginLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-green-700">
      <div className="absolute inset-0 bg-black/20"></div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-green-600 rounded flex items-center justify-center mx-auto mb-4">
            <Computer className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground dark:text-white">
            SIPAT
          </CardTitle>
          <CardDescription className="text-center dark:text-white/90">
            Sistema de Patrimônio
            <br />
            Município de Chapadão do Sul - MS
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Digite seu Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="h-10 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="h-10 pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 h-10"
              disabled={isLoginLoading}
            >
              {isLoginLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Rodapé da tela de autenticação */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
        Sistema de Patrimônio v1.0 © 2025 SIPAT. Prefeitura Municipal de
        Chapadão do Sul - MS
      </div>
    </div>
  );
};

export default Auth;