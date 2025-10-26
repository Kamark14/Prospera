import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  RefreshControl,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import { useAuth } from './components/AuthContext';
import Header from './components/Header';
import { SimpleChart } from './components/Chart';
import { formatCurrency } from './formatCurrency';

const screenWidth = Dimensions.get('window').width - 32;

// Categorias de Gastos (Cores e Nomes) - Importante para consistência
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

// CATEGORIAS PARA RECEITAS (Cores e Nomes) - Importante para consistência
const CATEGORIAS_RECEITAS = [
  { id: 'salario', nome: 'Salário', icone: 'cash', cor: '#4CAF50' },
  { id: 'freelance', nome: 'Freelance', icone: 'laptop', cor: '#2196F3' },
  { id: 'investimentos', nome: 'Investimentos', icone: 'trending-up', cor: '#FF9800' },
  { id: 'presente', nome: 'Presente', icone: 'gift', cor: '#E91E63' },
  { id: 'outros_receita', nome: 'Outros', icone: 'add-circle', cor: '#9C27B0' },
];

// Função auxiliar para obter nome e cor da categoria - CORRIGIDO
const getCategoriaInfo = (categoriaId, tipo) => {
  const categorias = tipo === 'gasto' ? CATEGORIAS_GASTOS : CATEGORIAS_RECEITAS;
  const categoria = categorias.find(c => c.id === categoriaId);
  return {
    nome: categoria ? categoria.nome : categoriaId,
    cor: categoria ? categoria.cor : '#999999' // Cor padrão se não encontrar
  };
};

const formatarNome = (nome) => {
  if (!nome) return 'Usuário';
  return nome.split(' ')[0];
};

export default function TelaDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const [usuario, setUsuario] = useState({ nome: '', email: '' });
  const [perfil, setPerfil] = useState({ nome: '', rendaMensalLiquida: 0 });
  const [gastos, setGastos] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [contas, setContas] = useState([]);
  const [metas, setMetas] = useState([]);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const carregarDados = async () => {
    try {
      const usuarioStr = await AsyncStorage.getItem('usuario');
      const perfilStr = await AsyncStorage.getItem('@perfil');
      const gastosStr = await AsyncStorage.getItem('@gastos');
      const receitasStr = await AsyncStorage.getItem('@receitas');
      const contasStr = await AsyncStorage.getItem('@contas');
      const metasStr = await AsyncStorage.getItem('@metas');

      if (usuarioStr) {
        const usuarioData = JSON.parse(usuarioStr);
        setUsuario(usuarioData);
      }

      if (perfilStr) {
        const perfilData = JSON.parse(perfilStr);
        setPerfil(perfilData);
        setFotoPerfil(perfilData.fotoPerfil || null);
      }
      // Garantindo que os dados sejam carregados como array, mesmo que vazios
      if (gastosStr) setGastos(JSON.parse(gastosStr));
      if (receitasStr) setReceitas(JSON.parse(receitasStr));
      if (contasStr) setContas(JSON.parse(contasStr));
      if (metasStr) setMetas(JSON.parse(metasStr));
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    }
  };

  useEffect(() => {
    carregarDados();
    const focusListener = navigation.addListener('focus', () => {
      carregarDados();
    });
    return focusListener;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  };

  // CÁLCULOS CORRIGIDOS - Usando parseFloat para garantir
  const totalReceitas = receitas.reduce((sum, r) => sum + (parseFloat(r.valor) || 0), 0) + (parseFloat(perfil.rendaMensalLiquida) || 0);
  const totalDespesas = gastos.reduce((sum, g) => sum + (parseFloat(g.valor) || 0), 0);
  const saldoMes = totalReceitas - totalDespesas;
  const contasPendentes = contas.filter(c => !c.paga);
  const contasProximas = contasPendentes.slice(0, 3);

  // Dados para o gráfico de despesas por categoria - CORRIGIDO
  const gastosAgrupados = gastos.reduce((acc, gasto) => {
    const { nome, cor } = getCategoriaInfo(gasto.categoria, 'gasto');
    const existing = acc.find(item => item.name === nome);

    if (existing) {
      existing.amount += (parseFloat(gasto.valor) || 0);
    } else {
      acc.push({
        name: nome,
        amount: (parseFloat(gasto.valor) || 0),
        color: cor
      });
    }
    return acc;
  }, []).filter(item => item.amount > 0); // Filtra categorias com valor zero

  // Dados para o gráfico de receitas por categoria - NOVO
  const receitasAgrupadas = receitas.reduce((acc, receita) => {
    const { nome, cor } = getCategoriaInfo(receita.categoria, 'receita');
    const existing = acc.find(item => item.name === nome);

    if (existing) {
      existing.amount += (parseFloat(receita.valor) || 0);
    } else {
      acc.push({
        name: nome,
        amount: (parseFloat(receita.valor) || 0),
        color: cor
      });
    }
    return acc;
  }, []).filter(item => item.amount > 0); // Filtra categorias com valor zero

  const calcularProgressoMeta = (meta) => {
    return meta.valorTotal > 0 ? Math.min((meta.valorEconomizado / meta.valorTotal) * 100, 100) : 0;
  };

  const handleLogout = async () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          },
          style: "destructive"
        }
      ]
    );
  };

  const LeftHeaderComponent = () => (
    <TouchableOpacity onPress={() => navigation.navigate('Usuario')}>
      {fotoPerfil ? (
        <Image source={{ uri: fotoPerfil }} style={styles.headerProfileImage} />
      ) : (
        <Ionicons name="person-circle" size={32} color="#003366" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Home"
        leftComponent={<LeftHeaderComponent />}
        rightIcon="logout"
        onRightPress={handleLogout}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.kpiContainer}>
          <Text style={styles.greeting}>
            Olá, {formatarNome(usuario.nome || perfil.nome)}!
          </Text>
          <Text style={styles.subGreeting}>
            {saldoMes >= 0 ? 'Você está no azul este mês!' : 'Atenção aos gastos este mês'}
          </Text>
        </View>

        {/* KPIs Financeiros - CORRIGIDOS */}
        <View style={styles.kpiContainer}>
          <View style={styles.kpiRow}>
            <View style={[styles.kpiCard, styles.kpiMain]}>
              <Text style={[styles.kpiLabel, { color: '#ffffff' }]}>Saldo do Mês</Text>
              <Text style={[styles.kpiValue, { color: saldoMes >= 0 ? '#ffffff' : '#F44336' }]}>
                {formatCurrency(saldoMes)}
              </Text>
            </View>
          </View>

          <View style={styles.kpiRow}>
            <View style={[styles.kpiCard, { backgroundColor: '#EFF4FF' }]}>
              <Ionicons name="trending-up" size={24} color="#1C398E" />
              <Text style={[styles.kpiLabel, { color: '#1C398E' }]}>Renda Total</Text>
              <Text style={[styles.kpiValue, { color: '#1C398E' }]}>
                {formatCurrency(totalReceitas)}
              </Text>
            </View>

            <View style={[styles.kpiCard, { backgroundColor: '#fef1f2' }]}>
              <Ionicons name="wallet" size={24} color="#F44336" />
              <Text style={[styles.kpiLabel, { color: '#9F0712' }]}>Despesas Totais</Text>
              <Text style={[styles.kpiValue, { color: '#82181A' }]}>
                {formatCurrency(totalDespesas)}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu de Navegação */}
        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Metas')}>
            <Ionicons name="flag" size={28} color="#fff" />
            <Text style={styles.menuText}>Metas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Gastos')}>
            <Ionicons name="card" size={28} color="#fff" />
            <Text style={styles.menuText}>Gastos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Patrimonio')}>
            <Ionicons name="trending-up" size={28} color="#fff" />
            <Text style={styles.menuText}>Patrimônio</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Relatorios')}>
            <Ionicons name="bar-chart" size={28} color="#fff" />
            <Text style={styles.menuText}>Relatórios</Text>
          </TouchableOpacity>
        </View>

        {/* Contas a Pagar */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Próximas Contas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Contas')}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {contasProximas.length > 0 ? (
            contasProximas.map((conta, index) => (
              <View key={index} style={styles.contaItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contaNome}>{conta.nome}</Text>
                  <Text style={styles.contaInfo}>
                    {formatCurrency(conta.valor)} • {conta.vencimento}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: '#e0351f' }]}>
                  <Text style={styles.statusText}>Pendente</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhuma conta pendente</Text>
          )}
        </View>

        {/* Metas */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Suas Metas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Metas')}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {metas.length > 0 ? (
            metas.slice(0, 3).map((meta, index) => {
              const progresso = calcularProgressoMeta(meta);
              return (
                <View key={index} style={styles.metaItem}>
                  <Text style={styles.metaNome}>{meta.titulo}</Text>
                  <Text style={styles.metaValor}>
                    {formatCurrency(meta.valorEconomizado)} / {formatCurrency(meta.valorTotal)}
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progress,
                        { width: `${progresso}%`, backgroundColor: '#4CAF50' }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{progresso.toFixed(1)}%</Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>Nenhuma meta cadastrada</Text>
          )}
        </View>

       
        {/* Gráfico de Receitas - MELHORADO */}
        <View style={styles.card}>
          <SimpleChart
            data={receitasAgrupadas}
            title="Receitas por Categoria"
            onAddData={() => navigation.navigate('Gastos', { screen: 'Gastos' })}
          />
        </View>

        {/* Gráfico de Despesas - MELHORADO */}
        <View style={styles.card}>
          <SimpleChart
            data={gastosAgrupados}
            title="Despesas por Categoria"
            onAddData={() => navigation.navigate('Gastos', { screen: 'Gastos' })}
          />
        </View>
      </ScrollView>
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
  headerProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#003366',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  kpiContainer: {
    marginBottom: 16,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  kpiCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  kpiMain: {
    backgroundColor: '#003366',
    flex: 3,
    flexDirection: 'column',
  },
  kpiLabel: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: '#fff', // Corrigido para branco
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
  },
  seeAllText: {
    fontSize: 14,
    color: '#66ccff',
    fontWeight: '600',
  },
  contaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contaNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contaInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 10,
  },
  metaItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  metaNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  metaValor: {
    fontSize: 14,
    color: '#003366',
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginTop: 5,
  },
  progress: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'right',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#003366',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  menuText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  emptyChart: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  emptyChartText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  emptyChartSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
  // Adicione no objeto de estilos do Dashboard:
  emptyStateCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#003366',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
