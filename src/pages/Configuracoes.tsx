import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Clock } from 'lucide-react';

const Configuracoes = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center py-16">
          <div className="flex justify-center mb-6">
            <div className="rounded-full p-4 bg-slate-100">
              <Settings className="w-12 h-12 text-slate-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Configurações do Sistema</h1>
          <p className="text-lg text-slate-600 mb-6">
            Este módulo está em desenvolvimento e estará disponível em breve.
          </p>
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-amber-600">
                <Clock className="w-5 h-5" />
                Em Breve
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600">
                Funcionalidades que estarão disponíveis:
              </p>
              <ul className="mt-4 text-sm text-slate-500 space-y-1">
                <li>• Configurações gerais</li>
                <li>• Gerenciamento de usuários</li>
                <li>• Perfis de acesso</li>
                <li>• Backup e restauração</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Configuracoes;