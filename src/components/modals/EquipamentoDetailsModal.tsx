import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Equipamento } from '@/types/patrimonio';
import { format } from 'date-fns';

interface EquipamentoDetailsModalProps {
  equipamento: Equipamento | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EquipamentoDetailsModal: React.FC<EquipamentoDetailsModalProps> = ({
  equipamento,
  open,
  onOpenChange,
}) => {
  if (!equipamento) return null;

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Meia-vida':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Meia-vida</Badge>;
      case 'Fim-da-vida':
        return <Badge variant="destructive">Fim-da-vida</Badge>;
      case 'Conservado':
        return <Badge className="bg-green-600 hover:bg-green-700">Conservado</Badge>;
      case 'Novo':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Novo</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'Ativo' 
      ? <Badge className="bg-green-600 hover:bg-green-700">Ativo</Badge>
      : <Badge variant="destructive">Desativado</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Equipamento</DialogTitle>
          <DialogDescription>
            Informações completas do equipamento patrimonial
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Patrimônio</label>
              <p className="font-mono text-lg font-bold text-blue-600">#{equipamento.patrimonio}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">{getStatusBadge(equipamento.status)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Tipo</label>
              <p className="text-sm">{equipamento.modelo}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Estado de Conservação</label>
              <div className="mt-1">{getEstadoBadge(equipamento.estadoConservacao)}</div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Descrição/Processador</label>
            <p className="text-sm">{equipamento.processado}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Setor</label>
              <p className="text-sm">{equipamento.setor}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Localização</label>
              <p className="text-sm">{equipamento.localizacao}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Data de Cadastro</label>
              <p className="text-sm">{format(new Date(equipamento.dataCadastro), "dd/MM/yyyy")}</p>
            </div>
            {equipamento.aquisicao && (
              <div>
                <label className="text-sm font-medium text-gray-500">Data de Aquisição</label>
                <p className="text-sm">{format(new Date(equipamento.aquisicao), "dd/MM/yyyy")}</p>
              </div>
            )}
          </div>

          {equipamento.vidaUtil && (
            <div>
              <label className="text-sm font-medium text-gray-500">Vida Útil</label>
              <p className="text-sm">{equipamento.vidaUtil}</p>
            </div>
          )}

          {equipamento.observacoes && (
            <div>
              <label className="text-sm font-medium text-gray-500">Observações</label>
              <p className="text-sm">{equipamento.observacoes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquipamentoDetailsModal;