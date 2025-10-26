// TelaPatrimonio.js - VERSÃO ATUALIZADA (com texto branco nos botões, formatação de data e gráfico melhorado)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from './components/Header';
import CustomButton from './components/CustomButton';
import CustomTextInput from './components/CustomTextInput';
import { formatCurrency } from './formatCurrency';

const screenWidth = Dimensions.get('window').width - 32;

const TIPOS_ATIVOS = [
  { id: 'conta_corrente', nome: 'Conta Corrente', categoria: 'liquidez', cor: '#4CAF50' },
  { id: 'poupanca', nome: 'Poupança', categoria: 'liquidez', cor: '#45a049' },
  { id: 'tesouro_direto', nome: 'Tesouro Direto', categoria: 'investimento', cor: '#2196F3' },
  { id: 'acoes', nome: 'Ações', categoria: 'investimento', cor: '#1976D2' },
  { id: 'fundos', nome: 'Fundos de Investimento', categoria: 'investimento', cor: '#03A9F4' },
  { id: 'imovel', nome: 'Imóvel', categoria: 'bem', cor: '#FF9800' },
  { id: 'veiculo', nome: 'Veículo', categoria: 'bem', cor: '#F57C00' },
  { id: 'outros', nome: 'Outros', categoria: 'bem', cor: '#795548' },
];

const TIPOS_PASSIVOS = [
  { id: 'cartao_credito', nome: 'Cartão de Crédito', cor: '#F44336' },
  { id: 'financiamento_imovel', nome: 'Financiamento Imobiliário', cor: '#d32f2f' },
  { id: 'financiamento_veiculo', nome: 'Financiamento Veicular', cor: '#c62828' },
  { id: 'emprestimo_pessoal', nome: 'Empréstimo Pessoal', cor: '#b71c1c' },
  { id: 'outros', nome: 'Outros', cor: '#8B4513' },
];

export default function TelaPatrimonio({ navigation }) {
  const [ativos, setAtivos] = useState([]);
  const [passivos, setPassivos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('ativo');
  const [novoItem, setNovoItem] = useState({
    tipo: '',
    descricao: '',
    valor: '',
    dataAquisicao: '',
    observacoes: '',
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const ativosStr = await AsyncStorage.getItem('@ativos');
      const passivosStr = await AsyncStorage.getItem('@passivos');
      
      if (ativosStr) setAtivos(JSON.parse(ativosStr));
      if (passivosStr) setPassivos(JSON.parse(passivosStr));
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    }
  };

  const salvarAtivos = async (novosAtivos) => {
    try {
      await AsyncStorage.setItem('@ativos', JSON.stringify(novosAtivos));
      setAtivos(novosAtivos);
    } catch (error) {
      console.log('Erro ao salvar ativos:', error);
    }
  };

  const salvarPassivos = async (novosPassivos) => {
    try {
      await AsyncStorage.setItem('@passivos', JSON.stringify(novosPassivos));
      setPassivos(novosPassivos);
    } catch (error) {
      console.log('Erro ao salvar passivos:', error);
    }
  };

  // Função para formatar data automaticamente
  const formatarData = (text) => {
    let cleanedText = text.replace(/\D/g, ''); // Remove tudo que não é dígito
    let formattedText = '';

    if (cleanedText.length > 0) {
      formattedText = cleanedText.substring(0, 2); // DD
    }
    if (cleanedText.length >= 3) {
      formattedText += '/' + cleanedText.substring(2, 4); // DD/MM
    }
    if (cleanedText.length >= 5) {
      formattedText += '/' + cleanedText.substring(4, 8); // DD/MM/AAAA
    }

    return formattedText;
  };

  const adicionarItem = () => {
    if (!novoItem.descricao.trim() || !novoItem.valor.trim() || !novoItem.tipo) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const item = {
      id: Date.now().toString(),
      tipo: novoItem.tipo,
      descricao: novoItem.descricao,
      valor: parseFloat(novoItem.valor.replace(',', '.')),
      dataAquisicao: novoItem.dataAquisicao,
      observacoes: novoItem.observacoes,
      criadoEm: new Date().toLocaleDateString('pt-BR'),
    };

    if (tipoModal === 'ativo') {
      const novosAtivos = [item, ...ativos];
      salvarAtivos(novosAtivos);
    } else {
      const novosPassivos = [item, ...passivos];
      salvarPassivos(novosPassivos);
    }

    // Reset form
    setNovoItem({
      tipo: '',
      descricao: '',
      valor: '',
      dataAquisicao: '',
      observacoes: '',
    });
    setShowModal(false);
    
    Alert.alert('Sucesso', `${tipoModal === 'ativo' ? 'Ativo' : 'Passivo'} adicionado com sucesso!`);
  };

  const removerItem = (id, tipo) => {
    Alert.alert(
      'Remover',
      `Deseja realmente excluir este ${tipo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            if (tipo === 'ativo') {
              const novosAtivos = ativos.filter(a => a.id !== id);
              salvarAtivos(novosAtivos);
            } else {
              const novosPassivos = passivos.filter(p => p.id !== id);
              salvarPassivos(novosPassivos);
            }
          },
        },
      ]
    );
  };

  // Cálculos
  const totalAtivos = ativos.reduce((sum, a) => sum + a.valor, 0);
  const totalPassivos = passivos.reduce((sum, p) => sum + p.valor, 0);
  const patrimonioLiquido = totalAtivos - totalPassivos;
  const variacao = 0;

  // Dados para gráfico de composição - MELHORADO
  const ativosPorCategoria = TIPOS_ATIVOS.map(tipo => {
    const valor = ativos
      .filter(a => a.tipo === tipo.id)
      .reduce((sum, a) => sum + a.valor, 0);
    
    return {
      name: tipo.nome,
      amount: valor,
      color: tipo.cor,
      legendFontColor: '#333',
      legendFontSize: 10 // Reduzido para caber melhor
    };
  }).filter(item => item.amount > 0);

  const passivosPorTipo = TIPOS_PASSIVOS.map(tipo => {
    const valor = passivos
      .filter(p => p.tipo === tipo.id)
      .reduce((sum, p) => sum + p.valor, 0);
    
    return {
      name: tipo.nome,
      amount: valor,
      color: tipo.cor,
      legendFontColor: '#333',
      legendFontSize: 10
    };
  }).filter(item => item.amount > 0);

  // Gráfico principal - apenas ativos por categoria
  const chartData = ativosPorCategoria;

  const abrirModal = (tipo) => {
    setTipoModal(tipo);
    setNovoItem({
      tipo: '',
      descricao: '',
      valor: '',
      dataAquisicao: '',
      observacoes: '',
    });
    setShowModal(true);
  };

  const renderItem = ({ item, tipo }) => {
    const tipoInfo = tipo === 'ativo' 
      ? TIPOS_ATIVOS.find(t => t.id === item.tipo)
      : TIPOS_PASSIVOS.find(t => t.id === item.tipo);

    const iconName = tipo === 'ativo' ? 'add-circle' : 'remove-circle';
    const iconColor = tipo === 'ativo' ? '#4CAF50' : '#F44336';
  
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <Ionicons name={iconName} size={24} color={iconColor} style={{ marginRight: 10 }} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemDescricao}>{item.descricao}</Text>
            <Text style={styles.itemTipo}>{tipoInfo ? tipoInfo.nome : 'Tipo não encontrado'}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.itemValor, { color: iconColor }]}>
              {formatCurrency(item.valor)}
            </Text>
            <TouchableOpacity onPress={() => removerItem(item.id, tipo)} style={{ marginTop: 5 }}>
              <Ionicons name="trash-outline" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
        {item.observacoes && (
          <Text style={styles.itemObservacoes}>{item.observacoes}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header 
        title="Meu Patrimônio" 
        leftIcon="arrow-back" 
        onLeftPress={() => navigation.goBack()}
        rightIcon="add-circle-outline"
        onRightPress={() => abrirModal('ativo')}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* KPIs Principais */}
        <View style={styles.kpiContainer}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Patrimônio Líquido</Text>
            <Text style={[styles.kpiValue, { color: patrimonioLiquido >= 0 ? '#4CAF50' : '#F44336' }]}>
              {formatCurrency(patrimonioLiquido)}
            </Text>
            <Text style={styles.kpiVariacao}>
              Variação: {variacao >= 0 ? '+' : ''}{variacao.toFixed(1)}%
            </Text>
          </View>
        </View>

        <View style={styles.kpiRow}>
          <View style={styles.kpiCardSmall}>
            <Text style={styles.kpiLabelSmall}>Total Ativos</Text>
            <Text style={[styles.kpiValueSmall, { color: '#4CAF50' }]}>
              {formatCurrency(totalAtivos)}
            </Text>
          </View>
          <View style={styles.kpiCardSmall}>
            <Text style={styles.kpiLabelSmall}>Total Passivos</Text>
            <Text style={[styles.kpiValueSmall, { color: '#F44336' }]}>
              {formatCurrency(totalPassivos)}
            </Text>
          </View>
        </View>

        {/* Gráfico de Composição - MELHORADO */}
        {chartData.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>Composição dos Ativos</Text>
            <PieChart
              data={chartData}
              width={screenWidth - 40} // Reduzido para caber melhor
              height={200} // Reduzido
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="10" // Reduzido
              hasLegend={true}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              absolute // Mostra valores absolutos
            />
          </View>
        )}

        {/* Gráfico de Passivos se houver */}
        {passivosPorTipo.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>Composição dos Passivos</Text>
            <PieChart
              data={passivosPorTipo}
              width={screenWidth - 40}
              height={200}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="10"
              hasLegend={true}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              absolute
            />
          </View>
        )}

        {/* Botões de Ação - COM TEXTO BRANCO */}
        <View style={styles.actionButtons}>
          <CustomButton 
            title="ADICIONAR ATIVO"
            onPress={() => abrirModal('ativo')}
            type="primary"
            style={{ flex: 1, marginHorizontal: 4, backgroundColor: '#4CAF50' }}
            textColor="#ffffff" // ✅ TEXTO BRANCO
          />
          
          <CustomButton 
            title="ADICIONAR PASSIVO"
            onPress={() => abrirModal('passivo')}
            type="danger"
            style={{ flex: 1, marginHorizontal: 4 }}
            textColor="#ffffff" // ✅ TEXTO BRANCO
          />
        </View>

        {/* Lista de Ativos */}
        {ativos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meus Ativos ({ativos.length})</Text>
            <FlatList
              data={ativos}
              keyExtractor={item => item.id}
              renderItem={({ item }) => renderItem({ item, tipo: 'ativo' })}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Lista de Passivos */}
        {passivos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meus Passivos ({passivos.length})</Text>
            <FlatList
              data={passivos}
              keyExtractor={item => item.id}
              renderItem={({ item }) => renderItem({ item, tipo: 'passivo' })}
              scrollEnabled={false}
            />
          </View>
        )}
        
        {/* Estado vazio */}
        {ativos.length === 0 && passivos.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="stats-chart-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum ativo ou passivo registrado</Text>
            <Text style={styles.emptySubtext}>
              Comece a registrar seu patrimônio financeiro.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de Adicionar Item - COM FORMATAÇÃO DE DATA */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Adicionar {tipoModal === 'ativo' ? 'Ativo' : 'Passivo'}
            </Text>
            
            <ScrollView style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tipo *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={novoItem.tipo}
                    onValueChange={(value) => setNovoItem(prev => ({ ...prev, tipo: value }))}
                    style={styles.picker}
                  >
                    <Picker.Item label={`Selecione o Tipo de ${tipoModal === 'ativo' ? 'Ativo' : 'Passivo'}`} value="" />
                    {(tipoModal === 'ativo' ? TIPOS_ATIVOS : TIPOS_PASSIVOS).map(tipo => (
                      <Picker.Item key={tipo.id} label={tipo.nome} value={tipo.id} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descrição *</Text>
                <CustomTextInput
                  iconName="text-fields"
                  placeholder="Ex: Ações da Petrobras, Empréstimo do Banco X"
                  value={novoItem.descricao}
                  onChangeText={(value) => setNovoItem(prev => ({ ...prev, descricao: value }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Valor (R$) *</Text>
                <CustomTextInput
                  iconName="attach-money"
                  placeholder="0,00"
                  keyboardType="numeric"
                  value={novoItem.valor}
                  onChangeText={(value) => setNovoItem(prev => ({ ...prev, valor: value }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Data de Aquisição/Início</Text>
                <CustomTextInput
                  iconName="event"
                  placeholder="DD/MM/AAAA"
                  value={novoItem.dataAquisicao}
                  onChangeText={(value) => setNovoItem(prev => ({ 
                    ...prev, 
                    dataAquisicao: formatarData(value) // ✅ FORMATAÇÃO AUTOMÁTICA
                  }))}
                  maxLength={10}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Observações</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Informações adicionais..."
                  multiline
                  numberOfLines={3}
                  value={novoItem.observacoes}
                  onChangeText={(value) => setNovoItem(prev => ({ ...prev, observacoes: value }))}
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <CustomButton
                title="CANCELAR"
                onPress={() => setShowModal(false)}
                type="secondary"
                style={{ flex: 1, marginHorizontal: 5 }}
              />
              
              <CustomButton
                title="ADICIONAR"
                onPress={adicionarItem}
                type={tipoModal === 'ativo' ? 'primary' : 'danger'}
                style={{ flex: 1, marginHorizontal: 5 }}
                textColor="#ffffff" // ✅ TEXTO BRANCO NO BOTÃO ADICIONAR TAMBÉM
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
  kpiContainer: {
    marginBottom: 20,
  },
  kpiCard: {
    backgroundColor: '#003366',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  kpiLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  kpiValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  kpiVariacao: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  kpiCardSmall: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  kpiLabelSmall: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  kpiValueSmall: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
    marginBottom: 10,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.0,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
  },
  itemDescricao: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemTipo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemValor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemObservacoes: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
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
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});