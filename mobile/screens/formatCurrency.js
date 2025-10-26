// formatCurrency.js - VERSÃO ATUALIZADA
/**
 * Formata um valor numérico para o formato de moeda brasileira (Real - R$).
 * 
 * @param {number} value O valor numérico a ser formatado.
 * @returns {string} O valor formatado como string (ex: "R$ 1.234,56").
 */
export const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    // Tenta converter se for string, senão retorna um valor padrão
    const numValue = parseFloat(String(value).replace(',', '.'));
    if (isNaN(numValue)) {
      return 'R$ 0,00';
    }
    value = numValue;
  }

  // Usa o Intl.NumberFormat para formatação correta de moeda
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Exemplo de uso:
// console.log(formatCurrency(1234.56)); // Saída: R$ 1.234,56
// console.log(formatCurrency(1000)); // Saída: R$ 1.000,00
// console.log(formatCurrency(0.99)); // Saída: R$ 0,99
