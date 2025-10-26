// TelaRelatorios.js - VERSÃO COMPLETA COM PDF
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from './components/Header';
import CustomButton from './components/CustomButton';
import { formatCurrency } from './formatCurrency';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const screenWidth = Dimensions.get('window').width - 32;

const PERIODOS = [
  { id: 'este_mes', nome: 'Este Mês' },
  { id: 'mes_passado', nome: 'Mês Passado' },
  { id: 'este_ano', nome: 'Este Ano' },
  { id: 'ano_passado', nome: 'Ano Passado' },
  { id: 'ultimos_3_meses', nome: 'Últimos 3 Meses' },
  { id: 'ultimos_6_meses', nome: 'Últimos 6 Meses' },
];

export default function TelaRelatorios({ navigation }) {
  const [gastos, setGastos] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [perfil, setPerfil] = useState({});
  const [showFiltroModal, setShowFiltroModal] = useState(false);
  const [periodoSelecionado, setPeriodoSelecionado] = useState('este_mes');
  const [dadosRelatorio, setDadosRelatorio] = useState({
    receitaTotal: 0,
    despesaTotal: 0,
    saldoPeriodo: 0,
    categoriaMaisGasta: '',
    valorCategoriaMaisGasta: 0,
    transacoes: [],
  });

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    gerarRelatorio();
  }, [gastos, receitas, perfil, periodoSelecionado]);

  const carregarDados = async () => {
    try {
      const gastosStr = await AsyncStorage.getItem('@gastos');
      const receitasStr = await AsyncStorage.getItem('@receitas');
      const perfilStr = await AsyncStorage.getItem('@perfil');
      
      if (gastosStr) setGastos(JSON.parse(gastosStr));
      if (receitasStr) setReceitas(JSON.parse(receitasStr));
      if (perfilStr) setPerfil(JSON.parse(perfilStr));
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    }
  };

  const filtrarPorPeriodo = (transacoes) => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    return transacoes.filter(transacao => {
      try {
        if (!transacao.data || typeof transacao.data !== 'string') return false;
        
        const [dia, mes, ano] = transacao.data.split('/');
        if (!dia || !mes || !ano) return false;
        
        const dataTransacao = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
        if (isNaN(dataTransacao.getTime())) return false;

        let dataInicio = new Date();
        let dataFim = new Date();

        switch (periodoSelecionado) {
          case 'este_mes':
            dataInicio = new Date(anoAtual, mesAtual, 1);
            dataFim = new Date(anoAtual, mesAtual + 1, 0);
            break;
          
          case 'mes_passado':
            dataInicio = new Date(anoAtual, mesAtual - 1, 1);
            dataFim = new Date(anoAtual, mesAtual, 0);
            break;
          
          case 'este_ano':
            dataInicio = new Date(anoAtual, 0, 1);
            dataFim = new Date(anoAtual, 11, 31);
            break;
          
          case 'ano_passado':
            dataInicio = new Date(anoAtual - 1, 0, 1);
            dataFim = new Date(anoAtual - 1, 11, 31);
            break;
          
          case 'ultimos_3_meses':
            dataInicio = new Date();
            dataInicio.setMonth(dataInicio.getMonth() - 3);
            break;
          
          case 'ultimos_6_meses':
            dataInicio = new Date();
            dataInicio.setMonth(dataInicio.getMonth() - 6);
            break;
          
          default:
            return true;
        }

        dataFim.setHours(23, 59, 59, 999);
        return dataTransacao >= dataInicio && dataTransacao <= dataFim;

      } catch (error) {
        return false;
      }
    });
  };

  const gerarRelatorio = () => {
    const gastosFiltrados = filtrarPorPeriodo(gastos);
    const receitasFiltradas = filtrarPorPeriodo(receitas);
    
    const receitaBase = periodoSelecionado.includes('mes') || periodoSelecionado.includes('3_meses') || periodoSelecionado.includes('6_meses')
      ? perfil.rendaMensalLiquida || 0 
      : 0;

    const receitaTotal = receitasFiltradas.reduce((sum, r) => sum + (r.valor || 0), 0) + receitaBase;
    const despesaTotal = gastosFiltrados.reduce((sum, g) => sum + (g.valor || 0), 0);
    const saldoPeriodo = receitaTotal - despesaTotal;

    // Encontrar categoria mais gasta
    const gastosAgrupados = {};
    gastosFiltrados.forEach(gasto => {
      if (gastosAgrupados[gasto.categoria]) {
        gastosAgrupados[gasto.categoria] += gasto.valor;
      } else {
        gastosAgrupados[gasto.categoria] = gasto.valor;
      }
    });

    let categoriaMaisGasta = '';
    let valorCategoriaMaisGasta = 0;
    Object.entries(gastosAgrupados).forEach(([categoria, valor]) => {
      if (valor > valorCategoriaMaisGasta) {
        categoriaMaisGasta = categoria;
        valorCategoriaMaisGasta = valor;
      }
    });

    // Combinar todas as transações
    const todasTransacoes = [
      ...gastosFiltrados.map(g => ({ ...g, tipo: 'gasto' })),
      ...receitasFiltradas.map(r => ({ ...r, tipo: 'receita' }))
    ].sort((a, b) => {
      try {
        const [diaA, mesA, anoA] = a.data.split('/');
        const [diaB, mesB, anoB] = b.data.split('/');
        const dataA = new Date(anoA, mesA - 1, diaA);
        const dataB = new Date(anoB, mesB - 1, diaB);
        return dataB - dataA;
      } catch {
        return 0;
      }
    });

    setDadosRelatorio({
      receitaTotal,
      despesaTotal,
      saldoPeriodo,
      categoriaMaisGasta,
      valorCategoriaMaisGasta,
      transacoes: todasTransacoes,
    });
  };

  const gerarGraficoDespesas = () => {
    const gastosFiltrados = filtrarPorPeriodo(gastos);
    
    if (gastosFiltrados.length === 0) return [];

    const gastosAgrupados = {};
    
    gastosFiltrados.forEach(gasto => {
      if (gastosAgrupados[gasto.categoria]) {
        gastosAgrupados[gasto.categoria] += gasto.valor;
      } else {
        gastosAgrupados[gasto.categoria] = gasto.valor;
      }
    });

    const cores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F44336', '#BB8FCE', '#85C1E9', '#F8C471'];
    
    return Object.entries(gastosAgrupados).map(([categoria, valor], index) => ({
      name: categoria.charAt(0).toUpperCase() + categoria.slice(1),
      amount: valor,
      color: cores[index % cores.length],
      legendFontColor: '#333',
      legendFontSize: 12,
    }));
  };

  const gerarGraficoBarras = () => {
    return {
      labels: ['Receitas', 'Despesas'],
      datasets: [{
        data: [dadosRelatorio.receitaTotal > 0 ? dadosRelatorio.receitaTotal : 0.1, 
               dadosRelatorio.despesaTotal > 0 ? dadosRelatorio.despesaTotal : 0.1]
      }]
    };
  };

  // FUNÇÃO PARA GERAR PDF - NOVA
  const gerarPDF = async () => {
    try {
      const periodo = PERIODOS.find(p => p.id === periodoSelecionado)?.nome;
      const dataGeracao = new Date().toLocaleDateString('pt-BR');
      const horaGeracao = new Date().toLocaleTimeString('pt-BR');
      
      // HTML para o PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Relatório Financeiro</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    color: #333;
                }
                .header { 
                    text-align: center; 
                    border-bottom: 2px solid #003366; 
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .header h1 { 
                    color: #003366; 
                    margin: 0;
                }
                .info { 
                    font-size: 12px; 
                    color: #666; 
                    margin-bottom: 20px;
                }
                .section { 
                    margin-bottom: 25px; 
                }
                .section h2 { 
                    color: #003366; 
                    border-bottom: 1px solid #ddd; 
                    padding-bottom: 5px;
                }
                .kpi-container { 
                    display: flex; 
                    justify-content: space-between; 
                    margin-bottom: 15px;
                }
                .kpi-card { 
                    flex: 1; 
                    padding: 15px; 
                    border-radius: 8px; 
                    margin: 0 5px;
                    text-align: center;
                }
                .receita { background-color: #e8f5e8; border: 1px solid #4CAF50; }
                .despesa { background-color: #ffeaea; border: 1px solid #F44336; }
                .saldo { background-color: #e8f4fd; border: 1px solid #2196F3; }
                .kpi-valor { 
                    font-size: 18px; 
                    font-weight: bold; 
                    margin-top: 5px;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-top: 10px;
                }
                th, td { 
                    border: 1px solid #ddd; 
                    padding: 8px; 
                    text-align: left;
                }
                th { 
                    background-color: #f5f5f5; 
                    font-weight: bold;
                }
                .receita-row { background-color: #f9fff9; }
                .gasto-row { background-color: #fff9f9; }
                .insight { 
                    background-color: #fff9e6; 
                    padding: 10px; 
                    border-left: 4px solid #FF9800;
                    margin: 5px 0;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>RELATÓRIO FINANCEIRO</h1>
                <div class="info">
                    Período: ${periodo} | Gerado em: ${dataGeracao} às ${horaGeracao}
                </div>
            </div>

            <div class="section">
                <h2>RESUMO EXECUTIVO</h2>
                <div class="kpi-container">
                    <div class="kpi-card receita">
                        <strong>Receita Total</strong>
                        <div class="kpi-valor">${formatCurrency(dadosRelatorio.receitaTotal)}</div>
                    </div>
                    <div class="kpi-card despesa">
                        <strong>Despesa Total</strong>
                        <div class="kpi-valor">${formatCurrency(dadosRelatorio.despesaTotal)}</div>
                    </div>
                    <div class="kpi-card saldo">
                        <strong>Saldo do Período</strong>
                        <div class="kpi-valor" style="color: ${dadosRelatorio.saldoPeriodo >= 0 ? '#4CAF50' : '#F44336'}">
                            ${formatCurrency(dadosRelatorio.saldoPeriodo)}
                        </div>
                    </div>
                </div>
            </div>

            ${dadosRelatorio.categoriaMaisGasta ? `
            <div class="section">
                <h2>DESTAQUE</h2>
                <p><strong>Categoria que mais gastou:</strong> ${dadosRelatorio.categoriaMaisGasta.charAt(0).toUpperCase() + dadosRelatorio.categoriaMaisGasta.slice(1)} - ${formatCurrency(dadosRelatorio.valorCategoriaMaisGasta)}</p>
            </div>
            ` : ''}

            <div class="section">
                <h2>TRANSAÇÕES DETALHADAS (${dadosRelatorio.transacoes.length})</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th>Tipo</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dadosRelatorio.transacoes.map(transacao => `
                            <tr class="${transacao.tipo === 'receita' ? 'receita-row' : 'gasto-row'}">
                                <td>${transacao.data}</td>
                                <td>${transacao.descricao}</td>
                                <td>${transacao.categoria.charAt(0).toUpperCase() + transacao.categoria.slice(1)}</td>
                                <td>${transacao.tipo === 'receita' ? 'Receita' : 'Despesa'}</td>
                                <td style="color: ${transacao.tipo === 'receita' ? '#4CAF50' : '#F44336'}">
                                    ${transacao.tipo === 'receita' ? '+' : '-'} ${formatCurrency(transacao.valor)}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            ${insights.length > 0 ? `
            <div class="section">
                <h2>INSIGHTS E SUGESTÕES</h2>
                ${insights.map(insight => `
                    <div class="insight">${insight}</div>
                `).join('')}
            </div>
            ` : ''}

            <div style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 10px; color: #999; text-align: center;">
                Relatório gerado automaticamente pelo App Financeiro
            </div>
        </body>
        </html>
      `;

      // Gerar PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });

      // Compartilhar PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartilhar Relatório Financeiro'
        });
      } else {
        Alert.alert(
          'PDF Gerado',
          `Relatório salvo em: ${uri}`,
          [{ text: 'OK' }]
        );
      }

    } catch (error) {
      console.log('Erro ao gerar PDF:', error);
      Alert.alert('Erro', 'Não foi possível gerar o PDF');
    }
  };

  const exportarRelatorio = async () => {
    Alert.alert(
      'Exportar Relatório',
      'Escolha o formato de exportação:',
      [
        {
          text: 'PDF (Recomendado)',
          onPress: gerarPDF
        },
        {
          text: 'Texto Simples',
          onPress: exportarTexto
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  const exportarTexto = async () => {
    try {
      const periodo = PERIODOS.find(p => p.id === periodoSelecionado)?.nome;
      
      let conteudo = `RELATÓRIO FINANCEIRO - ${periodo}\n`;
      conteudo += `Gerado em: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
      
      conteudo += `RESUMO EXECUTIVO:\n`;
      conteudo += `📈 Receita Total: ${formatCurrency(dadosRelatorio.receitaTotal)}\n`;
      conteudo += `📉 Despesa Total: ${formatCurrency(dadosRelatorio.despesaTotal)}\n`;
      conteudo += `💰 Saldo do Período: ${formatCurrency(dadosRelatorio.saldoPeriodo)}\n\n`;
      
      if (dadosRelatorio.categoriaMaisGasta) {
        conteudo += `🎯 DESTAQUE:\n`;
        conteudo += `Categoria que mais gastou: ${dadosRelatorio.categoriaMaisGasta} - ${formatCurrency(dadosRelatorio.valorCategoriaMaisGasta)}\n\n`;
      }
      
      conteudo += `📋 TRANSAÇÕES DETALHADAS (${dadosRelatorio.transacoes.length}):\n`;
      dadosRelatorio.transacoes.forEach((transacao, index) => {
        const icone = transacao.tipo === 'receita' ? '⬆️' : '⬇️';
        conteudo += `${index + 1}. ${icone} ${transacao.descricao} | ${transacao.categoria} | ${transacao.data} | ${formatCurrency(transacao.valor)}\n`;
      });
      
      conteudo += `\n💡 INSIGHTS:\n`;
      const insights = gerarInsights();
      insights.forEach((insight, index) => {
        conteudo += `• ${insight}\n`;
      });
      
      Alert.alert(
        'Relatório em Texto',
        `Período: ${periodo}\n\nResumo:\nReceitas: ${formatCurrency(dadosRelatorio.receitaTotal)}\nDespesas: ${formatCurrency(dadosRelatorio.despesaTotal)}\nSaldo: ${formatCurrency(dadosRelatorio.saldoPeriodo)}`,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      Alert.alert('Erro', 'Falha ao gerar relatório');
    }
  };

  const gerarInsights = () => {
    const insights = [];
    
    if (dadosRelatorio.saldoPeriodo > 0) {
      insights.push(`✅ Parabéns! Você teve um saldo positivo de ${formatCurrency(dadosRelatorio.saldoPeriodo)} no período. Continue assim!`);
    } else if (dadosRelatorio.saldoPeriodo < 0) {
      insights.push(`⚠️ Atenção! Você gastou ${formatCurrency(Math.abs(dadosRelatorio.saldoPeriodo))} a mais do que recebeu. Considere reduzir os gastos.`);
    }

    if (dadosRelatorio.categoriaMaisGasta) {
      insights.push(`🎯 Sua maior categoria de gastos foi "${dadosRelatorio.categoriaMaisGasta.charAt(0).toUpperCase() + dadosRelatorio.categoriaMaisGasta.slice(1)}" com ${formatCurrency(dadosRelatorio.valorCategoriaMaisGasta)}.`);
    }

    const percentualGastos = dadosRelatorio.receitaTotal > 0 
      ? (dadosRelatorio.despesaTotal / dadosRelatorio.receitaTotal) * 100 
      : 0;
    
    if (percentualGastos > 80) {
      insights.push(`🔴 Você gastou ${percentualGastos.toFixed(1)}% da sua receita. Isso é um sinal de alerta, pois sobra pouco para investir.`);
    } else if (percentualGastos < 50) {
      insights.push(`🟢 Excelente! Você gastou apenas ${percentualGastos.toFixed(1)}% da sua receita. Ótimo potencial de economia.`);
    }

    return insights;
  };

  const chartData = gerarGraficoDespesas();
  const barData = gerarGraficoBarras();
  const insights = gerarInsights();

  return (
    <SafeAreaView style={styles.safe}>
      <Header 
        title="Relatórios Financeiros" 
        leftIcon="arrow-back" 
        onLeftPress={() => navigation.goBack()}
        rightIcon="filter-list"
        onRightPress={() => setShowFiltroModal(true)}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Período Selecionado */}
        <View style={styles.periodoCard}>
          <Text style={styles.periodoText}>
            Período: {PERIODOS.find(p => p.id === periodoSelecionado)?.nome}
          </Text>
          <TouchableOpacity onPress={exportarRelatorio} style={styles.exportButton}>
            <Ionicons name="download" size={24} color="#003366" />
            <Text style={styles.exportText}>Exportar</Text>
          </TouchableOpacity>
        </View>

        {/* Resumo Executivo */}
        <View style={styles.resumoCard}>
          <Text style={styles.cardTitle}>Resumo Executivo</Text>
          
          <View style={styles.kpiRow}>
            <View style={styles.kpiItem}>
              <Text style={styles.kpiLabel}>Receita Total</Text>
              <Text style={[styles.kpiValue, { color: '#4CAF50' }]}>
                {formatCurrency(dadosRelatorio.receitaTotal)}
              </Text>
            </View>
            
            <View style={styles.kpiItem}>
              <Text style={styles.kpiLabel}>Despesa Total</Text>
              <Text style={[styles.kpiValue, { color: '#F44336' }]}>
                {formatCurrency(dadosRelatorio.despesaTotal)}
              </Text>
            </View>
          </View>
          
          <View style={styles.saldoContainer}>
            <Text style={styles.kpiLabel}>Saldo do Período</Text>
            <Text style={[
              styles.saldoValue, 
              { color: dadosRelatorio.saldoPeriodo >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              {formatCurrency(dadosRelatorio.saldoPeriodo)}
            </Text>
          </View>

          {dadosRelatorio.categoriaMaisGasta && (
            <View style={styles.categoriaDestaque}>
              <Text style={styles.categoriaLabel}>Categoria que mais gastou:</Text>
              <Text style={styles.categoriaNome}>
                {dadosRelatorio.categoriaMaisGasta.charAt(0).toUpperCase() + dadosRelatorio.categoriaMaisGasta.slice(1)} - {formatCurrency(dadosRelatorio.valorCategoriaMaisGasta)}
              </Text>
            </View>
          )}
        </View>

        {/* Gráfico de Receita vs Despesa */}
        {dadosRelatorio.receitaTotal > 0 || dadosRelatorio.despesaTotal > 0 ? (
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>Comparativo Receita vs Despesa</Text>
            <BarChart
              data={barData}
              width={screenWidth}
              height={220}
              yAxisLabel="R$"
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 51, 102, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                },
                propsForLabels: {
                  fontSize: 12,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="bar-chart-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Sem dados para gerar gráficos</Text>
            <Text style={styles.emptySubtext}>
              Adicione receitas e despesas no período selecionado.
            </Text>
          </View>
        )}

        {/* Gráfico de Despesas por Categoria */}
        {chartData.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>Despesas por Categoria</Text>
            <PieChart
              data={chartData}
              width={screenWidth}
              height={220}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 51, 102, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
              }}
              style={{
                borderRadius: 16,
              }}
            />
          </View>
        )}

        {/* Insights e Sugestões */}
        {insights.length > 0 && (
          <View style={styles.insightsCard}>
            <Text style={styles.cardTitle}>Insights e Sugestões</Text>
            {insights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <Ionicons name="bulb-outline" size={20} color="#FF9800" />
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Transações Detalhadas */}
        {dadosRelatorio.transacoes.length > 0 && (
          <View style={styles.transacoesCard}>
            <Text style={styles.cardTitle}>Transações Recentes</Text>
            {dadosRelatorio.transacoes.slice(0, 5).map((transacao, index) => (
              <View key={index} style={styles.transacaoItem}>
                <View style={styles.transacaoInfo}>
                  <Text style={styles.transacaoDescricao}>{transacao.descricao}</Text>
                  <Text style={styles.transacaoCategoria}>
                    {transacao.categoria.charAt(0).toUpperCase() + transacao.categoria.slice(1)}
                  </Text>
                  <Text style={styles.transacaoData}>{transacao.data}</Text>
                </View>
                <Text style={[
                  styles.transacaoValor, 
                  { color: transacao.tipo === 'receita' ? '#4CAF50' : '#F44336' }
                ]}>
                  {transacao.tipo === 'receita' ? '+' : '-'} {formatCurrency(transacao.valor)}
                </Text>
              </View>
            ))}
            {dadosRelatorio.transacoes.length > 5 && (
              <Text style={styles.maisTransacoes}>
                ... mais {dadosRelatorio.transacoes.length - 5} transações no período.
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal de Filtro - CORRIGIDO */}
      <Modal visible={showFiltroModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Filtrar Período</Text>
            
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={periodoSelecionado}
                onValueChange={(itemValue) => setPeriodoSelecionado(itemValue)}
                style={styles.picker}
                dropdownIconColor="#003366"
              >
                {PERIODOS.map(p => (
                  <Picker.Item 
                    key={p.id} 
                    label={p.nome} 
                    value={p.id} 
                    color="#333"
                  />
                ))}
              </Picker>
            </View>
            
            <View style={styles.modalButtons}>
              <CustomButton
                title="CANCELAR"
                onPress={() => setShowFiltroModal(false)}
                type="secondary"
                style={{ flex: 1, marginHorizontal: 5 }}
                textColor="#003366"
              />
              <CustomButton
                title="APLICAR"
                onPress={() => {
                  gerarRelatorio();
                  setShowFiltroModal(false);
                }}
                style={{ flex: 1, marginHorizontal: 5 }}
                textColor="#ffffff"
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  periodoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#003366',
  },
  periodoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  exportText: {
    fontSize: 12,
    color: '#003366',
    marginLeft: 5,
    fontWeight: '600',
  },
  resumoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 16,
    textAlign: 'center',
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  kpiItem: {
    flex: 1,
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saldoContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  saldoValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  categoriaDestaque: {
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  categoriaLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  categoriaNome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  insightsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    lineHeight: 20,
  },
  transacoesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  transacaoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transacaoInfo: {
    flex: 1,
  },
  transacaoDescricao: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  transacaoCategoria: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transacaoData: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  transacaoValor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  maisTransacoes: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  // Estilos do Modal CORRIGIDOS
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 300,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    backgroundColor: '#fff',
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});