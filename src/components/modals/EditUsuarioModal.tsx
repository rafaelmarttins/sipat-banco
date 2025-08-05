import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Usuario } from '@/hooks/useUsuarios';
import { useLocalizacoes } from '@/hooks/useLocalizacoes';

const editUsuarioSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  setor: z.string().min(1, 'Setor é obrigatório'),
  localizacao_id: z.string().optional(),
  role: z.enum(['admin', 'user'], {
    required_error: 'Perfil é obrigatório',
  }),
});

type EditUsuarioFormData = z.infer<typeof editUsuarioSchema>;

interface EditUsuarioModalProps {
  usuario: Usuario | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: Partial<Usuario>) => Promise<{ success: boolean; error?: string }>;
}

const EditUsuarioModal: React.FC<EditUsuarioModalProps> = ({
  usuario,
  open,
  onOpenChange,
  onSubmit,
}) => {
  const { localizacoes } = useLocalizacoes();
  const form = useForm<EditUsuarioFormData>({
    resolver: zodResolver(editUsuarioSchema),
    defaultValues: {
      nome: '',
      email: '',
      setor: '',
      localizacao_id: 'none',
      role: 'user',
    },
  });

  useEffect(() => {
    if (usuario) {
      form.reset({
        nome: usuario.nome,
        email: usuario.email,
        setor: usuario.setor,
        localizacao_id: usuario.localizacao_id || 'none',
        role: usuario.role,
      });
    }
  }, [usuario, form]);

  const handleSubmit = async (data: EditUsuarioFormData) => {
    if (!usuario) return;

    const updatedData: Partial<Usuario> = {
      nome: data.nome,
      email: data.email,
      setor: data.setor,
      localizacao_id: data.localizacao_id === 'none' ? null : data.localizacao_id,
      role: data.role,
    };

    const result = await onSubmit(usuario.id, updatedData);
    if (result.success) {
      onOpenChange(false);
    }
  };

  if (!usuario) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário {usuario.nome}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do usuário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="setor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setor</FormLabel>
                  <FormControl>
                    <Input placeholder="Setor de trabalho" {...field} />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a localização" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma localização</SelectItem>
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

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perfil</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUsuarioModal;