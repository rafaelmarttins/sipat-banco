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
import { Computer, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      toast.success("Login realizado com sucesso!");
    } else {
      toast.error("Email ou senha inválidos");
    }

    setIsLoading(false);
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

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@chapadao.ms.gov.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10"
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Credenciais de teste:</p>
                  <p>
                    <strong>Admin:</strong> admin@chapadao.ms.gov.br / admin123
                  </p>
                  <p>
                    <strong>Usuário:</strong> user@chapadao.ms.gov.br / user123
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 h-10"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Rodapé da tela de login */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
        Sistema de Patrimônio v1.0 © 2025 SIPAT. Prefeitura Municipal de
        Chapadão do Sul - MS
      </div>
    </div>
  );
};

export default Login;
