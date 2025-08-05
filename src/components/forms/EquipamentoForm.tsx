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
import { mockLocalizacoes } from '@/data/mockData';
import { Equipamento } from '@/types/patrimonio';

const equipamentoSchema = z.object({
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  processado: z.string().min(1, 'Processador/Descrição é obrigatório'),
  patrimonio: z.string().min(1, 'Número do patrimônio é obrigatório'),
  setor: z.string().min(1, 'Setor é obrigatório'),
  localizacao: z.string().min(1, 'Localização é obrigatória'),
  aquisicao: z.string().optional(),
  estadoConservacao: z.enum(['Conservado', 'Meia-vida', 'Fim-da-vida', 'Novo']),
  vidaUtil: z.string().optional(),
  observacoes: z.string().optional(),
});

type EquipamentoFormData = z.infer<typeof equipamentoSchema>;

interface EquipamentoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Equipamento, 'id' | 'dataCadastro'>) => void;
}

const EquipamentoForm: React.FC<EquipamentoFormProps> = ({ open, onOpenChange, onSubmit }) => {
  const form = useForm<EquipamentoFormData>({
    resolver: zodResolver(equipamentoSchema),
    defaultValues: {
      modelo: '',
      processado: '',
      patrimonio: '',
      setor: '',
      localizacao: '',
      aquisicao: '',
      estadoConservacao: 'Conservado',
      vidaUtil: '',
      observacoes: '',
    },
  });

  const handleSubmit = (data: EquipamentoFormData) => {
    const equipamentoData: Omit<Equipamento, 'id' | 'dataCadastro'> = {
      modelo: data.modelo,
      processado: data.processado,
      patrimonio: Number(data.patrimonio),
      setor: data.setor,
      localizacao: data.localizacao,
      aquisicao: data.aquisicao,
      estadoConservacao: data.estadoConservacao,
      vidaUtil: data.vidaUtil,
      observacoes: data.observacoes,
      status: 'Ativo'
    };
    onSubmit(equipamentoData);
    form.reset();
    onOpenChange(false);
  };

  const tiposEquipamento = ['PC', 'Monitor', 'Impressora', 'Nobreak', 'Notebook', 'Tablet'];

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
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a localização" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockLocalizacoes.map((localizacao) => (
                          <SelectItem key={localizacao} value={localizacao}>
                            {localizacao}
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
                name="estadoConservacao"
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