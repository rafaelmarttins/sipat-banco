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
import { Computer, Mail, Lock, User, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Auth = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupNome, setSignupNome] = useState("");
  const [signupSetor, setSignupSetor] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const { login, signup } = useAuth();

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignupLoading(true);

    const result = await signup(signupEmail, signupPassword, {
      nome: signupNome,
      setor: signupSetor,
    });

    if (result.success) {
      toast.success("Conta criada com sucesso! Verifique seu email para confirmar.");
    } else {
      toast.error(result.error || "Erro ao criar conta");
    }

    setIsSignupLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-green-700">
      <div className="absolute inset-0 bg-black/20"></div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-green-600 rounded flex items-center justify-center mx-auto mb-4">
            <Computer className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            SIPAT
          </CardTitle>
          <CardDescription className="text-center">
            Sistema de Patrimônio
            <br />
            Município de Chapadão do Sul - MS
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu.email@chapadao.ms.gov.br"
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
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-nome">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="signup-nome"
                      type="text"
                      placeholder="Seu nome completo"
                      value={signupNome}
                      onChange={(e) => setSignupNome(e.target.value)}
                      required
                      className="h-10 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu.email@chapadao.ms.gov.br"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="h-10 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-setor">Setor</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="signup-setor"
                      type="text"
                      placeholder="Seu setor de trabalho"
                      value={signupSetor}
                      onChange={(e) => setSignupSetor(e.target.value)}
                      required
                      className="h-10 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Crie uma senha segura"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-10 pl-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 h-10"
                  disabled={isSignupLoading}
                >
                  {isSignupLoading ? "Criando conta..." : "Criar conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
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