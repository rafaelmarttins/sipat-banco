import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTiposEquipamento } from '@/hooks/useTiposEquipamento';

const tipoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  icone: z.string().optional(),
});

type TipoFormData = z.infer<typeof tipoSchema>;

interface TipoEquipamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

const iconesDisponiveis = [
  { value: 'Computer', label: 'Computador' },
  { value: 'Monitor', label: 'Monitor' },
  { value: 'Printer', label: 'Impressora' },
  { value: 'Laptop', label: 'Notebook' },
  { value: 'Tablet', label: 'Tablet' },
  { value: 'Zap', label: 'Nobreak/UPS' },
  { value: 'Smartphone', label: 'Smartphone' },
  { value: 'Headphones', label: 'Fones' },
  { value: 'Router', label: 'Roteador' },
  { value: 'HardDrive', label: 'HD/SSD' },
];

export function TipoEquipamentoModal({ open, onOpenChange, onSubmit }: TipoEquipamentoModalProps) {
  const { addTipo } = useTiposEquipamento();
  const [loading, setLoading] = useState(false);

  const form = useForm<TipoFormData>({
    resolver: zodResolver(tipoSchema),
    defaultValues: {
      nome: '',
      icone: '',
    },
  });

  const handleSubmit = async (data: TipoFormData) => {
    setLoading(true);
    try {
      await addTipo({
        nome: data.nome,
        icone: data.icone
      });
      form.reset();
      onOpenChange(false);
      onSubmit();
    } catch (error) {
      console.error('Erro ao criar tipo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Tipo de Equipamento</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Tipo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Smartphone, Projetor..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ícone (opcional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um ícone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {iconesDisponiveis.map((icone) => (
                        <SelectItem key={icone.value} value={icone.value}>
                          {icone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Tipo'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}