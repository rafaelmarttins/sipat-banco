
import { Equipamento, Movimentacao } from '@/types/patrimonio';

export const mockEquipamentos: Equipamento[] = [
  {
    id: '1',
    modelo: 'PC',
    processado: 'I3 - 3250',
    patrimonio: 8071,
    setor: 'Recepção',
    localizacao: 'ESF Central',
    estadoConservacao: 'Conservado',
    dataCadastro: '2024-01-15',
    status: 'Ativo'
  },
  {
    id: '2',
    modelo: 'Monitor',
    processado: 'Acer 18,5"',
    patrimonio: 11789,
    setor: 'Recepção',
    localizacao: 'ESF Central',
    estadoConservacao: 'Conservado',
    dataCadastro: '2024-01-16',
    status: 'Ativo'
  },
  {
    id: '3',
    modelo: 'Impressora',
    processado: 'HP M127FN',
    patrimonio: 10389,
    setor: 'Recepção',
    localizacao: 'ESF Central',
    estadoConservacao: 'Fim-da-vida',
    dataCadastro: '2024-02-10',
    status: 'Ativo'
  },
  {
    id: '4',
    modelo: 'PC',
    processado: 'I3 - 7100',
    patrimonio: 11792,
    setor: 'Farmácia',
    localizacao: 'ESF Central',
    estadoConservacao: 'Meia-vida',
    dataCadastro: '2024-02-15',
    status: 'Ativo'
  },
  {
    id: '5',
    modelo: 'Monitor',
    processado: 'Acer 18,5"',
    patrimonio: 11781,
    setor: 'Farmácia',
    localizacao: 'ESF Central',
    estadoConservacao: 'Conservado',
    dataCadastro: '2024-03-01',
    status: 'Ativo'
  },
  {
    id: '6',
    modelo: 'Monitor',
    processado: 'Acer 18,5"',
    patrimonio: 11780,
    setor: 'Pré-Consulta',
    localizacao: 'ESF Central',
    estadoConservacao: 'Meia-vida',
    dataCadastro: '2024-03-05',
    status: 'Ativo'
  },
  {
    id: '7',
    modelo: 'PC',
    processado: 'I3 - 7100',
    patrimonio: 11791,
    setor: 'Pré-Consulta',
    localizacao: 'ESF Central',
    estadoConservacao: 'Conservado',
    dataCadastro: '2024-03-10',
    status: 'Ativo'
  },
  {
    id: '8',
    modelo: 'Impressora',
    processado: 'Samsung 2165',
    patrimonio: 2538,
    setor: 'Pré-Consulta',
    localizacao: 'ESF Central',
    estadoConservacao: 'Fim-da-vida',
    dataCadastro: '2024-03-15',
    status: 'Desativado'
  },
  {
    id: '9',
    modelo: 'Monitor',
    processado: 'AOC 18,5"',
    patrimonio: 1397,
    setor: 'Vacina',
    localizacao: 'ESF Central',
    estadoConservacao: 'Meia-vida',
    dataCadastro: '2024-04-01',
    status: 'Ativo'
  },
  {
    id: '10',
    modelo: 'PC',
    processado: 'I5-3550',
    patrimonio: 766,
    setor: 'Vacina',
    localizacao: 'ESF Central',
    estadoConservacao: 'Conservado',
    dataCadastro: '2024-04-05',
    status: 'Ativo'
  },
  {
    id: '11',
    modelo: 'Nobreak',
    processado: 'APC 1200VA',
    patrimonio: 15001,
    setor: 'Recepção',
    localizacao: 'ESF Central',
    estadoConservacao: 'Conservado',
    dataCadastro: '2024-04-10',
    status: 'Ativo'
  },
  {
    id: '12',
    modelo: 'Notebook',
    processado: 'Dell Inspiron 15',
    patrimonio: 15002,
    setor: 'Farmácia',
    localizacao: 'ESF Central',
    estadoConservacao: 'Conservado',
    dataCadastro: '2024-04-15',
    status: 'Ativo'
  }
];

// Lista de localizações disponíveis para cadastro
export const mockLocalizacoes = [
  'ESF Central', 'ESF Bela Vista', 'ESF Jardim América', 'ESF Vila Real',
  'Secretaria de Saúde', 'Secretaria de Educação', 'Secretaria de Obras',
  'Secretaria de Finanças', 'Secretaria de Administração', 'Gabinete do Prefeito',
  'Protocolo', 'Almoxarifado', 'Arquivo Central', 'Auditório', 'Sala de Reuniões'
];

export const mockMovimentacoes: Movimentacao[] = [
  {
    id: '1',
    equipamentoId: '1',
    equipamento: 'PC I3 - 3250',
    patrimonio: 8071,
    setorOrigem: 'TI',
    setorDestino: 'Recepção',
    dataMovimentacao: '2024-01-15',
    responsavel: 'João Silva',
    motivo: 'Redistribuição de equipamentos'
  },
  {
    id: '2',
    equipamentoId: '4',
    equipamento: 'PC I3 - 7100',
    patrimonio: 11792,
    setorOrigem: 'Recepção',
    setorDestino: 'Farmácia',
    dataMovimentacao: '2024-02-20',
    responsavel: 'Maria Santos',
    motivo: 'Necessidade do setor'
  },
  {
    id: '3',
    equipamentoId: '8',
    equipamento: 'Impressora Samsung 2165',
    patrimonio: 2538,
    setorOrigem: 'Farmácia',
    setorDestino: 'Pré-Consulta',
    dataMovimentacao: '2024-03-10',
    responsavel: 'Carlos Oliveira',
    motivo: 'Manutenção preventiva'
  }
];
