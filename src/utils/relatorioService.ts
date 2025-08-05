import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { Equipamento } from '@/hooks/useEquipamentos';
import { Movimentacao } from '@/hooks/useMovimentacoes';
import { Usuario } from '@/hooks/useUsuarios';

// Tipos para jsPDF com autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: typeof autoTable;
}

export interface RelatorioOptions {
  tipo: 'equipamentos' | 'movimentacoes' | 'usuarios' | 'localizacoes';
  formato: 'pdf' | 'xlsx';
  filtros?: {
    dataInicio?: Date;
    dataFim?: Date;
    setor?: string;
    status?: string;
    localizacao?: string;
  };
}

export class RelatorioService {
  private static formatDate(date: string): string {
    return format(new Date(date), 'dd/MM/yyyy');
  }

  private static formatDateTime(date: string): string {
    return format(new Date(date), 'dd/MM/yyyy HH:mm');
  }

  // ========== RELATÓRIOS PDF ==========
  
  static async gerarRelatorioEquipamentosPDF(equipamentos: Equipamento[], filtros?: any) {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    // Cabeçalho
    doc.setFontSize(20);
    doc.text('Relatório de Equipamentos', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Data de Geração: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 32);
    doc.text(`Total de Equipamentos: ${equipamentos.length}`, 14, 40);

    // Filtros aplicados
    let yPosition = 48;
    if (filtros?.dataInicio || filtros?.dataFim) {
      doc.text(`Período: ${filtros?.dataInicio ? this.formatDate(filtros.dataInicio) : 'Início'} até ${filtros?.dataFim ? this.formatDate(filtros.dataFim) : 'Fim'}`, 14, yPosition);
      yPosition += 8;
    }

    // Tabela
    const tableData = equipamentos.map(eq => [
      eq.patrimonio.toString(),
      eq.modelo,
      eq.processado,
      eq.setor,
      eq.localizacao?.nome || 'N/A',
      eq.estado_conservacao,
      eq.status,
      this.formatDate(eq.created_at)
    ]);

    autoTable(doc, {
      startY: yPosition + 8,
      head: [['Patrimônio', 'Tipo', 'Descrição', 'Setor', 'Localização', 'Estado', 'Status', 'Data Cadastro']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    // Download
    doc.save(`relatorio-equipamentos-${format(new Date(), 'dd-MM-yyyy')}.pdf`);
  }

  static async gerarRelatorioMovimentacoesPDF(movimentacoes: Movimentacao[], filtros?: any) {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    // Cabeçalho
    doc.setFontSize(20);
    doc.text('Relatório de Movimentações', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Data de Geração: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 32);
    doc.text(`Total de Movimentações: ${movimentacoes.length}`, 14, 40);

    // Tabela
    const tableData = movimentacoes.map(mov => [
      this.formatDateTime(mov.data_movimentacao),
      `#${mov.equipamento?.patrimonio || 'N/A'}`,
      mov.equipamento?.modelo || 'N/A',
      mov.localizacao_origem?.nome || 'N/A',
      mov.localizacao_destino?.nome || 'N/A',
      mov.responsavel?.nome || 'N/A',
      mov.motivo
    ]);

    autoTable(doc, {
      startY: 56,
      head: [['Data/Hora', 'Patrimônio', 'Equipamento', 'Origem', 'Destino', 'Responsável', 'Motivo']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [139, 69, 19] }
    });

    doc.save(`relatorio-movimentacoes-${format(new Date(), 'dd-MM-yyyy')}.pdf`);
  }

  static async gerarRelatorioUsuariosPDF(usuarios: Usuario[]) {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    // Cabeçalho
    doc.setFontSize(20);
    doc.text('Relatório de Usuários', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Data de Geração: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 32);
    doc.text(`Total de Usuários: ${usuarios.length}`, 14, 40);

    // Estatísticas
    const admins = usuarios.filter(u => u.role === 'admin').length;
    const users = usuarios.filter(u => u.role === 'user').length;
    doc.text(`Administradores: ${admins} | Usuários: ${users}`, 14, 48);

    // Tabela
    const tableData = usuarios.map(user => [
      user.nome,
      user.email,
      user.setor,
      user.role === 'admin' ? 'Administrador' : 'Usuário',
      this.formatDate(user.created_at)
    ]);

    autoTable(doc, {
      startY: 56,
      head: [['Nome', 'Email', 'Setor', 'Perfil', 'Data Cadastro']],
      body: tableData,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [76, 175, 80] }
    });

    doc.save(`relatorio-usuarios-${format(new Date(), 'dd-MM-yyyy')}.pdf`);
  }

  // ========== RELATÓRIOS XLSX ==========
  
  static async gerarRelatorioEquipamentosXLSX(equipamentos: Equipamento[], filtros?: any) {
    const workbook = XLSX.utils.book_new();
    
    const data = equipamentos.map(eq => ({
      'Patrimônio': eq.patrimonio,
      'Tipo': eq.modelo,
      'Descrição/Processador': eq.processado,
      'Setor': eq.setor,
      'Localização': eq.localizacao?.nome || 'N/A',
      'Estado de Conservação': eq.estado_conservacao,
      'Status': eq.status,
      'Data de Aquisição': eq.data_aquisicao ? this.formatDate(eq.data_aquisicao) : 'N/A',
      'Vida Útil': eq.vida_util || 'N/A',
      'Observações': eq.observacoes || 'N/A',
      'Data de Cadastro': this.formatDate(eq.created_at)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Ajustar largura das colunas
    const columnWidths = [
      { wch: 12 }, // Patrimônio
      { wch: 15 }, // Tipo
      { wch: 25 }, // Descrição
      { wch: 15 }, // Setor
      { wch: 20 }, // Localização
      { wch: 18 }, // Estado
      { wch: 10 }, // Status
      { wch: 15 }, // Data Aquisição
      { wch: 15 }, // Vida Útil
      { wch: 30 }, // Observações
      { wch: 15 }  // Data Cadastro
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipamentos');
    
    // Adicionar página de resumo
    const resumo = [
      { Métrica: 'Total de Equipamentos', Valor: equipamentos.length },
      { Métrica: 'Equipamentos Ativos', Valor: equipamentos.filter(e => e.status === 'Ativo').length },
      { Métrica: 'Equipamentos Desativados', Valor: equipamentos.filter(e => e.status === 'Desativado').length },
      { Métrica: 'Data do Relatório', Valor: format(new Date(), 'dd/MM/yyyy HH:mm') }
    ];
    
    const worksheetResumo = XLSX.utils.json_to_sheet(resumo);
    XLSX.utils.book_append_sheet(workbook, worksheetResumo, 'Resumo');

    XLSX.writeFile(workbook, `relatorio-equipamentos-${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
  }

  static async gerarRelatorioMovimentacoesXLSX(movimentacoes: Movimentacao[]) {
    const workbook = XLSX.utils.book_new();
    
    const data = movimentacoes.map(mov => ({
      'Data/Hora': this.formatDateTime(mov.data_movimentacao),
      'Patrimônio': mov.equipamento?.patrimonio || 'N/A',
      'Tipo Equipamento': mov.equipamento?.modelo || 'N/A',
      'Descrição': mov.equipamento?.processado || 'N/A',
      'Localização Origem': mov.localizacao_origem?.nome || 'N/A',
      'Localização Destino': mov.localizacao_destino?.nome || 'N/A',
      'Responsável': mov.responsavel?.nome || 'N/A',
      'Motivo': mov.motivo,
      'Observações': mov.observacoes || 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    
    const columnWidths = [
      { wch: 18 }, // Data/Hora
      { wch: 12 }, // Patrimônio
      { wch: 15 }, // Tipo
      { wch: 25 }, // Descrição
      { wch: 20 }, // Origem
      { wch: 20 }, // Destino
      { wch: 20 }, // Responsável
      { wch: 30 }, // Motivo
      { wch: 30 }  // Observações
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimentações');

    XLSX.writeFile(workbook, `relatorio-movimentacoes-${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
  }

  static async gerarRelatorioUsuariosXLSX(usuarios: Usuario[]) {
    const workbook = XLSX.utils.book_new();
    
    const data = usuarios.map(user => ({
      'Nome': user.nome,
      'Email': user.email,
      'Setor': user.setor,
      'Perfil': user.role === 'admin' ? 'Administrador' : 'Usuário',
      'Data de Cadastro': this.formatDate(user.created_at),
      'Última Atualização': this.formatDate(user.updated_at)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    
    const columnWidths = [
      { wch: 25 }, // Nome
      { wch: 30 }, // Email
      { wch: 20 }, // Setor
      { wch: 15 }, // Perfil
      { wch: 15 }, // Data Cadastro
      { wch: 18 }  // Última Atualização
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuários');

    XLSX.writeFile(workbook, `relatorio-usuarios-${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
  }
}