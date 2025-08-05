
export interface Equipamento {
  id: string;
  modelo: string;
  processado: string;
  patrimonio: number;
  setor: string;
  localizacao: string;
  aquisicao?: string;
  estadoConservacao: 'Meia-vida' | 'Fim-da-vida' | 'Novo' | 'Conservado';
  vidaUtil?: string;
  observacoes?: string;
  dataUltimaMovimentacao?: string;
  dataCadastro: string;
  status: 'Ativo' | 'Desativado';
}

export interface Movimentacao {
  id: string;
  equipamentoId: string;
  equipamento: string;
  patrimonio: number;
  setorOrigem: string;
  setorDestino: string;
  dataMovimentacao: string;
  responsavel: string;
  motivo: string;
  observacoes?: string;
}

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'user';
  setor: string;
  created_at?: string;
  updated_at?: string;
}
