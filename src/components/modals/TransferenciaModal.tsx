import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Equipamento } from '@/hooks/useEquipamentos';
import { useLocalizacoes } from '@/hooks/useLocalizacoes';
import { useSecretarias } from '@/hooks/useSecretarias';
import { useMovimentacoes } from '@/hooks/useMovimentacoes';
import { useAuth } from '@/contexts/AuthContext';

const transferenciaSchema = z.object({
  localizacao_destino_id: z.string().min(1, 'Localização de destino é obrigatória'),
  secretaria_destino_id: z.string().optional(),
  motivo: z.string().optional(),
});

type TransferenciaFormData = z.infer<typeof transferenciaSchema>;

interface TransferenciaModalProps {
  equipamento: Equipamento | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const TransferenciaModal: React.FC<TransferenciaModalProps> = ({
  equipamento,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { localizacoes } = useLocalizacoes();
  const { secretarias } = useSecretarias();
  const { addMovimentacao } = useMovimentacoes();
  const { profile } = useAuth();

  const form = useForm<TransferenciaFormData>({
    resolver: zodResolver(transferenciaSchema),
    defaultValues: {
      localizacao_destino_id: '',
      secretaria_destino_id: '',
      motivo: '',
    },
  });

  useEffect(() => {
    if (equipamento && open) {
      form.reset({
        localizacao_destino_id: '',
        secretaria_destino_id: '',
        motivo: '',
      });
    }
  }, [equipamento, open, form]);

  const handleSubmit = async (data: TransferenciaFormData) => {
    if (!equipamento || !profile) return;

    const motivo = data.motivo || 'Transferência realizada via sistema';

    const movimentacaoData = {
      equipamento_id: equipamento.id,
      localizacao_origem_id: equipamento.localizacao_id,
      localizacao_destino_id: data.localizacao_destino_id,
      secretaria_origem_id: equipamento.secretaria_id || undefined,
      secretaria_destino_id: data.secretaria_destino_id || undefined,
      responsavel_id: profile.id,
      motivo,
    };

    const result = await addMovimentacao(movimentacaoData);
    
    if (result.success) {
      onOpenChange(false);
      onSuccess?.();
    }
  };

  if (!equipamento) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transferir Equipamento</DialogTitle>
          <DialogDescription>
            Realizar transferência do equipamento #{equipamento.patrimonio}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Informações Atuais */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Localização Atual</h4>
              <div className="text-sm text-muted-foreground">
                <p><strong>Localização:</strong> {equipamento.localizacao?.nome || 'N/A'}</p>
                <p><strong>Secretaria:</strong> {equipamento.secretaria?.nome || 'N/A'}</p>
                <p><strong>Setor:</strong> {equipamento.setor}</p>
              </div>
            </div>

            {/* Nova Localização */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground border-b pb-2">
                Nova Localização
              </h4>

              <FormField
                control={form.control}
                name="localizacao_destino_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização de Destino *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a nova localização" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {localizacoes
                          .filter(loc => loc.id !== equipamento.localizacao_id)
                          .map((localizacao) => (
                            <SelectItem key={localizacao.id} value={localizacao.id}>
                              {localizacao.nome}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secretaria_destino_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secretaria de Destino (Opcional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a secretaria (opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {secretarias.map((secretaria) => (
                          <SelectItem key={secretaria.id} value={secretaria.id}>
                            {secretaria.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Motivo */}
            <FormField
              control={form.control}
              name="motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo da Transferência (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o motivo da transferência (opcional). Se não preencher, será usado o motivo padrão."
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Confirmar Transferência
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferenciaModal;
