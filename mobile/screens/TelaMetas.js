// TelaMetas.js - VERSÃO COM FORMATAÇÃO DE DATA E VALOR
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  Modal,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from './formatCurrency';
import Header from './components/Header';
import CustomButton from './components/CustomButton';
import CustomTextInput from './components/CustomTextInput';

const CATEGORIAS_METAS = [
  { id: 'casa', nome: 'Casa/Imóvel', icone: 'home', cor: '#4CAF50' },
  { id: 'viagem', nome: 'Viagem', icone: 'airplane', cor: '#2196F3' },
  { id: 'casamento', nome: 'Casamento', icone: 'heart', cor: '#E91E63' },
  { id: 'educacao', nome: 'Educação', icone: 'school', cor: '#FF9800' },
  { id: 'emergencia', nome: 'Fundo de Emergência', icone: 'shield', cor: '#F44336' },
  { id: 'aposentadoria', nome: 'Aposentadoria', icone: 'time', cor: '#9C27B0' },
  { id: 'eletronicos', nome: 'Eletrônicos', icone: 'phone-portrait', cor: '#607D8B' },
  { id: 'veiculo', nome: 'Veículo', icone: 'car', cor: '#795548' },
  { id: 'outro', nome: 'Outro (Personalizada)', icone: 'add-circle', cor: '#666' },
];

export default function TelaMetas({ navigation }) {
  const [metas, setMetas] = useState([]);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [metaEmEdicao, setMetaEmEdicao] = useState(null);
  const [valorAdicionar, setValorAdicionar] = useState('');
  const [novaMeta, setNovaMeta] = useState({
    titulo: '',
    valorTotal: '',
    categoria: '',
    dataAlvo: '',
    detalhesCategoria: {},
  });

  useEffect(() => {
    carregarMetas();
  }, []);

  const carregarMetas = async () => {
    try {
      const stored = await AsyncStorage.getItem('@metas');
      if (stored) setMetas(JSON.parse(stored));
    } catch (e) {
      console.log('Erro ao carregar metas', e);
    }
  };

  const salvarMetas = async (novasMetas) => {
    try {
      await AsyncStorage.setItem('@metas', JSON.stringify(novasMetas));
      setMetas(novasMetas);
    } catch (e) {
      console.log('Erro ao salvar metas', e);
    }
  };

  // FUNÇÃO PARA FORMATAR VALOR MONETÁRIO
  const formatarValor = (text) => {
    // Remove tudo que não é número
    let cleanedText = text.replace(/\D/g, '');
    
    // Se estiver vazio, retorna vazio
    if (cleanedText === '') return '';
    
    // Converte para número e formata como moeda
    let number = parseInt(cleanedText, 10) / 100;
    
    // Formata como moeda brasileira
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // FUNÇÃO PARA FORMATAR DATA (DD/MM/AAAA)
  const formatarData = (text) => {
    let cleanedText = text.replace(/\D/g, '');
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

  // FUNÇÃO PARA CONVERTER VALOR FORMATADO PARA NÚMERO
  const converterValorParaNumero = (valorFormatado) => {
    if (!valorFormatado) return 0;
    
    // Remove pontos de milhar e troca vírgula por ponto
    let valorLimpo = valorFormatado
      .replace(/\./g, '') // Remove pontos
      .replace(',', '.'); // Troca vírgula por ponto
    
    return parseFloat(valorLimpo) || 0;
  };

  const selecionarCategoria = (categoria) => {
    setCategoriaSelecionada(categoria);
    setNovaMeta(prev => ({ ...prev, categoria: categoria.id }));
    setShowCategoriaModal(false);
    setShowDetalhesModal(true);
  };

  const adicionarMeta = () => {
    if (!novaMeta.titulo.trim() || !novaMeta.valorTotal.trim()) {
      Alert.alert('Erro', 'Preencha título e valor');
      return;
    }

    // Converte o valor formatado para número
    const valorTotalNumerico = converterValorParaNumero(novaMeta.valorTotal);

    if (valorTotalNumerico <= 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    const meta = {
      id: Date.now().toString(),
      titulo: novaMeta.titulo,
      valorTotal: valorTotalNumerico,
      categoria: novaMeta.categoria,
      dataAlvo: novaMeta.dataAlvo,
      detalhesCategoria: novaMeta.detalhesCategoria,
      valorEconomizado: 0,
      criadaEm: new Date().toLocaleDateString('pt-BR'),
    };

    const novasMetas = [meta, ...metas];
    salvarMetas(novasMetas);
    
    // Reset form
    setNovaMeta({
      titulo: '',
      valorTotal: '',
      categoria: '',
      dataAlvo: '',
      detalhesCategoria: {},
    });
    setCategoriaSelecionada(null);
    setShowDetalhesModal(false);
    
    Alert.alert('Sucesso', 'Meta adicionada com sucesso!');
  };

  const removerMeta = (id) => {
    Alert.alert('Remover', 'Deseja realmente excluir esta meta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          const novasMetas = metas.filter(m => m.id !== id);
          salvarMetas(novasMetas);
        },
      },
    ]);
  };

  const editarMeta = (meta) => {
    setMetaEmEdicao(meta);
    // Formata o valor para exibição
    const valorFormatado = meta.valorTotal.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    setNovaMeta({
      titulo: meta.titulo,
      valorTotal: valorFormatado,
      categoria: meta.categoria,
      dataAlvo: meta.dataAlvo,
      detalhesCategoria: meta.detalhesCategoria,
    });
    setCategoriaSelecionada(CATEGORIAS_METAS.find(c => c.id === meta.categoria));
    setShowDetalhesModal(true);
  };

  const salvarEdicaoMeta = () => {
    if (!novaMeta.titulo.trim() || !novaMeta.valorTotal.trim()) {
      Alert.alert('Erro', 'Preencha título e valor');
      return;
    }

    // Converte o valor formatado para número
    const valorTotalNumerico = converterValorParaNumero(novaMeta.valorTotal);

    if (valorTotalNumerico <= 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    const novasMetas = metas.map(m => 
      m.id === metaEmEdicao.id
        ? { 
            ...m, 
            titulo: novaMeta.titulo,
            valorTotal: valorTotalNumerico,
            categoria: novaMeta.categoria,
            dataAlvo: novaMeta.dataAlvo,
            detalhesCategoria: novaMeta.detalhesCategoria,
          }
        : m
    );
    salvarMetas(novasMetas);
    setMetaEmEdicao(null);
    setNovaMeta({
      titulo: '',
      valorTotal: '',
      categoria: '',
      dataAlvo: '',
      detalhesCategoria: {},
    });
    setCategoriaSelecionada(null);
    setShowDetalhesModal(false);
    Alert.alert('Sucesso', 'Meta atualizada com sucesso!');
  };

  const abrirModalAdicionarDinheiro = (meta) => {
    setMetaEmEdicao(meta);
    setValorAdicionar('');
    setShowAddMoneyModal(true);
  };

  const adicionarDinheiroMeta = () => {
    // Converte o valor formatado para número
    const valorNumerico = converterValorParaNumero(valorAdicionar);

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Erro', 'Insira um valor válido para adicionar.');
      return;
    }

    const novasMetas = metas.map(m => 
      m.id === metaEmEdicao.id
        ? { ...m, valorEconomizado: m.valorEconomizado + valorNumerico }
        : m
    );
    salvarMetas(novasMetas);
    setShowAddMoneyModal(false);
    setMetaEmEdicao(null);
    setValorAdicionar('');
    Alert.alert('Sucesso', 'Dinheiro adicionado à meta!');
  };

  const calcularProgresso = (meta) => {
    return Math.min((meta.valorEconomizado / meta.valorTotal) * 100, 100);
  };

  const renderDetalhesCategoria = () => {
    if (!categoriaSelecionada) return null;

    // Função auxiliar para criar CustomTextInput para detalhes
    const DetailInput = ({ detailKey, iconName, placeholder, keyboardType = 'default', mask = null }) => (
      <CustomTextInput
        iconName={iconName}
        placeholder={placeholder}
        value={novaMeta.detalhesCategoria[detailKey] || ''}
        onChangeText={(value) => {
          let valorFormatado = value;
          
          // Aplica máscara se especificada
          if (mask === 'valor') {
            valorFormatado = formatarValor(value);
          } else if (mask === 'data') {
            valorFormatado = formatarData(value);
          }
          
          setNovaMeta(prev => ({
            ...prev,
            detalhesCategoria: { ...prev.detalhesCategoria, [detailKey]: valorFormatado }
          }))
        }}
        keyboardType={keyboardType}
        mask={mask}
      />
    );

    switch (categoriaSelecionada.id) {
      case 'casa':
        return (
          <View>
            <Text style={styles.modalSubtitle}>Detalhes do Imóvel</Text>
            <DetailInput 
              detailKey="tipoImovel" 
              iconName="home" 
              placeholder="Tipo de imóvel (Casa, Apartamento, etc.)" 
            />
            <DetailInput 
              detailKey="percentualEntrada" 
              iconName="percent" 
              placeholder="Percentual de entrada (%)" 
              keyboardType="numeric"
            />
            <DetailInput 
              detailKey="valorImovel" 
              iconName="attach-money" 
              placeholder="Valor estimado do imóvel (R$)" 
              keyboardType="numeric"
              mask="valor"
            />
            <DetailInput 
              detailKey="localizacao" 
              iconName="location-on" 
              placeholder="Localização desejada" 
            />
          </View>
        );
      case 'viagem':
        return (
          <View>
            <Text style={styles.modalSubtitle}>Detalhes da Viagem</Text>
            <DetailInput 
              detailKey="destino" 
              iconName="flight" 
              placeholder="Destino" 
            />
            <DetailInput 
              detailKey="numeroViajantes" 
              iconName="people" 
              placeholder="Número de viajantes" 
              keyboardType="numeric"
            />
            <DetailInput 
              detailKey="tipoViagem" 
              iconName="card-travel" 
              placeholder="Tipo (Econômica, Luxo, etc.)" 
            />
            <DetailInput 
              detailKey="dataPartida" 
              iconName="event" 
              placeholder="Data de partida (DD/MM/AAAA)" 
              mask="data"
            />
          </View>
        );
      case 'veiculo':
        return (
          <View>
            <Text style={styles.modalSubtitle}>Detalhes do Veículo</Text>
            <DetailInput 
              detailKey="modelo" 
              iconName="directions-car" 
              placeholder="Modelo do veículo" 
            />
            <DetailInput 
              detailKey="ano" 
              iconName="calendar-today" 
              placeholder="Ano do veículo" 
              keyboardType="numeric"
            />
            <DetailInput 
              detailKey="valorVeiculo" 
              iconName="attach-money" 
              placeholder="Valor estimado (R$)" 
              keyboardType="numeric"
              mask="valor"
            />
          </View>
        );
      default:
        return (
          <View>
            <Text style={styles.modalSubtitle}>Detalhes Adicionais</Text>
            <DetailInput 
              detailKey="descricao" 
              iconName="description" 
              placeholder="Descrição adicional (opcional)" 
            />
          </View>
        );
    }
  };

  const renderMeta = ({ item }) => {
    const progresso = calcularProgresso(item);
    const categoria = CATEGORIAS_METAS.find(c => c.id === item.categoria);
    
    return (
      <TouchableOpacity onPress={() => editarMeta(item)} style={styles.metaCard}>
        <View style={styles.metaHeader}>
          <View style={styles.metaInfo}>
            <View style={styles.metaTitleRow}>
              {categoria && (
                <Ionicons 
                  name={categoria.icone} 
                  size={20} 
                  color={categoria.cor} 
                  style={styles.metaIcon} 
                />
              )}
              <Text style={styles.metaTitulo}>{item.titulo}</Text>
            </View>
            <Text style={styles.metaCategoria}>
              {categoria ? categoria.nome : 'Categoria não encontrada'}
            </Text>
            <Text style={styles.metaValor}>
              {formatCurrency(item.valorEconomizado)} / {formatCurrency(item.valorTotal)}
            </Text>
          </View>
          <View style={styles.metaActions}>
            <TouchableOpacity 
              onPress={() => abrirModalAdicionarDinheiro(item)} 
              style={styles.actionButtonSmall}
            >
              <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removerMeta(item.id)} style={styles.actionButtonSmall}>
              <Ionicons name="trash-outline" size={24} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${progresso}%`, backgroundColor: categoria ? categoria.cor : '#003366' }]} />
          </View>
          <Text style={styles.progressText}>{progresso.toFixed(1)}%</Text>
        </View>

        {item.dataAlvo && (
          <Text style={styles.metaData}>
            🗓️ Data Alvo: {item.dataAlvo}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header 
        title="Minhas Metas" 
        leftIcon="arrow-back" 
        onLeftPress={() => navigation.goBack()}
        rightIcon="add-circle-outline"
        onRightPress={() => setShowCategoriaModal(true)}
      />

      {metas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="flag-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Nenhuma meta cadastrada</Text>
          <Text style={styles.emptySubtext}>
            Comece a planejar seu futuro financeiro.
          </Text>
          <CustomButton
            title="ADICIONAR NOVA META"
            onPress={() => setShowCategoriaModal(true)}
            style={{ marginTop: 20 }}
          />
        </View>
      ) : (
        <FlatList
          data={metas}
          renderItem={renderMeta}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.container}
        />
      )}

      {/* Modal de Seleção de Categoria */}
      <Modal visible={showCategoriaModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Selecione a Categoria</Text>
            <FlatList
              data={CATEGORIAS_METAS}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.categoriaItem} 
                  onPress={() => selecionarCategoria(item)}
                >
                  <Ionicons name={item.icone} size={24} color={item.cor} />
                  <Text style={styles.categoriaNome}>{item.nome}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>
              )}
              style={styles.categoriasList}
            />
            <CustomButton
              title="CANCELAR"
              onPress={() => setShowCategoriaModal(false)}
              type="secondary"
              style={{ marginTop: 20 }}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de Detalhes da Meta */}
      <Modal visible={showDetalhesModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {metaEmEdicao ? 'Editar Meta' : 'Nova Meta'} - {categoriaSelecionada?.nome || 'Detalhes'}
            </Text>
            
            <ScrollView style={styles.formContainer}>
              <CustomTextInput
                iconName="text-fields"
                placeholder="Título da Meta *"
                value={novaMeta.titulo}
                onChangeText={(value) => setNovaMeta(prev => ({ ...prev, titulo: value }))}
              />
              
              <CustomTextInput
                iconName="attach-money"
                placeholder="Valor Total (R$) *"
                keyboardType="numeric"
                value={novaMeta.valorTotal}
                onChangeText={(value) => {
                  const valorFormatado = formatarValor(value);
                  setNovaMeta(prev => ({ ...prev, valorTotal: valorFormatado }));
                }}
              />
              
              <CustomTextInput
                iconName="event"
                placeholder="Data Alvo (DD/MM/AAAA)"
                value={novaMeta.dataAlvo}
                onChangeText={(value) => {
                  const dataFormatada = formatarData(value);
                  setNovaMeta(prev => ({ ...prev, dataAlvo: dataFormatada }));
                }}
                maxLength={10}
              />
              
              {renderDetalhesCategoria()}
            </ScrollView>

            <View style={styles.modalButtons}>
              <CustomButton
                title="CANCELAR"
                onPress={() => {
                  setShowDetalhesModal(false);
                  setMetaEmEdicao(null);
                  setCategoriaSelecionada(null);
                  setNovaMeta({ titulo: '', valorTotal: '', categoria: '', dataAlvo: '', detalhesCategoria: {} });
                }}
                type="secondary"
                style={{ flex: 1, marginHorizontal: 5 }}
              />
              <CustomButton
                title={metaEmEdicao ? 'SALVAR EDIÇÃO' : 'ADICIONAR META'}
                onPress={metaEmEdicao ? salvarEdicaoMeta : adicionarMeta}
                style={{ flex: 1, marginHorizontal: 5 }}
                textColor="#ffffff"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Adicionar Dinheiro */}
      <Modal visible={showAddMoneyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Adicionar Dinheiro à Meta</Text>
            <Text style={styles.modalSubtitle}>
              Meta: {metaEmEdicao?.titulo}
            </Text>
            
            <CustomTextInput
              iconName="attach-money"
              placeholder="Valor a adicionar (R$) *"
              keyboardType="numeric"
              value={valorAdicionar}
              onChangeText={(value) => {
                const valorFormatado = formatarValor(value);
                setValorAdicionar(valorFormatado);
              }}
            />

            <View style={styles.infoAdicionar}>
              <Text style={styles.infoText}>
                Valor atual: {formatCurrency(metaEmEdicao?.valorEconomizado || 0)}
              </Text>
              <Text style={styles.infoText}>
                Valor total: {formatCurrency(metaEmEdicao?.valorTotal || 0)}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <CustomButton
                title="CANCELAR"
                onPress={() => {
                  setShowAddMoneyModal(false);
                  setValorAdicionar('');
                }}
                type="secondary"
                style={{ flex: 1, marginHorizontal: 5 }}
              />
              <CustomButton
                title="ADICIONAR"
                onPress={adicionarDinheiroMeta}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  metaCard: {
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
  metaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metaInfo: {
    flex: 1,
  },
  metaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaIcon: {
    marginRight: 8,
  },
  metaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  metaCategoria: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metaValor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 4,
  },
  metaData: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  metaActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonSmall: {
    marginLeft: 10,
    padding: 5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginRight: 12,
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
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
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    marginTop: 8,
  },
  categoriasList: {
    maxHeight: 400,
  },
  categoriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoriaNome: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  formContainer: {
    maxHeight: 400,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  infoAdicionar: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});