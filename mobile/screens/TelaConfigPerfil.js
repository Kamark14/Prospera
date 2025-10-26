// TelaConfigPerfil.js - VERSÃO SIMPLIFICADA E FUNCIONAL
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import Header from './components/Header';
import CustomButton from './components/CustomButton';
import { useAuth } from './components/AuthContext';

// Schema de validação
const PerfilSchema = Yup.object().shape({
  nome: Yup.string().required('O nome é obrigatório'),
  email: Yup.string().email('E-mail inválido').required('O e-mail é obrigatório'),
  rendaMensalLiquida: Yup.number().typeError('Renda deve ser um número').min(0, 'Renda inválida'),
  rendaExtraMedia: Yup.number().typeError('Renda deve ser um número').min(0, 'Renda inválida'),
  dependentes: Yup.number().typeError('Dependentes deve ser um número inteiro').integer('Deve ser um número inteiro').min(0, 'Número inválido'),
});

// Função para aplicar máscara de data
const aplicarMascaraData = (text) => {
  let cleaned = text.replace(/\D/g, '');
  
  if (cleaned.length <= 2) {
    return cleaned;
  } else if (cleaned.length <= 4) {
    return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
  } else {
    return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4) + '/' + cleaned.substring(4, 8);
  }
};

// Função para validar data
const validarData = (data) => {
  if (!data || data.length !== 10) return false;
  
  const partes = data.split('/');
  if (partes.length !== 3) return false;
  
  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10);
  const ano = parseInt(partes[2], 10);
  
  if (dia < 1 || dia > 31) return false;
  if (mes < 1 || mes > 12) return false;
  if (ano < 1900 || ano > new Date().getFullYear()) return false;
  
  return true;
};

// Função para máscara de telefone
const aplicarMascaraTelefone = (text) => {
  let cleaned = text.replace(/\D/g, '');
  
  if (cleaned.length <= 2) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return '(' + cleaned.substring(0, 2) + ') ' + cleaned.substring(2, 6);
  } else if (cleaned.length <= 10) {
    return '(' + cleaned.substring(0, 2) + ') ' + cleaned.substring(2, 6) + '-' + cleaned.substring(6, 10);
  } else {
    return '(' + cleaned.substring(0, 2) + ') ' + cleaned.substring(2, 7) + '-' + cleaned.substring(7, 11);
  }
};

// Componente de Input Personalizado
const CustomInput = ({ 
  iconName, 
  placeholder, 
  value, 
  onChangeText, 
  onBlur, 
  keyboardType = 'default', 
  maxLength,
  error,
  secureTextEntry = false 
}) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <Ionicons name={iconName} size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={[
            styles.input,
            error && styles.inputError
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          keyboardType={keyboardType}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="#999"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default function TelaConfigPerfil({ navigation }) {
  const formikRef = useRef(null);
  const { user } = useAuth();
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [initialValues, setInitialValues] = useState({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    rendaMensalLiquida: '',
    rendaExtraMedia: '',
    nivelRisco: 'Moderado',
    objetivoPrincipal: '',
    profissao: '',
    estadoCivil: 'Solteiro',
    dependentes: '',
    cidadeEstado: '',
    moedaPrincipal: 'R$',
    notificacoesAtivas: true,
    compartilharDados: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const usuarioStr = await AsyncStorage.getItem('usuario');
        const perfilStr = await AsyncStorage.getItem('@perfil');
        let perfilData = {};

        if (perfilStr) {
          perfilData = JSON.parse(perfilStr);
          setFotoPerfil(perfilData.fotoPerfil || null);
        } else if (usuarioStr) {
          perfilData = JSON.parse(usuarioStr);
        }

        setInitialValues(prev => ({
          ...prev,
          ...perfilData,
          rendaMensalLiquida: perfilData.rendaMensalLiquida?.toString() || '',
          rendaExtraMedia: perfilData.rendaExtraMedia?.toString() || '',
          dependentes: perfilData.dependentes?.toString() || '',
          email: perfilData.email || (user ? user.email : ''),
          nome: perfilData.nome || (user ? user.nome : ''),
        }));

        if (perfilData.fotoPerfil) {
          setFotoPerfil(perfilData.fotoPerfil);
        }

      } catch (e) {
        console.error("Erro ao carregar perfil:", e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  // Função para selecionar a imagem da galeria
  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para selecionar uma foto.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFotoPerfil(result.assets[0].uri);
        Alert.alert('Sucesso', 'Foto de perfil selecionada! salve as alterações.');
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  // Função personalizada para lidar com a mudança da data
  const handleDataChange = (handleChange) => (text) => {
    const dataComMascara = aplicarMascaraData(text);
    handleChange('dataNascimento')(dataComMascara);
  };

  // Função personalizada para lidar com a mudança do telefone
  const handleTelefoneChange = (handleChange) => (text) => {
    const telefoneComMascara = aplicarMascaraTelefone(text);
    handleChange('telefone')(telefoneComMascara);
  };

  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      // Validar data antes de salvar
      if (values.dataNascimento && !validarData(values.dataNascimento)) {
        Alert.alert('Data Inválida', 'Por favor, insira uma data válida no formato DD/MM/AAAA.');
        setSubmitting(false);
        return;
      }

      const perfilParaSalvar = {
        ...values,
        rendaMensalLiquida: parseFloat(values.rendaMensalLiquida) || 0,
        rendaExtraMedia: parseFloat(values.rendaExtraMedia) || 0,
        dependentes: parseInt(values.dependentes) || 0,
        fotoPerfil: fotoPerfil,
      };

      await AsyncStorage.setItem('@perfil', JSON.stringify(perfilParaSalvar));
      
      // Atualizar também no usuário principal
      const usuarioStr = await AsyncStorage.getItem('usuario');
      if (usuarioStr) {
        const usuario = JSON.parse(usuarioStr);
        usuario.nome = values.nome;
        usuario.email = values.email;
        await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
      }

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Falha ao atualizar o perfil.');
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#003366" />
        <Text style={{ marginTop: 10, color: '#003366' }}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        style={styles.fullContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Header 
          title="Configurar Perfil" 
          leftIcon="arrow-back" 
          onLeftPress={() => navigation.goBack()}
          rightIcon="save"
          onRightPress={() => {
            if (formikRef.current) {
              formikRef.current.handleSubmit();
            }
          }}
        />
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={PerfilSchema}
            onSubmit={handleUpdate}
            enableReinitialize={true}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
              <View style={styles.formContainer}>
                
                {/* Área da Imagem de Perfil */}
                <TouchableOpacity style={styles.profileImageContainer} onPress={handleImagePick}>
                  {fotoPerfil ? (
                    <Image source={{ uri: fotoPerfil }} style={styles.profileImage} />
                  ) : (
                    <View style={styles.profileImagePlaceholder}>
                      <Ionicons name="person" size={40} color="#003366" />
                    </View>
                  )}
                  <View style={styles.cameraIconContainer}>
                    <Ionicons name="camera" size={20} color="white" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.changeImageText}>Toque para alterar a foto</Text>

                {/* Informações Pessoais Básicas */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Informações Pessoais</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome Completo</Text>
                    <CustomInput
                      iconName="person-outline"
                      placeholder="Seu nome completo"
                      value={values.nome}
                      onChangeText={handleChange('nome')}
                      onBlur={handleBlur('nome')}
                      error={touched.nome && errors.nome}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <CustomInput
                      iconName="mail-outline"
                      placeholder="seu@email.com"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      error={touched.email && errors.email}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Telefone</Text>
                    <CustomInput
                      iconName="call-outline"
                      placeholder="(11) 99999-9999"
                      value={values.telefone}
                      onChangeText={handleTelefoneChange(handleChange)}
                      onBlur={handleBlur('telefone')}
                      keyboardType="phone-pad"
                      maxLength={15}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Data de Nascimento</Text>
                    <CustomInput
                      iconName="calendar-outline"
                      placeholder="DD/MM/AAAA"
                      value={values.dataNascimento}
                      onChangeText={handleDataChange(handleChange)}
                      onBlur={handleBlur('dataNascimento')}
                      keyboardType="numeric"
                      maxLength={10}
                    />
                    {values.dataNascimento && !validarData(values.dataNascimento) && (
                      <Text style={styles.errorText}>Formato inválido. Use DD/MM/AAAA</Text>
                    )}
                  </View>
                </View>

                {/* Informações Financeiras */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Informações Financeiras</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Renda Mensal Líquida (R$)</Text>
                    <CustomInput
                      iconName="cash-outline"
                      placeholder="0.00"
                      value={values.rendaMensalLiquida}
                      onChangeText={handleChange('rendaMensalLiquida')}
                      onBlur={handleBlur('rendaMensalLiquida')}
                      keyboardType="numeric"
                      error={touched.rendaMensalLiquida && errors.rendaMensalLiquida}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Renda Extra Média (R$)</Text>
                    <CustomInput
                      iconName="add-circle-outline"
                      placeholder="0.00"
                      value={values.rendaExtraMedia}
                      onChangeText={handleChange('rendaExtraMedia')}
                      onBlur={handleBlur('rendaExtraMedia')}
                      keyboardType="numeric"
                      error={touched.rendaExtraMedia && errors.rendaExtraMedia}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nível de Conforto com Risco</Text>
                    <View style={styles.pickerContainer}>
                      <Ionicons name="trending-up-outline" size={20} color="#666" style={styles.pickerIcon} />
                      <Picker
                        selectedValue={values.nivelRisco}
                        onValueChange={(value) => setFieldValue('nivelRisco', value)}
                        style={styles.picker}
                      >
                        <Picker.Item label="Conservador" value="Conservador" />
                        <Picker.Item label="Moderado" value="Moderado" />
                        <Picker.Item label="Arrojado" value="Arrojado" />
                      </Picker>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Objetivo Financeiro Principal</Text>
                    <CustomInput
                      iconName="flag-outline"
                      placeholder="Ex: Comprar um imóvel, Independência financeira..."
                      value={values.objetivoPrincipal}
                      onChangeText={handleChange('objetivoPrincipal')}
                      onBlur={handleBlur('objetivoPrincipal')}
                    />
                  </View>
                </View>

                {/* Informações de Vida & Contexto */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Informações de Vida</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Profissão/Ocupação</Text>
                    <CustomInput
                      iconName="briefcase-outline"
                      placeholder="Sua profissão"
                      value={values.profissao}
                      onChangeText={handleChange('profissao')}
                      onBlur={handleBlur('profissao')}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Estado Civil</Text>
                    <View style={styles.pickerContainer}>
                      <Ionicons name="heart-outline" size={20} color="#666" style={styles.pickerIcon} />
                      <Picker
                        selectedValue={values.estadoCivil}
                        onValueChange={(value) => setFieldValue('estadoCivil', value)}
                        style={styles.picker}
                      >
                        <Picker.Item label="Solteiro" value="Solteiro" />
                        <Picker.Item label="Casado" value="Casado" />
                        <Picker.Item label="União Estável" value="União Estável" />
                        <Picker.Item label="Divorciado" value="Divorciado" />
                        <Picker.Item label="Viúvo" value="Viúvo" />
                      </Picker>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Número de Dependentes</Text>
                    <CustomInput
                      iconName="people-outline"
                      placeholder="0"
                      value={values.dependentes}
                      onChangeText={handleChange('dependentes')}
                      onBlur={handleBlur('dependentes')}
                      keyboardType="numeric"
                      error={touched.dependentes && errors.dependentes}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Cidade/Estado</Text>
                    <CustomInput
                      iconName="location-outline"
                      placeholder="São Paulo/SP"
                      value={values.cidadeEstado}
                      onChangeText={handleChange('cidadeEstado')}
                      onBlur={handleBlur('cidadeEstado')}
                    />
                  </View>
                </View>

                {/* Preferências do App */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Preferências do App</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Moeda Principal</Text>
                    <View style={styles.pickerContainer}>
                      <Ionicons name="logo-usd" size={20} color="#666" style={styles.pickerIcon} />
                      <Picker
                        selectedValue={values.moedaPrincipal}
                        onValueChange={(value) => setFieldValue('moedaPrincipal', value)}
                        style={styles.picker}
                      >
                        <Picker.Item label="Real (R$)" value="R$" />
                        <Picker.Item label="Dólar (US$)" value="US$" />
                        <Picker.Item label="Euro (€)" value="€" />
                      </Picker>
                    </View>
                  </View>

                  <View style={styles.switchGroup}>
                    <View style={styles.switchLabelContainer}>
                      <Ionicons name="notifications-outline" size={20} color="#333" />
                      <Text style={styles.switchLabel}>Notificações Ativas</Text>
                    </View>
                    <Switch
                      value={values.notificacoesAtivas}
                      onValueChange={(value) => setFieldValue('notificacoesAtivas', value)}
                      trackColor={{ false: '#767577', true: '#66ccff' }}
                      thumbColor={values.notificacoesAtivas ? '#003366' : '#f4f3f4'}
                    />
                  </View>

                  <View style={styles.switchGroup}>
                    <View style={styles.switchLabelContainer}>
                      <Ionicons name="share-social-outline" size={20} color="#333" />
                      <Text style={styles.switchLabel}>Compartilhar dados anônimos</Text>
                    </View>
                    <Switch
                      value={values.compartilharDados}
                      onValueChange={(value) => setFieldValue('compartilharDados', value)}
                      trackColor={{ false: '#767577', true: '#66ccff' }}
                      thumbColor={values.compartilharDados ? '#003366' : '#f4f3f4'}
                    />
                  </View>
                </View>

                <CustomButton
                  title={isSubmitting ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  style={styles.saveButton}
                />
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  fullContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  formContainer: {
    // Estilo removido, pois o ScrollView já contém os elementos
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#003366',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#003366',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#003366',
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  changeImageText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#003366',
    fontWeight: 'bold',
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 16,
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
  inputContainer: {
    marginBottom: 0,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  inputError: {
    borderColor: '#F44336',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    flex: 1,
  },
  pickerIcon: {
    marginRight: 10,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  saveButton: {
    marginTop: 20,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 15,
  },
});