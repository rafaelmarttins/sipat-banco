import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSecretarias, type Secretaria } from '@/hooks/useSecretarias';

const secretariaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  ativo: z.boolean().default(true),
});

type SecretariaFormData = z.infer<typeof secretariaSchema>;

interface SecretariaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  secretaria?: Secretaria | null;
  onSubmit?: () => void;
}

export const SecretariaModal = ({
  open,
  onOpenChange,
  secretaria,
  onSubmit,
}: SecretariaModalProps) => {
  const { addSecretaria, updateSecretaria } = useSecretarias();

  const form = useForm<SecretariaFormData>({
    resolver: zodResolver(secretariaSchema),
    defaultValues: {
      nome: secretaria?.nome || '',
      descricao: secretaria?.descricao || '',
      ativo: secretaria?.ativo ?? true,
    },
  });

  React.useEffect(() => {
    if (secretaria) {
      form.reset({
        nome: secretaria.nome,
        descricao: secretaria.descricao || '',
        ativo: secretaria.ativo,
      });
    } else {
      form.reset({
        nome: '',
        descricao: '',
        ativo: true,
      });
    }
  }, [secretaria, form]);

  const handleSubmit = async (data: SecretariaFormData) => {
    try {
      if (secretaria) {
        await updateSecretaria(secretaria.id, data);
      } else {
        await addSecretaria({
          nome: data.nome,
          descricao: data.descricao,
          ativo: data.ativo,
        });
      }
      
      onSubmit?.();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Erro ao salvar secretaria:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {secretaria ? 'Editar Secretaria' : 'Nova Secretaria'}
          </DialogTitle>
          <DialogDescription>
            {secretaria 
              ? 'Edite as informações da secretaria.'
              : 'Adicione uma nova secretaria ao sistema.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Secretaria de Saúde" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição da secretaria..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Ativo</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Secretaria disponível para seleção
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {secretaria ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};