import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useLocalizacoes } from '@/hooks/useLocalizacoes';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { useTiposEquipamento } from '@/hooks/useTiposEquipamento';
import { useSecretarias } from '@/hooks/useSecretarias';

const equipamentoSchema = z.object({
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  processado: z.string().min(1, 'Processador/Descrição é obrigatório'),
  patrimonio: z.string().min(1, 'Número do patrimônio é obrigatório'),
  setor: z.string().min(1, 'Setor é obrigatório'),
  localizacao_id: z.string().min(1, 'Localização é obrigatória'),
  secretaria_id: z.string().min(1, 'Secretaria é obrigatória'),
  data_aquisicao: z.string().optional(),
  estado_conservacao: z.enum(['Conservado', 'Meia-vida', 'Fim-da-vida', 'Novo']),
  vida_util: z.string().optional(),
  observacoes: z.string().optional(),
});

type EquipamentoFormData = z.infer<typeof equipamentoSchema>;

interface EquipamentoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

const EquipamentoForm: React.FC<EquipamentoFormProps> = ({ open, onOpenChange, onSubmit }) => {
  const { localizacoes } = useLocalizacoes();
  const { secretarias } = useSecretarias();
  const { addEquipamento } = useEquipamentos();
  
  const form = useForm<EquipamentoFormData>({
    resolver: zodResolver(equipamentoSchema),
    defaultValues: {
      modelo: '',
      processado: '',
      patrimonio: '',
      setor: '',
      localizacao_id: '',
      secretaria_id: '',
      data_aquisicao: '',
      estado_conservacao: 'Conservado',
      vida_util: '',
      observacoes: '',
    },
  });

  const handleSubmit = async (data: EquipamentoFormData) => {
    const equipamentoData = {
      modelo: data.modelo,
      processado: data.processado,
      patrimonio: Number(data.patrimonio),
      setor: data.setor,
      localizacao_id: data.localizacao_id,
      secretaria_id: data.secretaria_id,
      data_aquisicao: data.data_aquisicao || undefined,
      estado_conservacao: data.estado_conservacao,
      vida_util: data.vida_util || undefined,
      observacoes: data.observacoes || undefined,
      status: 'Ativo' as const
    };
    
    const result = await addEquipamento(equipamentoData);
    if (result.success) {
      form.reset();
      onOpenChange(false);
      onSubmit();
    }
  };

  const { tipos: tiposEquipamento } = useTiposEquipamento();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Equipamento</DialogTitle>
          <DialogDescription>
            Preencha as informações do equipamento para cadastrá-lo no sistema.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo/Modelo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            </div>

            <FormField
              control={form.control}
              name="processado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processador/Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Intel i5-8400, HP LaserJet..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secretaria_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secretaria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                name="localizacao_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_aquisicao"
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
                name="estado_conservacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado de Conservação</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <FormField
              control={form.control}
              name="vida_util"
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

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações adicionais sobre o equipamento..."
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
              <Button type="submit">Cadastrar Equipamento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EquipamentoForm;