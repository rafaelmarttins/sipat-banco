import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  User, Mail, Phone, MapPin, Building, Calendar,
  Settings, Activity, BarChart3, FileText, Download,
  CheckCircle, AlertCircle, Camera, Key, Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// ===== INTERFACES =====
interface DadosPessoais {
  nome: string;
  email: string;
  telefone: string;
  matricula: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  foto?: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    cep: string;
    estado: string;
  };
}

interface PreferenciasUsuario {
  tema: 'claro' | 'escuro' | 'automatico';
  idioma: 'pt-BR' | 'en-US' | 'es-ES';
  notificacoes: {
    email: boolean;
    sistema: boolean;
    planejamentosVencendo: boolean;
    viagensProximas: boolean;
    atualizacoesLegislacao: boolean;
  };
  privacidade: {
    perfilPublico: boolean;
    mostrarEstatisticas: boolean;
    compartilharHistorico: boolean;
  };
  interface: {
    sidebarCollapse: boolean;
    mostrarTooltips: boolean;
    animacoes: boolean;
    densidade: 'compacta' | 'normal' | 'confortavel';
  };
}

interface AtividadeRecente {
  id: string;
  tipo: 'calculo' | 'planejamento' | 'viagem' | 'configuracao';
  descricao: string;
  data: string;
  detalhes?: any;
}

interface EstatisticasUsuario {
  totalCalculos: number;
  totalPlanejamentos: number;
  totalViagens: number;
  economiaRealizada: number;
  tempoMedioSistema: number; // em minutos por dia
  ultimoAcesso: string;
  diasAtivo: number;
  recursoMaisUsado: string;
}

// Schema de validação
const dadosSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  matricula: z.string().min(3, 'Matrícula deve ter pelo menos 3 caracteres'),
  cargo: z.string().min(2, 'Cargo deve ter pelo menos 2 caracteres'),
  departamento: z.string().min(2, 'Departamento deve ter pelo menos 2 caracteres'),
  dataAdmissao: z.string().min(1, 'Data de admissão é obrigatória'),
  endereco: z.object({
    logradouro: z.string().min(2, 'Logradouro inválido'),
    numero: z.string().min(1, 'Número é obrigatório'),
    complemento: z.string().optional(),
    bairro: z.string().min(2, 'Bairro inválido'),
    cidade: z.string().min(2, 'Cidade inválida'),
    cep: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
    estado: z.string().min(2, 'Estado inválido')
  })
});

const Perfil: React.FC = () => {
  // Estados
  const [abaSelecionada, setAbaSelecionada] = useState<'dados' | 'preferencias' | 'atividades' | 'estatisticas'>('dados');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [mostrarTodasAtividades, setMostrarTodasAtividades] = useState(false);
  const { toast } = useToast();

  // Dados do usuário
  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoais>({
    nome: 'Nome Completo do Servidor',
    email: 'nome@chapadaodosul.ms.gov.br',
    telefone: '(67) 99999-9999',
    matricula: '2025001',
    cargo: 'Cargo / Função',
    departamento: 'Secretaria / Departamento / Setor',
    dataAdmissao: '2020-01-15',
    endereco: {
      logradouro: 'Rua das Flores',
      numero: '123',
      complemento: 'Apto 101',
      bairro: 'Centro',
      cidade: 'Chapadão do Sul',
      cep: '79560-000',
      estado: 'MS'
    }
  });

  // Form setup
  const form = useForm<DadosPessoais>({
    resolver: zodResolver(dadosSchema),
    defaultValues: dadosPessoais,
    mode: 'onChange'
  });

  // Watch form values for real-time updates
  const watchedValues = form.watch();

  const [preferencias, setPreferencias] = useState<PreferenciasUsuario>({
    tema: 'claro',
    idioma: 'pt-BR',
    notificacoes: {
      email: true,
      sistema: true,
      planejamentosVencendo: true,
      viagensProximas: true,
      atualizacoesLegislacao: false
    },
    privacidade: {
      perfilPublico: false,
      mostrarEstatisticas: true,
      compartilharHistorico: false
    },
    interface: {
      sidebarCollapse: false,
      mostrarTooltips: true,
      animacoes: true,
      densidade: 'normal'
    }
  });

  const [atividadesRecentes] = useState<AtividadeRecente[]>([
    {
      id: '1',
      tipo: 'calculo',
      descricao: 'Calculou diárias para viagem a Campo Grande',
      data: '2025-08-01T14:30:00Z'
    },
    {
      id: '2',
      tipo: 'planejamento',
      descricao: 'Criou planejamento "Reunião com Secretário de Estado"',
      data: '2025-07-31T10:15:00Z'
    },
    {
      id: '3',
      tipo: 'configuracao',
      descricao: 'Atualizou preferências de notificação',
      data: '2025-07-30T16:45:00Z'
    },
    {
      id: '4',
      tipo: 'viagem',
      descricao: 'Marcou viagem como concluída',
      data: '2025-07-29T09:20:00Z'
    },
    {
      id: '5',
      tipo: 'calculo',
      descricao: 'Calculou diárias para viagem a Brasília',
      data: '2025-07-28T11:00:00Z'
    }
  ]);

  const [estatisticasUsuario] = useState<EstatisticasUsuario>({
    totalCalculos: 42,
    totalPlanejamentos: 18,
    totalViagens: 15,
    economiaRealizada: 12500.50,
    tempoMedioSistema: 45,
    ultimoAcesso: '2025-08-02T08:30:00Z',
    diasAtivo: 156,
    recursoMaisUsado: 'Calculadora de Diárias'
  });

  // Carregar dados do localStorage
  useEffect(() => {
    const dadosArmazenados = localStorage.getItem('perfil-usuario');
    if (dadosArmazenados) {
      try {
        const dados = JSON.parse(dadosArmazenados);
        const novoDados = dados.dadosPessoais || dadosPessoais;
        setDadosPessoais(novoDados);
        setPreferencias(dados.preferencias || preferencias);
        form.reset(novoDados);
      } catch (e) {
        // Profile data corrupted, clearing storage
        localStorage.removeItem('perfil-usuario');
      }
    }
  }, []);

  // Formatação de data/hora
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarDataHora = (data: string) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Salvar dados no localStorage
  const salvarDados = async (dados: DadosPessoais) => {
    try {
      // Garantir que a foto seja incluída nos dados salvos
      const dadosComFoto = {
        ...dados,
        foto: dadosPessoais.foto // Manter a foto do estado atual
      };
      
      const dadosParaSalvar = {
        dadosPessoais: dadosComFoto,
        preferencias,
        ultimaAtualizacao: new Date().toISOString()
      };
      
      localStorage.setItem('perfil-usuario', JSON.stringify(dadosParaSalvar));
      setDadosPessoais(dadosComFoto);
      setModoEdicao(false);
      
      // Disparar evento customizado para notificar outras partes da aplicação
      window.dispatchEvent(new CustomEvent('profile-updated'));
      
      // Show success toast
      toast({
        title: "Sucesso!",
        description: "Dados salvos com sucesso.",
      });
      
      // Success - data saved
    } catch (error) {
      // Error occurred during save operation
      toast({
        title: "Erro",
        description: "Erro ao salvar dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const salvarPreferencias = () => {
    const dadosParaSalvar = {
      dadosPessoais,
      preferencias,
      ultimaAtualizacao: new Date().toISOString()
    };
    
    localStorage.setItem('perfil-usuario', JSON.stringify(dadosParaSalvar));
    
    toast({
      title: "Sucesso!",
      description: "Preferências salvas com sucesso.",
    });
  };

  const getAtividadeIcon = (tipo: string) => {
    const icones = {
      calculo: BarChart3,
      planejamento: FileText,
      viagem: MapPin,
      configuracao: Settings
    };
    const IconComponent = icones[tipo as keyof typeof icones] || Activity;
    return <IconComponent className="h-4 w-4" />;
  };

  const getAtividadeCor = (tipo: string) => {
    const cores = {
      calculo: 'text-green-600 bg-green-100',
      planejamento: 'text-blue-600 bg-blue-100',
      viagem: 'text-purple-600 bg-purple-100',
      configuracao: 'text-orange-600 bg-orange-100'
    };
    return cores[tipo as keyof typeof cores] || 'text-gray-600 bg-gray-100';
  };

  const uploadFoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const maxSize = 4 * 1024 * 1024; // 4MB
      if (!isImage || file.size > maxSize) {
        toast({
          title: 'Arquivo inválido',
          description: 'Envie uma imagem (JPG/PNG/WebP) de até 4MB.',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const novaFoto = e.target?.result as string;
        setDadosPessoais({
          ...dadosPessoais,
          foto: novaFoto
        });
        form.setValue('foto', novaFoto);
      };
      reader.readAsDataURL(file);
    }
  };

  // Máscaras para formatação
  const formatarTelefone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatarCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const exportarDados = () => {
    const dadosParaExportar = {
      dadosPessoais,
      preferencias,
      estatisticas: estatisticasUsuario,
      exportadoEm: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dadosParaExportar, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'perfil-usuario.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais e preferências do sistema</p>
      </div>

      {/* Navegação por abas */}
      <div className="bg-white rounded-lg shadow-lg border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" role="tablist">
            {[
              { id: 'dados', label: 'Dados Pessoais', icon: User },
              { id: 'preferencias', label: 'Preferências', icon: Settings },
              { id: 'atividades', label: 'Atividades', icon: Activity },
              { id: 'estatisticas', label: 'Estatísticas', icon: BarChart3 }
            ].map((aba) => {
              const Icon = aba.icon;
              return (
                <button
                  key={aba.id}
                  onClick={() => setAbaSelecionada(aba.id as any)}
                  role="tab"
                  aria-selected={abaSelecionada === aba.id}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    abaSelecionada === aba.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {aba.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Aba Dados Pessoais */}
          {abaSelecionada === 'dados' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Informações Pessoais</h3>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={exportarDados}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Dados
                  </Button>
                  <Button
                    variant={modoEdicao ? "destructive" : "default"}
                    onClick={() => {
                      if (modoEdicao) {
                        setModoEdicao(false);
                        form.reset(dadosPessoais);
                      } else {
                        setModoEdicao(true);
                      }
                    }}
                  >
                    {modoEdicao ? 'Cancelar' : 'Editar'}
                  </Button>
                </div>
              </div>

              {/* Foto do perfil */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {dadosPessoais.foto ? (
                      <img src={dadosPessoais.foto} alt="Foto do perfil" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  {modoEdicao && (
                    <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors">
                      <Camera className="h-3 w-3" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={uploadFoto}
                        className="hidden"
                        aria-label="Upload de foto"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {modoEdicao ? (watchedValues.nome || dadosPessoais.nome) : dadosPessoais.nome}
                  </h4>
                  <p className="text-gray-600">
                    {modoEdicao ? (watchedValues.cargo || dadosPessoais.cargo) : dadosPessoais.cargo}
                  </p>
                  <p className="text-sm text-gray-500">
                    {modoEdicao ? (watchedValues.departamento || dadosPessoais.departamento) : dadosPessoais.departamento}
                  </p>
                </div>
              </div>

              {/* Formulário de dados */}
              {modoEdicao ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(salvarDados)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="nome">Nome Completo</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" aria-hidden="true" />
                                <Input {...field} id="nome" className="pl-10" />
                              </div>
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
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" aria-hidden="true" />
                                <Input {...field} id="email" type="email" className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="telefone">Telefone</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" aria-hidden="true" />
                                <Input 
                                  {...field} 
                                  id="telefone"
                                  className="pl-10"
                                  onChange={(e) => field.onChange(formatarTelefone(e.target.value))}
                                  maxLength={15}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="matricula"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="matricula">Matrícula</FormLabel>
                            <FormControl>
                              <Input {...field} id="matricula" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dataAdmissao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="dataAdmissao">Data de Admissão</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" aria-hidden="true" />
                                <Input {...field} id="dataAdmissao" type="date" className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cargo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="cargo">Cargo</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" aria-hidden="true" />
                                <Input {...field} id="cargo" className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="departamento"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel htmlFor="departamento">Departamento</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" aria-hidden="true" />
                                <Input {...field} id="departamento" className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">
                        Salvar Dados
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Nome Completo</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">{dadosPessoais.nome}</div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">{dadosPessoais.email}</div>
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">{dadosPessoais.telefone}</div>
                  </div>
                  <div>
                    <Label>Matrícula</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">{dadosPessoais.matricula}</div>
                  </div>
                  <div>
                    <Label>Data de Admissão</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {formatarData(dadosPessoais.dataAdmissao)}
                    </div>
                  </div>
                  <div>
                    <Label>Cargo</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">{dadosPessoais.cargo}</div>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Departamento</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">{dadosPessoais.departamento}</div>
                  </div>
                </div>
              )}

              {/* Endereço */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Endereço</h4>
                {modoEdicao ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="logradouro">Logradouro</Label>
                      <Input
                        id="logradouro"
                        value={dadosPessoais.endereco.logradouro}
                        onChange={(e) => setDadosPessoais({
                          ...dadosPessoais,
                          endereco: {...dadosPessoais.endereco, logradouro: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="numero">Número</Label>
                      <Input
                        id="numero"
                        value={dadosPessoais.endereco.numero}
                        onChange={(e) => setDadosPessoais({
                          ...dadosPessoais,
                          endereco: {...dadosPessoais.endereco, numero: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input
                        id="complemento"
                        value={dadosPessoais.endereco.complemento}
                        onChange={(e) => setDadosPessoais({
                          ...dadosPessoais,
                          endereco: {...dadosPessoais.endereco, complemento: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input
                        id="bairro"
                        value={dadosPessoais.endereco.bairro}
                        onChange={(e) => setDadosPessoais({
                          ...dadosPessoais,
                          endereco: {...dadosPessoais.endereco, bairro: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        value={dadosPessoais.endereco.cidade}
                        onChange={(e) => setDadosPessoais({
                          ...dadosPessoais,
                          endereco: {...dadosPessoais.endereco, cidade: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        value={dadosPessoais.endereco.cep}
                        onChange={(e) => setDadosPessoais({
                          ...dadosPessoais,
                          endereco: {...dadosPessoais.endereco, cep: formatarCEP(e.target.value)}
                        })}
                        maxLength={9}
                        placeholder="00000-000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="estado">Estado</Label>
                      <Input
                        id="estado"
                        value={dadosPessoais.endereco.estado}
                        onChange={(e) => setDadosPessoais({
                          ...dadosPessoais,
                          endereco: {...dadosPessoais.endereco, estado: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label>Logradouro</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md border">{dadosPessoais.endereco.logradouro}</div>
                    </div>
                    <div>
                      <Label>Número</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md border">{dadosPessoais.endereco.numero}</div>
                    </div>
                    <div>
                      <Label>Complemento</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md border">{dadosPessoais.endereco.complemento || '-'}</div>
                    </div>
                    <div>
                      <Label>Bairro</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md border">{dadosPessoais.endereco.bairro}</div>
                    </div>
                    <div>
                      <Label>Cidade</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md border">{dadosPessoais.endereco.cidade}</div>
                    </div>
                    <div>
                      <Label>CEP</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md border">{dadosPessoais.endereco.cep}</div>
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md border">{dadosPessoais.endereco.estado}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Seção de Segurança */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Segurança</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Key className="h-5 w-5 text-gray-600" aria-hidden="true" />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">Senha</h5>
                      <p className="text-sm text-gray-600">Última alteração: há 3 meses</p>
                    </div>
                    <Button variant="secondary">
                      Alterar Senha
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba Preferências */}
          {abaSelecionada === 'preferencias' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Preferências do Sistema</h3>

              {/* Tema e Aparência */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Tema e Aparência</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                    <select
                      value={preferencias.tema}
                      onChange={(e) => setPreferencias({
                        ...preferencias,
                        tema: e.target.value as any
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="claro">Claro</option>
                      <option value="escuro">Escuro</option>
                      <option value="automatico">Automático</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Densidade da Interface</label>
                    <select
                      value={preferencias.interface.densidade}
                      onChange={(e) => setPreferencias({
                        ...preferencias,
                        interface: {...preferencias.interface, densidade: e.target.value as any}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="compacta">Compacta</option>
                      <option value="normal">Normal</option>
                      <option value="confortavel">Confortável</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={preferencias.interface.mostrarTooltips}
                      onChange={(e) => setPreferencias({
                        ...preferencias,
                        interface: {...preferencias.interface, mostrarTooltips: e.target.checked}
                      })}
                      className="rounded text-green-600"
                    />
                    <span className="text-sm text-gray-700">Mostrar dicas de ferramentas (tooltips)</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={preferencias.interface.animacoes}
                      onChange={(e) => setPreferencias({
                        ...preferencias,
                        interface: {...preferencias.interface, animacoes: e.target.checked}
                      })}
                      className="rounded text-green-600"
                    />
                    <span className="text-sm text-gray-700">Ativar animações da interface</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={preferencias.interface.sidebarCollapse}
                      onChange={(e) => setPreferencias({
                        ...preferencias,
                        interface: {...preferencias.interface, sidebarCollapse: e.target.checked}
                      })}
                      className="rounded text-green-600"
                    />
                    <span className="text-sm text-gray-700">Iniciar com sidebar recolhida</span>
                  </label>
                </div>
              </div>

              {/* Notificações */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Notificações</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={preferencias.notificacoes.email}
                      onChange={(e) => setPreferencias({
                        ...preferencias,
                        notificacoes: {...preferencias.notificacoes, email: e.target.checked}
                      })}
                      className="rounded text-green-600"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">Notificações por email</span>
                      <p className="text-xs text-gray-600">Receber emails sobre atividades importantes</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={preferencias.notificacoes.sistema}
                      onChange={(e) => setPreferencias({
                        ...preferencias,
                        notificacoes: {...preferencias.notificacoes, sistema: e.target.checked}
                      })}
                      className="rounded text-green-600"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">Notificações do sistema</span>
                      <p className="text-xs text-gray-600">Alertas e avisos dentro do sistema</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={preferencias.notificacoes.planejamentosVencendo}
                      onChange={(e) => setPreferencias({
                        ...preferencias,
                        notificacoes: {...preferencias.notificacoes, planejamentosVencendo: e.target.checked}
                      })}
                      className="rounded text-green-600"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">Planejamentos vencendo</span>
                      <p className="text-xs text-gray-600">Avisar sobre planejamentos próximos do prazo</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={preferencias.notificacoes.viagensProximas}
                      onChange={(e) => setPreferencias({
                        ...preferencias,
                        notificacoes: {...preferencias.notificacoes, viagensProximas: e.target.checked}
                      })}
                      className="rounded text-green-600"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">Viagens próximas</span>
                      <p className="text-xs text-gray-600">Lembrar sobre viagens agendadas</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={preferencias.notificacoes.atualizacoesLegislacao}
                      onChange={(e) => setPreferencias({
                        ...preferencias,
                        notificacoes: {...preferencias.notificacoes, atualizacoesLegislacao: e.target.checked}
                      })}
                      className="rounded text-green-600"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">Atualizações na legislação</span>
                      <p className="text-xs text-gray-600">Notificar sobre mudanças em decretos e portarias</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Privacidade */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Privacidade</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={preferencias.privacidade.perfilPublico}
                      onChange={(e) => setPreferencias({
                        ...preferencias,
                        privacidade: {...preferencias.privacidade, perfilPublico: e.target.checked}
                      })}
                      className="rounded text-green-600"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">Perfil público</span>
                      <p className="text-xs text-gray-600">Permitir que outros usuários vejam informações básicas do perfil</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={preferencias.privacidade.mostrarEstatisticas}
                      onChange={(e) => setPreferencias({
                        ...preferencias,
                        privacidade: {...preferencias.privacidade, mostrarEstatisticas: e.target.checked}
                      })}
                      className="rounded text-green-600"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">Mostrar estatísticas</span>
                      <p className="text-xs text-gray-600">Incluir suas estatísticas nos relatórios gerais do sistema</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={preferencias.privacidade.compartilharHistorico}
                      onChange={(e) => setPreferencias({
                        ...preferencias,
                        privacidade: {...preferencias.privacidade, compartilharHistorico: e.target.checked}
                      })}
                      className="rounded text-green-600"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">Compartilhar histórico</span>
                      <p className="text-xs text-gray-600">Usar dados anonimizados para melhorar o sistema</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Idioma */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Idioma e Localização</h4>
                <div className="flex items-center gap-4">
                  <Globe className="h-5 w-5 text-gray-600" />
                  <select
                    value={preferencias.idioma}
                    onChange={(e) => setPreferencias({
                      ...preferencias,
                      idioma: e.target.value as any
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español (España)</option>
                  </select>
                </div>
              </div>

              {/* Botão Salvar */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button onClick={salvarPreferencias}>
                  Salvar Preferências
                </Button>
              </div>
            </div>
          )}

          {/* Aba Atividades */}
          {abaSelecionada === 'atividades' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Atividades Recentes</h3>
                <Button
                  variant="outline"
                  onClick={() => setMostrarTodasAtividades(!mostrarTodasAtividades)}
                >
                  {mostrarTodasAtividades ? 'Mostrar Menos' : 'Ver Todas'}
                </Button>
              </div>

              <div className="space-y-4">
                {(mostrarTodasAtividades ? atividadesRecentes : atividadesRecentes.slice(0, 5))
                  .map((atividade) => (
                  <div key={atividade.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${getAtividadeCor(atividade.tipo)}`}>
                      {getAtividadeIcon(atividade.tipo)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{atividade.descricao}</p>
                      <p className="text-xs text-gray-500">{formatarDataHora(atividade.data)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {!mostrarTodasAtividades && atividadesRecentes.length > 5 && (
                <p className="text-center text-sm text-gray-500">
                  Mostrando 5 de {atividadesRecentes.length} atividades
                </p>
              )}
            </div>
          )}

          {/* Aba Estatísticas */}
          {abaSelecionada === 'estatisticas' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Minhas Estatísticas</h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                    <h4 className="font-medium text-blue-900">Cálculos</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{estatisticasUsuario.totalCalculos}</p>
                  <p className="text-sm text-blue-700">Total realizados</p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-6 w-6 text-green-600" />
                    <h4 className="font-medium text-green-900">Planejamentos</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{estatisticasUsuario.totalPlanejamentos}</p>
                  <p className="text-sm text-green-700">Criados</p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="h-6 w-6 text-purple-600" />
                    <h4 className="font-medium text-purple-900">Viagens</h4>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{estatisticasUsuario.totalViagens}</p>
                  <p className="text-sm text-purple-700">Realizadas</p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="h-6 w-6 text-orange-600" />
                    <h4 className="font-medium text-orange-900">Economia</h4>
                  </div>
                  <p className="text-2xl font-bold text-orange-900">{formatarMoeda(estatisticasUsuario.economiaRealizada)}</p>
                  <p className="text-sm text-orange-700">Realizada</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Uso do Sistema</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tempo médio diário:</span>
                      <span className="font-medium">{estatisticasUsuario.tempoMedioSistema} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dias ativo:</span>
                      <span className="font-medium">{estatisticasUsuario.diasAtivo} dias</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Último acesso:</span>
                      <span className="font-medium">{formatarDataHora(estatisticasUsuario.ultimoAcesso)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recurso mais usado:</span>
                      <span className="font-medium">{estatisticasUsuario.recursoMaisUsado}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Conquistas</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-700">Primeiro cálculo realizado</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-700">10 planejamentos criados</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-700">Usuário ativo por 6 meses</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-500">50 cálculos realizados (8 restantes)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;