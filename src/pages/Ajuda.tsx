import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Clock } from 'lucide-react';

const Ajuda = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center py-16">
          <div className="flex justify-center mb-6">
            <div className="rounded-full p-4 bg-slate-100">
              <HelpCircle className="w-12 h-12 text-slate-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Central de Ajuda</h1>
          <p className="text-lg text-muted-foreground dark:text-white/90 mb-6">
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
              <p className="text-muted-foreground dark:text-white/80">
                Funcionalidades que estarão disponíveis:
              </p>
              <ul className="mt-4 text-sm text-muted-foreground dark:text-white/70 space-y-1">
                <li>• Documentação do sistema</li>
                <li>• Tutoriais em vídeo</li>
                <li>• FAQ - Perguntas frequentes</li>
                <li>• Suporte técnico</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Ajuda;