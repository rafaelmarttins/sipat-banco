import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Equipamento } from '@/hooks/useEquipamentos';
import { useLocalizacoes } from '@/hooks/useLocalizacoes';
import { useTiposEquipamento } from '@/hooks/useTiposEquipamento';
import { useSecretarias } from '@/hooks/useSecretarias';

const editEquipamentoSchema = z.object({
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  processado: z.string().min(1, 'Processador/Descrição é obrigatório'),
  patrimonio: z.string().min(1, 'Número do patrimônio é obrigatório'),
  setor: z.string().min(1, 'Setor é obrigatório'),
  localizacao: z.string().min(1, 'Localização é obrigatória'),
  secretaria_id: z.string().min(1, 'Secretaria é obrigatória'),
  aquisicao: z.string().optional(),
  estadoConservacao: z.enum(['Conservado', 'Meia-vida', 'Fim-da-vida', 'Novo']),
  vidaUtil: z.string().optional(),
  observacoes: z.string().optional(),
  status: z.enum(['Ativo', 'Desativado']),
});

type EditEquipamentoFormData = z.infer<typeof editEquipamentoSchema>;

interface EditEquipamentoModalProps {
  equipamento: Equipamento | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: Partial<Equipamento>) => void;
}

const EditEquipamentoModal: React.FC<EditEquipamentoModalProps> = ({
  equipamento,
  open,
  onOpenChange,
  onSubmit,
}) => {
  const { localizacoes } = useLocalizacoes();
  const { secretarias } = useSecretarias();
  const form = useForm<EditEquipamentoFormData>({
    resolver: zodResolver(editEquipamentoSchema),
    defaultValues: {
      modelo: '',
      processado: '',
      patrimonio: '',
      setor: '',
      localizacao: '',
      secretaria_id: '',
      aquisicao: '',
      estadoConservacao: 'Conservado',
      vidaUtil: '',
      observacoes: '',
      status: 'Ativo',
    },
  });

  useEffect(() => {
    if (equipamento) {
      form.reset({
        modelo: equipamento.modelo,
        processado: equipamento.processado,
        patrimonio: equipamento.patrimonio.toString(),
        setor: equipamento.setor,
        localizacao: equipamento.localizacao_id,
        secretaria_id: equipamento.secretaria_id || '',
        aquisicao: equipamento.data_aquisicao || '',
        estadoConservacao: equipamento.estado_conservacao,
        vidaUtil: equipamento.vida_util || '',
        observacoes: equipamento.observacoes || '',
        status: equipamento.status,
      });
    }
  }, [equipamento, form]);

  const handleSubmit = (data: EditEquipamentoFormData) => {
    if (!equipamento) return;

    const updatedData: Partial<Equipamento> = {
      modelo: data.modelo,
      processado: data.processado,
      patrimonio: Number(data.patrimonio),
      setor: data.setor,
      localizacao_id: data.localizacao,
      secretaria_id: data.secretaria_id,
      data_aquisicao: data.aquisicao,
      estado_conservacao: data.estadoConservacao,
      vida_util: data.vidaUtil,
      observacoes: data.observacoes,
      status: data.status,
    };

    onSubmit(equipamento.id, updatedData);
    onOpenChange(false);
  };

  const { tipos: tiposEquipamento } = useTiposEquipamento();

  if (!equipamento) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Equipamento</DialogTitle>
          <DialogDescription>
            Atualize as informações do equipamento #{equipamento.patrimonio}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* 1. Identificação do Equipamento */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2">
                Identificação do Equipamento
              </h3>
              
              <FormField
                control={form.control}
                name="patrimonio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Patrimônio</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="modelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo/Modelo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiposEquipamento.map((tipo) => (
                            <SelectItem key={tipo.id} value={tipo.nome}>
                              {tipo.nome}
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
                  name="processado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Processador/Descrição</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Intel i5-8400..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 2. Vinculação Administrativa */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2">
                Vinculação Administrativa
              </h3>

              <FormField
                control={form.control}
                name="secretaria_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secretaria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a secretaria" />
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="setor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Setor</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Recepção, Farmácia..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="localizacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localização</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a localização" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {localizacoes.map((localizacao) => (
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
              </div>
            </div>

            {/* 3. Dados Técnicos */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2">
                Dados Técnicos
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="aquisicao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Aquisição</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vidaUtil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vida Útil</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 5 anos, 2025-12-31..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="estadoConservacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado de Conservação</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Novo">Novo</SelectItem>
                        <SelectItem value="Conservado">Conservado</SelectItem>
                        <SelectItem value="Meia-vida">Meia-vida</SelectItem>
                        <SelectItem value="Fim-da-vida">Fim-da-vida</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 4. Status e Controle */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2">
                Status e Controle
              </h3>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Desativado">Desativado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações adicionais sobre o equipamento..."
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEquipamentoModal;