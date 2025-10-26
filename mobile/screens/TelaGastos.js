import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Modal,
  ScrollView,
  RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from './components/Header';
import CustomButton from './components/CustomButton';
import { formatCurrency } from './formatCurrency';
import { PieChart } from './components/Chart';

const screenWidth = Dimensions.get('window').width - 32;

const CATEGORIAS_GASTOS = [
  { id: 'alimentacao', nome: 'Alimentação', icone: 'restaurant', cor: '#FF6B6B' },
  { id: 'transporte', nome: 'Transporte', icone: 'car', cor: '#4ECDC4' },
  { id: 'moradia', nome: 'Moradia', icone: 'home', cor: '#45B7D1' },
  { id: 'saude', nome: 'Saúde', icone: 'medical', cor: '#FFA07A' },
  { id: 'educacao', nome: 'Educação', icone: 'school', cor: '#98D8C8' },
  { id: 'lazer', nome: 'Lazer', icone: 'game-controller', cor: '#F44336' },
  { id: 'vestuario', nome: 'Vestuário', icone: 'shirt', cor: '#BB8FCE' },
  { id: 'assinaturas', nome: 'Assinaturas', icone: 'card', cor: '#85C1E9' },
  { id: 'outros', nome: 'Outros', icone: 'ellipsis-horizontal', cor: '#F8C471' },
];

const CATEGORIAS_RECEITAS = [
  { id: 'salario', nome: 'Salário', icone: 'cash', cor: '#4CAF50' },
  { id: 'freelance', nome: 'Freelance', icone: 'laptop', cor: '#2196F3' },
  { id: 'investimentos', nome: 'Investimentos', icone: 'trending-up', cor: '#FF9800' },
  { id: 'presente', nome: 'Presente', icone: 'gift', cor: '#E91E63' },
  { id: 'outros_receita', nome: 'Outros', icone: 'add-circle', cor: '#9C27B0' },
];

export default function TelaGastos({ navigation }) {
  const [gastos, setGastos] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tipoTransacao, setTipoTransacao] = useState('gasto');
  const [refreshing, setRefreshing] = useState(false);
  const [novaTransacao, setNovaTransacao] = useState({
    categoria: '',
    descricao: '',
    valor: '',
    data: new Date().toLocaleDateString('pt-BR'),
    observacoes: '',
  });

  const carregarDados = async () => {
    try {
      const gastosStr = await AsyncStorage.getItem('@gastos');
      const receitasStr = await AsyncStorage.getItem('@receitas');
      if (gastosStr) setGastos(JSON.parse(gastosStr));
      if (receitasStr) setReceitas(JSON.parse(receitasStr));
    } catch (e) {
      console.log('Erro ao carregar dados', e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarDados();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  };

  const salvarDados = async (key, data, setter) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      setter(data);
    } catch (e) {
      console.log(`Erro ao salvar ${key}`, e);
    }
  };

  const adicionarTransacao = () => {
    if (!novaTransacao.categoria || !novaTransacao.descricao.trim() || !novaTransacao.valor.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios (*)');
      return;
    }

    let valorNumerico;
    try {
      let valorLimpo = novaTransacao.valor.replace(/[^\d,.]/g, '');
      if (valorLimpo.includes('.') && valorLimpo.includes(',')) {
        valorLimpo = valorLimpo.replace(/\./g, '');
      }
      valorLimpo = valorLimpo.replace(',', '.');
      valorNumerico = parseFloat(valorLimpo);
      if (isNaN(valorNumerico) || valorNumerico <= 0) throw new Error('Valor inválido');
    } catch (error) {
      Alert.alert('Erro', 'Digite um valor válido (ex: 150,00)');
      return;
    }

    const transacao = {
      id: Date.now().toString(),
      ...novaTransacao,
      valor: valorNumerico,
      data: novaTransacao.data || new Date().toLocaleDateString('pt-BR'),
      criadaEm: new Date().toISOString(),
    };

    if (tipoTransacao === 'gasto') {
      salvarDados('@gastos', [transacao, ...gastos], setGastos);
    } else {
      salvarDados('@receitas', [transacao, ...receitas], setReceitas);
    }

    setNovaTransacao({ categoria: '', descricao: '', valor: '', data: new Date().toLocaleDateString('pt-BR'), observacoes: '' });
    setShowModal(false);
    Alert.alert('Sucesso', `${tipoTransacao === 'gasto' ? 'Gasto' : 'Receita'} adicionado!`);
  };

  const removerTransacao = (id, tipo) => {
    Alert.alert('Remover', `Excluir este ${tipo}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          if (tipo === 'gasto') {
            salvarDados('@gastos', gastos.filter(g => g.id !== id), setGastos);
          } else {
            salvarDados('@receitas', receitas.filter(r => r.id !== id), setReceitas);
          }
        }
      }
    ]);
  };

  const totalGastos = gastos.reduce((sum, g) => sum + (parseFloat(g.valor) || 0), 0);
  const totalReceitas = receitas.reduce((sum, r) => sum + (parseFloat(r.valor) || 0), 0);
  const saldo = totalReceitas - totalGastos;

  const agruparPorCategoria = (transacoes, categorias) => {
    return categorias.map(cat => ({
      name: cat.nome,
      amount: transacoes
        .filter(t => t.categoria === cat.id)
        .reduce((sum, t) => sum + (parseFloat(t.valor) || 0), 0),
      color: cat.cor,
    })).filter(item => item.amount > 0);
  };

  const gastosAgrupados = agruparPorCategoria(gastos, CATEGORIAS_GASTOS);
  const receitasAgrupadas = agruparPorCategoria(receitas, CATEGORIAS_RECEITAS);

  const abrirModal = (tipo) => {
    setTipoTransacao(tipo);
    setNovaTransacao({ categoria: '', descricao: '', valor: '', data: new Date().toLocaleDateString('pt-BR'), observacoes: '' });
    setShowModal(true);
  };

  const renderTransacao = ({ item, tipo }) => {
    const categoria = (tipo === 'gasto' ? CATEGORIAS_GASTOS : CATEGORIAS_RECEITAS).find(c => c.id === item.categoria);
    return (
      <View style={styles.transacaoCard}>
        <View style={styles.transacaoHeader}>
          <View style={styles.transacaoInfo}>
            <View style={styles.transacaoTitleRow}>
              {categoria && <Ionicons name={categoria.icone} size={20} color={categoria.cor} style={styles.transacaoIcon} />}
              <Text style={styles.transacaoDescricao}>{item.descricao}</Text>
            </View>
            <Text style={styles.transacaoCategoria}>{categoria ? categoria.nome : 'Sem categoria'}</Text>
          </View>
          <View style={styles.transacaoActions}>
            <Text style={[styles.transacaoValor, { color: tipo === 'receita' ? '#4CAF50' : '#F44336' }]}>
              {tipo === 'receita' ? '+' : '-'} {formatCurrency(item.valor)}
            </Text>
            <TouchableOpacity onPress={() => removerTransacao(item.id, tipo)} style={{ marginLeft: 10 }}>
              <Ionicons name="trash" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.transacaoData}>{item.data}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Gastos e Receitas"
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.resumoContainer}>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoLabel}>Saldo do Mês</Text>
            <Text style={[styles.resumoValue, { color: saldo >= 0 ? '#4CAF50' : '#F44336' }]}>{formatCurrency(saldo)}</Text>
          </View>
          <View style={styles.resumoRow}>
            <View style={styles.resumoCardSmall}>
              <Ionicons name="trending-up" size={20} color="#4CAF50" />
              <Text style={[styles.resumoLabelSmall, { color: '#000000ff', fontWeight: 'bold' }]}>Receitas</Text>
              <Text style={[styles.resumoValueSmall, { color: '#044106ff', fontWeight: 'bold' }]}>{formatCurrency(totalReceitas)}</Text>
            </View>
            <View style={styles.resumoCardSmall2}>
              <Ionicons name="trending-down" size={20} color="#F44336" />
              <Text style={[styles.resumoLabelSmall, { color: '#000000ff', fontWeight: 'bold' }]}>Gastos</Text>
              <Text style={[styles.resumoValueSmall, { color: '#300805ff', fontWeight: 'bold' }]}>{formatCurrency(totalGastos)}</Text>
            </View>
          </View>
        </View>


        <PieChart
          data={receitasAgrupadas}
          total={totalReceitas}
          title="Receitas por Categoria"
          onAddData={() => abrirModal('receita')}
        />

        <PieChart
          data={gastosAgrupados}
          total={totalGastos}
          title="Gastos por Categoria"
          onAddData={() => abrirModal('gasto')}
        />

        <View style={styles.actionButtons}>
          <CustomButton
            title="ADICIONAR RECEITA"
            onPress={() => abrirModal('receita')}
            type="primary"
            style={{
              flex: 1,
              marginHorizontal: 4,
              backgroundColor: '#4CAF50',
            }}
            textStyle={{ color: '#ffffff', fontWeight: 'bold' }} // Adicionado texto branco
          />
          <CustomButton
            title="ADICIONAR DESPESA"
            onPress={() => abrirModal('gasto')}
            type="danger"
            style={{
              flex: 1,
              marginHorizontal: 4,
            }}
            textStyle={{ color: '#ffffff', fontWeight: 'bold' }} // Adicionado texto branco
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transações Recentes</Text>
          {[...receitas, ...gastos].sort((a, b) => new Date(b.criadaEm) - new Date(a.criadaEm)).slice(0, 10).map(item => (
            <View key={item.id}>
              {renderTransacao({ item, tipo: receitas.some(r => r.id === item.id) ? 'receita' : 'gasto' })}
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Adicionar {tipoTransacao === 'gasto' ? 'Gasto' : 'Receita'}</Text>
            <ScrollView>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Categoria *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={novaTransacao.categoria}
                    onValueChange={(value) => setNovaTransacao(prev => ({ ...prev, categoria: value }))}
                  >
                    <Picker.Item label="Selecione a categoria" value="" />
                    {(tipoTransacao === 'gasto' ? CATEGORIAS_GASTOS : CATEGORIAS_RECEITAS).map(cat => (
                      <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descrição *</Text>
                <TextInput style={styles.input} placeholder="Ex: Almoço" value={novaTransacao.descricao} onChangeText={(t) => setNovaTransacao(p => ({ ...p, descricao: t }))} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Valor (R$) *</Text>
                <TextInput style={styles.input} placeholder="150,00" keyboardType="decimal-pad" value={novaTransacao.valor} onChangeText={(t) => setNovaTransacao(p => ({ ...p, valor: t }))} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Data</Text>
                <TextInput style={styles.input} placeholder="DD/MM/AAAA" value={novaTransacao.data} onChangeText={(t) => setNovaTransacao(p => ({ ...p, data: t }))} maxLength={10} />
              </View>
            </ScrollView>
            <View style={styles.modalButtons}>
              <CustomButton title="CANCELAR" onPress={() => setShowModal(false)} type="secondary" style={{ flex: 1, marginHorizontal: 4 }} />
              <CustomButton title="ADICIONAR" onPress={adicionarTransacao} type="primary" style={{ flex: 1, marginHorizontal: 4 }} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { padding: 16, paddingBottom: 30 },
  resumoContainer: { marginBottom: 20 },
  resumoCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22 },
  resumoLabel: { fontSize: 14, color: '#666', marginBottom: 5 },
  resumoValue: { fontSize: 24, fontWeight: 'bold' },
  resumoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  resumoCardSmall: { flex: 1, backgroundColor: '#b3e4b5ff', padding: 10, borderRadius: 12, marginHorizontal: 4, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22 },
  resumoCardSmall2: { flex: 1, backgroundColor: '#cf6363ff', padding: 10, borderRadius: 12, marginHorizontal: 4, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22 },
  resumoLabelSmall: { fontSize: 12, color: '#666', marginTop: 5 },
  resumoValueSmall: { fontSize: 16, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  transacaoCard: { backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 10, elevation: 1 },
  transacaoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  transacaoInfo: { flex: 1 },
  transacaoTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  transacaoIcon: { marginRight: 8 },
  transacaoDescricao: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  transacaoCategoria: { fontSize: 12, color: '#999', marginLeft: 28 },
  transacaoActions: { flexDirection: 'row', alignItems: 'center' },
  transacaoValor: { fontSize: 16, fontWeight: 'bold' },
  transacaoData: { fontSize: 12, color: '#aaa', marginTop: 5, textAlign: 'right' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: '#f9f9f9' },
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#f9f9f9', overflow: 'hidden' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});
