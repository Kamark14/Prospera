// TelaContas.js - VERSÃO ATUALIZADA (Refatorada com Header, CustomButton, CustomTextInput e formatCurrency)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  Modal,
  ScrollView,
  Switch
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Header from './components/Header'; // Importando o Header
import CustomButton from './components/CustomButton'; // Importando o CustomButton
import CustomTextInput from './components/CustomTextInput'; // Importando o CustomTextInput
import { formatCurrency } from './formatCurrency'; // Importando a função de formatação

const CATEGORIAS_CONTAS = [
  { id: 'moradia', nome: 'Moradia', icone: 'home', cor: '#4CAF50' },
  { id: 'utilidades', nome: 'Utilidades', icone: 'flash', cor: '#FF9800' },
  { id: 'internet', nome: 'Internet/TV', icone: 'wifi', cor: '#2196F3' },
  { id: 'assinaturas', nome: 'Assinaturas', icone: 'card', cor: '#9C27B0' },
  { id: 'seguros', nome: 'Seguros', icone: 'shield', cor: '#F44336' },
  { id: 'impostos', nome: 'Impostos', icone: 'document-text', cor: '#795548' },
  { id: 'financiamentos', nome: 'Financiamentos', icone: 'card-outline', cor: '#607D8B' },
  { id: 'outros', nome: 'Outros', icone: 'ellipsis-horizontal', cor: '#666' },
];

const FREQUENCIAS = [
  { id: 'unica', nome: 'Única' },
  { id: 'mensal', nome: 'Mensal' },
  { id: 'bimestral', nome: 'Bimestral' },
  { id: 'trimestral', nome: 'Trimestral' },
  { id: 'semestral', nome: 'Semestral' },
  { id: 'anual', nome: 'Anual' },
];

export default function TelaContas({ navigation }) {
  const [contas, setContas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState('proximas'); // 'proximas', 'este_mes', 'atrasadas', 'todas'
  const [novaConta, setNovaConta] = useState({
    nome: '',
    categoria: '',
    valor: '',
    vencimento: '',
    recorrente: false,
    frequencia: 'mensal',
    metodoPagamento: '',
    observacoes: '',
  });

  useEffect(() => {
    carregarContas();
  }, []);

  const carregarContas = async () => {
    try {
      const stored = await AsyncStorage.getItem('@contas');
      if (stored) setContas(JSON.parse(stored));
    } catch (e) {
      console.log('Erro ao carregar contas', e);
    }
  };

  const salvarContas = async (novasContas) => {
    try {
      await AsyncStorage.setItem('@contas', JSON.stringify(novasContas));
      setContas(novasContas);
    } catch (e) {
      console.log('Erro ao salvar contas', e);
    }
  };

  const adicionarConta = () => {
    if (!novaConta.nome.trim() || !novaConta.valor.trim() || !novaConta.vencimento.trim() || !novaConta.categoria) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const conta = {
      id: Date.now().toString(),
      nome: novaConta.nome,
      categoria: novaConta.categoria,
      valor: parseFloat(novaConta.valor.replace(',', '.')), // Converte para float
      vencimento: novaConta.vencimento,
      recorrente: novaConta.recorrente,
      frequencia: novaConta.frequencia,
      metodoPagamento: novaConta.metodoPagamento,
      observacoes: novaConta.observacoes,
      paga: false,
      status: 'pendente', // 'pendente', 'paga', 'atrasada'
      criadaEm: new Date().toLocaleDateString('pt-BR'),
    };

    const novasContas = [conta, ...contas];
    salvarContas(novasContas);
    
    // Reset form
    setNovaConta({
      nome: '',
      categoria: '',
      valor: '',
      vencimento: '',
      recorrente: false,
      frequencia: 'mensal',
      metodoPagamento: '',
      observacoes: '',
    });
    setShowModal(false);
    
    Alert.alert('Sucesso', 'Conta adicionada com sucesso!');
  };

  const togglePaga = (id) => {
    const novasContas = contas.map(conta => {
      if (conta.id === id) {
        return {
          ...conta,
          paga: !conta.paga,
          status: !conta.paga ? 'paga' : 'pendente'
        };
      }
      return conta;
    });
    salvarContas(novasContas);
  };

  const removerConta = (id) => {
    Alert.alert('Remover', 'Excluir esta conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Remover', 
        style: 'destructive', 
        onPress: () => {
          const novasContas = contas.filter(c => c.id !== id);
          salvarContas(novasContas);
        }
      }
    ]);
  };

  // Função para determinar se uma conta está atrasada
  const isContaAtrasada = (conta) => {
    if (conta.paga) return false;
    
    const hoje = new Date();
    // Assumindo que a data está no formato DD/MM/AAAA
    const [dia, mes, ano] = conta.vencimento.split('/');
    // Cria a data no formato AAAA-MM-DD para evitar problemas de fuso horário
    const dataVencimento = new Date(`${ano}-${mes}-${dia}T00:00:00`);
    
    return dataVencimento < hoje;
  };

  // Filtrar contas baseado no filtro ativo
  const contasFiltradas = contas.filter(conta => {
    switch (filtroAtivo) {
      case 'proximas':
        // Próximos 7 dias
        const hoje = new Date();
        const proximaSemana = new Date();
        proximaSemana.setDate(hoje.getDate() + 7);
        
        const [dia, mes, ano] = conta.vencimento.split('/');
        // Cria a data no formato AAAA-MM-DD para evitar problemas de fuso horário
        const dataVencimento = new Date(`${ano}-${mes}-${dia}T00:00:00`);

        // Ajusta 'hoje' para o início do dia para comparação correta (ignora a hora atual)
        const hojeInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        
        return !conta.paga && dataVencimento >= hojeInicio && dataVencimento <= proximaSemana;
      
      case 'este_mes':
        const mesAtual = new Date().getMonth();
        const anoAtual = new Date().getFullYear();
        const [diaC, mesC, anoC] = conta.vencimento.split('/');
        return parseInt(mesC) - 1 === mesAtual && parseInt(anoC) === anoAtual;
      
      case 'atrasadas':
        return isContaAtrasada(conta);
      
      case 'todas':
      default:
        return true;
    }
  }).sort((a, b) => {
    // Ordena por data de vencimento (mais próxima primeiro)
    const [diaA, mesA, anoA] = a.vencimento.split('/');
    const [diaB, mesB, anoB] = b.vencimento.split('/');
    const dataA = new Date(`${anoA}-${mesA}-${diaA}T00:00:00`);
    const dataB = new Date(`${anoB}-${mesB}-${diaB}T00:00:00`);
    return dataA - dataB;
  });

  // Cálculos para KPIs
  const totalAPagar = contas.filter(c => !c.paga).reduce((sum, c) => sum + c.valor, 0);
  const proximosSete = contas.filter(conta => {
    if (conta.paga) return false;
    const hoje = new Date();
    const proximaSemana = new Date();
    proximaSemana.setDate(hoje.getDate() + 7);
    
    const [dia, mes, ano] = conta.vencimento.split('/');
    const dataVencimento = new Date(`${ano}-${mes}-${dia}T00:00:00`);
    
    return dataVencimento >= hoje && dataVencimento <= proximaSemana;
  }).reduce((sum, c) => sum + c.valor, 0);
  
  const contasAtrasadas = contas.filter(isContaAtrasada).reduce((sum, c) => sum + c.valor, 0);

  const renderConta = ({ item }) => {
    const categoria = CATEGORIAS_CONTAS.find(c => c.id === item.categoria);
    const atrasada = isContaAtrasada(item);
    
    return (
      <View style={[styles.contaCard, item.paga && styles.contaPaga]}>
        <View style={styles.contaHeader}>
          <View style={styles.contaInfo}>
            <View style={styles.contaTitleRow}>
              {categoria && (
                <Ionicons 
                  name={categoria.icone} 
                  size={20} 
                  color={categoria.cor} 
                  style={styles.contaIcon} 
                />
              )}
              <Text style={[styles.contaNome, item.paga && styles.textoPago]}>
                {item.nome}
              </Text>
            </View>
            <Text style={[styles.contaCategoria, item.paga && styles.textoPago]}>
              {categoria ? categoria.nome : 'Categoria não encontrada'}
            </Text>
            <Text style={[styles.contaValor, item.paga && styles.textoPago]}>
              {formatCurrency(item.valor)}
            </Text>
            <Text style={[styles.contaVencimento, atrasada && !item.paga && styles.textoAtrasado]}>
              Vence: {item.vencimento}
            </Text>
            {item.recorrente && (
              <Text style={[styles.contaRecorrencia, item.paga && styles.textoPago]}>
                Recorrente: {FREQUENCIAS.find(f => f.id === item.frequencia)?.nome}
              </Text>
            )}
          </View>
          
          <View style={styles.contaActions}>
            <TouchableOpacity 
              onPress={() => togglePaga(item.id)}
              style={styles.checkButton}
            >
              <Ionicons
                name={item.paga ? 'checkmark-circle' : 'ellipse-outline'}
                size={28}
                color={item.paga ? '#4CAF50' : '#ccc'}
              />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => removerConta(item.id)}>
              <Ionicons name="trash-outline" size={24} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
        
        {item.observacoes && (
          <Text style={[styles.contaObservacoes, item.paga && styles.textoPago]}>
            {item.observacoes}
          </Text>
        )}
        
        {atrasada && !item.paga && (
          <View style={styles.alertaAtrasado}>
            <Ionicons name="warning" size={16} color="#F44336" />
            <Text style={styles.textoAlerta}>Conta em atraso!</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* NOVO HEADER */}
      <Header 
        title="Contas a Pagar" 
        leftIcon="arrow-back" 
        onLeftPress={() => navigation.goBack()}
        rightIcon="add-circle-outline"
        onRightPress={() => setShowModal(true)}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* KPIs */}
        <View style={styles.kpiContainer}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Total a Pagar</Text>
            <Text style={styles.kpiValue}>{formatCurrency(totalAPagar)}</Text>
          </View>
          
          <View style={styles.kpiRow}>
            <View style={styles.kpiCardSmall}>
              <Text style={styles.kpiLabelSmall}>Próximos 7 dias</Text>
              <Text style={[styles.kpiValueSmall, { color: '#FF9800' }]}>
                {formatCurrency(proximosSete)}
              </Text>
            </View>
            
            <View style={styles.kpiCardSmall}>
              <Text style={styles.kpiLabelSmall}>Em atraso</Text>
              <Text style={[styles.kpiValueSmall, { color: '#F44336' }]}>
                {formatCurrency(contasAtrasadas)}
              </Text>
            </View>
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.filtrosContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[{ id: 'proximas', nome: 'Próximas' }, { id: 'este_mes', nome: 'Este Mês' }, { id: 'atrasadas', nome: 'Atrasadas' }, { id: 'todas', nome: 'Todas' }].map(filtro => (
              <TouchableOpacity
                key={filtro.id}
                style={[styles.filtroButton, filtroAtivo === filtro.id && styles.filtroAtivo]}
                onPress={() => setFiltroAtivo(filtro.id)}
              >
                <Text style={[styles.filtroText, filtroAtivo === filtro.id && styles.filtroTextAtivo]}>
                  {filtro.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de Contas */}
        {contasFiltradas.length > 0 ? (
          <FlatList
            data={contasFiltradas}
            renderItem={renderConta}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma conta encontrada</Text>
            <Text style={styles.emptySubtext}>
              {filtroAtivo === 'todas' ? 'Comece adicionando uma nova conta.' : `Não há contas para o filtro "${filtroAtivo}".`}
            </Text>
            <CustomButton
              title="ADICIONAR NOVA CONTA"
              onPress={() => setShowModal(true)}
              style={{ marginTop: 20 }}
            />
          </View>
        )}
      </ScrollView>

      {/* Modal de Adicionar Conta */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Adicionar Nova Conta</Text>
            
            <ScrollView style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome da Conta *</Text>
                <CustomTextInput
                  iconName="text-fields"
                  placeholder="Ex: Aluguel, Conta de Luz"
                  value={novaConta.nome}
                  onChangeText={(value) => setNovaConta(prev => ({ ...prev, nome: value }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Valor (R$) *</Text>
                <CustomTextInput
                  iconName="attach-money"
                  placeholder="0,00"
                  keyboardType="numeric"
                  value={novaConta.valor}
                  onChangeText={(value) => setNovaConta(prev => ({ ...prev, valor: value }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vencimento (Dia/Mês/Ano) *</Text>
                <CustomTextInput
                  iconName="event"
                  placeholder="DD/MM/AAAA"
                  value={novaConta.vencimento}
                  onChangeText={(value) => setNovaConta(prev => ({ ...prev, vencimento: value }))}
                  keyboardType="numeric"
                  mask="date"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Categoria *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={novaConta.categoria}
                    onValueChange={(value) => setNovaConta(prev => ({ ...prev, categoria: value }))}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione a categoria" value="" />
                    {CATEGORIAS_CONTAS.map(categoria => (
                      <Picker.Item key={categoria.id} label={categoria.nome} value={categoria.id} />
                    ))}
                  </Picker>
                </View>
              </View>
              
              <View style={styles.switchGroup}>
                <Text style={styles.label}>Conta Recorrente?</Text>
                <Switch
                  value={novaConta.recorrente}
                  onValueChange={(value) => setNovaConta(prev => ({ ...prev, recorrente: value }))}
                  trackColor={{ false: '#767577', true: '#66ccff' }}
                  thumbColor={novaConta.recorrente ? '#003366' : '#f4f3f4'}
                />
              </View>

              {novaConta.recorrente && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Frequência</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={novaConta.frequencia}
                      onValueChange={(value) => setNovaConta(prev => ({ ...prev, frequencia: value }))}
                      style={styles.picker}
                    >
                      {FREQUENCIAS.filter(f => f.id !== 'unica').map(f => (
                        <Picker.Item key={f.id} label={f.nome} value={f.id} />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Método de Pagamento</Text>
                <CustomTextInput
                  iconName="credit-card"
                  placeholder="Ex: Cartão de Crédito, Débito Automático"
                  value={novaConta.metodoPagamento}
                  onChangeText={(value) => setNovaConta(prev => ({ ...prev, metodoPagamento: value }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Observações</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Informações adicionais..."
                  multiline
                  numberOfLines={3}
                  value={novaConta.observacoes}
                  onChangeText={(value) => setNovaConta(prev => ({ ...prev, observacoes: value }))}
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
                onPress={adicionarConta}
                style={{ flex: 1, marginHorizontal: 5 }}
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
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  kpiLabel: {
    color: '#aad4f5',
    fontSize: 14,
    marginBottom: 8,
  },
  kpiValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  kpiRow: {
    flexDirection: 'row',
  },
  kpiCardSmall: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  kpiLabelSmall: {
    color: '#666',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  kpiValueSmall: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  filtrosContainer: {
    marginBottom: 16,
  },
  filtroButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filtroAtivo: {
    backgroundColor: '#003366',
    borderColor: '#003366',
  },
  filtroText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  filtroTextAtivo: {
    color: '#fff',
  },
  contaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  contaPaga: {
    opacity: 0.7,
    backgroundColor: '#f8f8f8',
  },
  contaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  contaInfo: {
    flex: 1,
  },
  contaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contaIcon: {
    marginRight: 8,
  },
  contaNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  contaCategoria: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contaValor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 4,
  },
  contaVencimento: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  contaRecorrencia: {
    fontSize: 12,
    color: '#999',
  },
  contaObservacoes: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  textoPago: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  textoAtrasado: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  alertaAtrasado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#ffebee',
    borderRadius: 6,
  },
  textoAlerta: {
    color: '#F44336',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  contaActions: {
    alignItems: 'center',
  },
  checkButton: {
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '600',
    textAlign: 'center',
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
    maxHeight: '85%',
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
    maxHeight: 500,
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
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
