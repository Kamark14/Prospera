import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateReportPDF = (data) => {
  const {
    summaryData,
    monthlyData,
    categoryData,
    goalsData,
    selectedPeriod
  } = data;

  const doc = new jsPDF();
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const checkPageBreak = (neededSpace) => {
    if (yPosition + neededSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // ===== HEADER =====
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório Financeiro', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Prospera - Gestão Financeira Pessoal', pageWidth / 2, 30, { align: 'center' });

  yPosition = 50;

  // ===== PERIOD INFO =====
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  const periodLabels = {
    'current-month': 'Mês Atual',
    'last-month': 'Mês Passado',
    'last-3-months': 'Últimos 3 Meses',
    'last-6-months': 'Últimos 6 Meses',
    'current-year': 'Ano Atual'
  };
  doc.text(`Período: ${periodLabels[selectedPeriod] || 'Personalizado'}`, 14, yPosition);
  doc.text(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - 14, yPosition, { align: 'right' });
  
  yPosition += 15;

  // ===== SUMMARY SECTION =====
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('Resumo Financeiro', 14, yPosition);
  yPosition += 10;

  const monthlyTableData = monthlyData.map(item => [
    item.month,
    formatCurrency(item.receitas),
    formatCurrency(item.despesas),
    formatCurrency(item.saldo)
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['Mês', 'Receitas', 'Despesas', 'Saldo']],
    body: monthlyTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    }
  });

  yPosition = doc.lastAutoTable.finalY + 20;

  // Salva o PDF
  const fileName = `Relatorio_Financeiro_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
