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
    
    // Cores do sistema
    const primaryColor = [34, 44, 63];
    const secondaryColor = [241, 245, 249];
    const accentColor = [59, 130, 246];
    const mutedColor = [100, 116, 139];
    const successColor = [34, 197, 94];
    const dangerColor = [239, 68, 68];
    
    // Cabeçalho principal
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('📋 Detalhes dos Equipamentos', 14, 25);

    let yPosition = 50;

    // Seção de Resumo
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Resumo', 14, yPosition);
    yPosition += 10;

    // Cards de estatísticas
    const totalAtivos = equipamentos.filter(e => e.status === 'Ativo').length;
    const totalDesativados = equipamentos.filter(e => e.status === 'Desativado').length;

    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.roundedRect(20, yPosition, 55, 20, 3, 3, 'F');
    doc.roundedRect(85, yPosition, 55, 20, 3, 3, 'F');
    doc.roundedRect(150, yPosition, 46, 20, 3, 3, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Total:', 24, yPosition + 8);
    doc.setFont('helvetica', 'bold');
    doc.text(equipamentos.length.toString(), 24, yPosition + 15);

    doc.setFont('helvetica', 'normal');
    doc.text('Ativos:', 89, yPosition + 8);
    doc.setFont('helvetica', 'bold');
    doc.text(totalAtivos.toString(), 89, yPosition + 15);

    doc.setFont('helvetica', 'normal');
    doc.text('Desativados:', 154, yPosition + 8);
    doc.setFont('helvetica', 'bold');
    doc.text(totalDesativados.toString(), 154, yPosition + 15);

    yPosition += 35;

    // Filtros aplicados
    if (filtros?.dataInicio || filtros?.dataFim || filtros?.setor || filtros?.status) {
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.roundedRect(14, yPosition, 182, 18, 3, 3, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('FILTROS APLICADOS', 18, yPosition + 11);
      
      yPosition += 25;
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      
      if (filtros?.dataInicio || filtros?.dataFim) {
        doc.text(`• Período: ${filtros?.dataInicio ? this.formatDate(filtros.dataInicio) : 'Início'} até ${filtros?.dataFim ? this.formatDate(filtros.dataFim) : 'Fim'}`, 20, yPosition);
        yPosition += 6;
      }
      if (filtros?.setor) {
        doc.text(`• Setor: ${filtros.setor}`, 20, yPosition);
        yPosition += 6;
      }
      if (filtros?.status) {
        doc.text(`• Status: ${filtros.status}`, 20, yPosition);
        yPosition += 6;
      }
      yPosition += 10;
    }

    // Cronograma de Equipamentos (estilo cascata)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('🔧 Cronograma de Equipamentos', 14, yPosition);
    yPosition += 15;

    // Agrupar por setor
    const equipamentosPorSetor = equipamentos.reduce((acc, eq) => {
      const setor = eq.setor || 'Sem Setor';
      if (!acc[setor]) acc[setor] = [];
      acc[setor].push(eq);
      return acc;
    }, {} as Record<string, typeof equipamentos>);

    Object.entries(equipamentosPorSetor).forEach(([setor, equipamentosSetor], setorIndex) => {
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 20;
      }

      // Cabeçalho do setor
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.roundedRect(14, yPosition, 182, 12, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`${setor} (${equipamentosSetor.length} equipamentos)`, 18, yPosition + 8);
      
      yPosition += 18;

      // Timeline vertical para equipamentos do setor
      equipamentosSetor.forEach((eq, index) => {
        if (yPosition > 260) {
          doc.addPage();
          yPosition = 20;
        }

        // Linha da timeline
        doc.setDrawColor(mutedColor[0], mutedColor[1], mutedColor[2]);
        doc.setLineWidth(0.5);
        if (index < equipamentosSetor.length - 1) {
          doc.line(25, yPosition + 15, 25, yPosition + 45);
        }

        // Círculo de status
        const statusColor = eq.status === 'Ativo' ? successColor : eq.status === 'Desativado' ? dangerColor : mutedColor;
        doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.circle(25, yPosition + 15, 4, 'F');

        // Card do equipamento
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(35, yPosition, 155, 28, 2, 2, 'F');
        doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.setLineWidth(0.3);
        doc.roundedRect(35, yPosition, 155, 28, 2, 2, 'S');

        // Conteúdo do equipamento
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`#${eq.patrimonio} - ${eq.modelo}`, 40, yPosition + 8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(`${eq.processado}`, 40, yPosition + 15);
        doc.text(`Local: ${eq.localizacao?.nome || 'N/A'} | Estado: ${eq.estado_conservacao}`, 40, yPosition + 22);

        // Badge de status
        doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.roundedRect(150, yPosition + 5, 30, 8, 1, 1, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.text(eq.status, 165 - (eq.status.length * 1), yPosition + 10);

        // Data (se disponível)
        if (eq.data_aquisicao) {
          doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          const dataText = this.formatDate(eq.data_aquisicao);
          doc.text(dataText, 190 - (dataText.length * 1.5), yPosition + 20);
        }

        yPosition += 35;
      });

      yPosition += 10; // Espaço entre setores
    });

    // Rodapé
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    const pageHeight = doc.internal.pageSize.height;
    doc.rect(0, pageHeight - 15, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('Sistema de Gestão de Patrimônio - Relatório gerado automaticamente', 14, pageHeight - 5);

    // Download
    doc.save(`relatorio-equipamentos-${format(new Date(), 'dd-MM-yyyy')}.pdf`);
  }

  static async gerarRelatorioMovimentacoesPDF(movimentacoes: Movimentacao[], filtros?: any) {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    // Cores do sistema
    const primaryColor = [34, 44, 63];
    const secondaryColor = [241, 245, 249];
    const accentColor = [168, 85, 247]; // Roxo para movimentações
    const mutedColor = [100, 116, 139];
    
    // Cabeçalho estilizado
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO DE MOVIMENTAÇÕES', 14, 22);
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    
    // Informações gerais
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.roundedRect(14, 45, 85, 25, 3, 3, 'F');
    doc.roundedRect(111, 45, 85, 25, 3, 3, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Data de Geração:', 18, 55);
    doc.setFont('helvetica', 'bold');
    doc.text(format(new Date(), 'dd/MM/yyyy HH:mm'), 18, 62);
    
    doc.setFont('helvetica', 'normal');
    doc.text('Total de Movimentações:', 115, 55);
    doc.setFont('helvetica', 'bold');
    doc.text(movimentacoes.length.toString(), 115, 62);

    let yPosition = 80;

    // Filtros aplicados (se houver)
    if (filtros?.dataInicio || filtros?.dataFim || filtros?.setor || filtros?.localizacao) {
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.roundedRect(14, yPosition, 182, 20, 3, 3, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('FILTROS APLICADOS', 18, yPosition + 8);
      
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'normal');
      yPosition += 25;
      
      if (filtros?.dataInicio || filtros?.dataFim) {
        doc.text(`Período: ${filtros?.dataInicio ? this.formatDate(filtros.dataInicio) : 'Início'} até ${filtros?.dataFim ? this.formatDate(filtros.dataFim) : 'Fim'}`, 18, yPosition);
        yPosition += 8;
      }
      if (filtros?.localizacao) {
        doc.text(`Localização: ${filtros.localizacao}`, 18, yPosition);
        yPosition += 8;
      }
      yPosition += 10;
    }

    // Movimentações em formato de timeline
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('MOVIMENTAÇÕES', 14, yPosition);
    yPosition += 15;

    movimentacoes.forEach((mov, index) => {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      // Card da movimentação
      doc.setFillColor(index % 2 === 0 ? 255 : secondaryColor[0], index % 2 === 0 ? 255 : secondaryColor[1], index % 2 === 0 ? 255 : secondaryColor[2]);
      doc.roundedRect(14, yPosition, 182, 45, 2, 2, 'F');
      
      // Linha do tempo à esquerda
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.rect(14, yPosition, 3, 45, 'F');
      
      // Icon de seta para movimentação
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.circle(25, yPosition + 22, 5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('→', 22, yPosition + 25);
      
      // Conteúdo da movimentação
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`#${mov.equipamento?.patrimonio || 'N/A'} - ${mov.equipamento?.modelo || 'N/A'}`, 35, yPosition + 10);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Data: ${this.formatDateTime(mov.data_movimentacao)}`, 35, yPosition + 18);
      doc.text(`De: ${mov.localizacao_origem?.nome || 'N/A'} → Para: ${mov.localizacao_destino?.nome || 'N/A'}`, 35, yPosition + 26);
      doc.text(`Responsável: ${mov.responsavel?.nome || 'N/A'}`, 35, yPosition + 34);
      doc.text(`Motivo: ${mov.motivo}`, 35, yPosition + 42);
      
      // Badge de data
      doc.setFillColor(mutedColor[0], mutedColor[1], mutedColor[2]);
      doc.roundedRect(150, yPosition + 5, 40, 10, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      const dateText = this.formatDate(mov.data_movimentacao);
      doc.text(dateText, 170 - (dateText.length * 1.2), yPosition + 12);
      
      yPosition += 50;
    });

    // Rodapé
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    const pageHeight = doc.internal.pageSize.height;
    doc.rect(0, pageHeight - 15, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('Sistema de Gestão de Patrimônio - Relatório gerado automaticamente', 14, pageHeight - 5);

    doc.save(`relatorio-movimentacoes-${format(new Date(), 'dd-MM-yyyy')}.pdf`);
  }

  static async gerarRelatorioUsuariosPDF(usuarios: Usuario[]) {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    // Cores do sistema
    const primaryColor = [34, 44, 63];
    const secondaryColor = [241, 245, 249];
    const accentColor = [16, 185, 129]; // Verde para usuários
    const mutedColor = [100, 116, 139];
    
    // Cabeçalho estilizado
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO DE USUÁRIOS', 14, 22);
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    
    // Estatísticas em cards
    const admins = usuarios.filter(u => u.role === 'admin').length;
    const users = usuarios.filter(u => u.role === 'user').length;
    
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.roundedRect(14, 45, 55, 25, 3, 3, 'F');
    doc.roundedRect(80, 45, 55, 25, 3, 3, 'F');
    doc.roundedRect(146, 45, 50, 25, 3, 3, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Total:', 18, 55);
    doc.setFont('helvetica', 'bold');
    doc.text(usuarios.length.toString(), 18, 62);
    
    doc.setFont('helvetica', 'normal');
    doc.text('Administradores:', 84, 55);
    doc.setFont('helvetica', 'bold');
    doc.text(admins.toString(), 84, 62);
    
    doc.setFont('helvetica', 'normal');
    doc.text('Usuários:', 150, 55);
    doc.setFont('helvetica', 'bold');
    doc.text(users.toString(), 150, 62);

    let yPosition = 90;

    // Usuários em formato de cards organizados
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('USUÁRIOS', 14, yPosition);
    yPosition += 15;

    usuarios.forEach((user, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Card do usuário
      doc.setFillColor(index % 2 === 0 ? 255 : secondaryColor[0], index % 2 === 0 ? 255 : secondaryColor[1], index % 2 === 0 ? 255 : secondaryColor[2]);
      doc.roundedRect(14, yPosition, 182, 30, 2, 2, 'F');
      
      // Borda colorida baseada no role
      const roleColor = user.role === 'admin' ? [239, 68, 68] : [34, 197, 94];
      doc.setFillColor(roleColor[0], roleColor[1], roleColor[2]);
      doc.rect(14, yPosition, 3, 30, 'F');
      
      // Avatar/Initial circle
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.circle(30, yPosition + 15, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(user.nome.charAt(0).toUpperCase(), 27, yPosition + 18);
      
      // Conteúdo do usuário
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(user.nome, 45, yPosition + 10);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Email: ${user.email}`, 45, yPosition + 18);
      doc.text(`Setor: ${user.setor} | Cadastro: ${this.formatDate(user.created_at)}`, 45, yPosition + 25);
      
      // Badge de role
      doc.setFillColor(roleColor[0], roleColor[1], roleColor[2]);
      doc.roundedRect(150, yPosition + 5, 40, 10, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      const roleText = user.role === 'admin' ? 'ADMIN' : 'USER';
      doc.text(roleText, 170 - (roleText.length * 1.5), yPosition + 12);
      
      yPosition += 35;
    });

    // Rodapé
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    const pageHeight = doc.internal.pageSize.height;
    doc.rect(0, pageHeight - 15, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('Sistema de Gestão de Patrimônio - Relatório gerado automaticamente', 14, pageHeight - 5);

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