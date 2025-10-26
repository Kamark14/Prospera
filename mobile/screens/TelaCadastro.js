// TelaCadastro.js - VERSÃO FINAL COM AJUSTES VISUAIS E FUNCIONAIS
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Header from './components/Header'; // Importando o Header
import CustomButton from './components/CustomButton'; // Importando o CustomButton
import CustomTextInput from './components/CustomTextInput'; // Importando o CustomTextInput
// Função de formatação de CPF
const formatCpf = (cpf) => {
  let cleaned = cpf.replace(/[^0-9]/g, '');
  if (cleaned.length > 3 && cleaned.length <= 6) {
    cleaned = `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  } else if (cleaned.length > 6 && cleaned.length <= 9) {
    cleaned = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  } else if (cleaned.length > 9) {
    cleaned = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
  }
  return cleaned;
};

export default function TelaCadastro({ navigation }) {
  // Removendo os estados de mostrarSenha, pois agora o CustomTextInput cuida disso
  
  // Schema de validação com Yup
  const CadastroSchema = Yup.object().shape({
    nome: Yup.string().required('O nome é obrigatório'),
    cpf: Yup.string()
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')
      .required('O CPF é obrigatório'),
    email: Yup.string().email('E-mail inválido').required('O e-mail é obrigatório'),
    senha: Yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('A senha é obrigatória'),
    confirmarSenha: Yup.string()
      .oneOf([Yup.ref('senha'), null], 'As senhas devem ser iguais')
      .required('A confirmação de senha é obrigatória'),
    aceitaTermos: Yup.boolean()
      .oneOf([true], 'Você deve aceitar os termos de privacidade'),
  });

  const handleCadastro = async (values, { setSubmitting }) => {
    const novoUsuario = {
      nome: values.nome,
      cpf: values.cpf,
      email: values.email,
      senha: values.senha,
    };

    try {
      await AsyncStorage.setItem('usuario', JSON.stringify(novoUsuario));
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (e) {
      Alert.alert('Erro', 'Falha ao salvar dados do usuário.');
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header com tema 'dark' para inverter as cores */}
      <Header 
        title="CRIAR CONTA" 
        leftIcon="arrow-back" 
        onLeftPress={() => navigation.goBack()}
        theme="dark" // Aplica o tema escuro (fundo azul, texto branco)
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Imagem de Lótus (Se você tiver o arquivo, descomente e ajuste o caminho) */}
        {/* <Image source={require('../assets/lotus.png')} style={styles.logo} /> */}
        
        <Formik
          initialValues={{ nome: '', cpf: '', email: '', senha: '', confirmarSenha: '', aceitaTermos: false }}
          validationSchema={CadastroSchema}
          onSubmit={handleCadastro}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
            <>
              <CustomTextInput
                iconName="person"
                placeholder="Nome"
                value={values.nome}
                onChangeText={handleChange('nome')}
                onBlur={handleBlur('nome')}
                error={touched.nome && errors.nome}
              />
              
              <CustomTextInput
                iconName="badge"
                placeholder="CPF"
                value={values.cpf}
                onChangeText={(text) => setFieldValue('cpf', formatCpf(text))}
                onBlur={handleBlur('cpf')}
                keyboardType="numeric"
                maxLength={14}
                error={touched.cpf && errors.cpf}
              />
              
              <CustomTextInput
                iconName="email"
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                error={touched.email && errors.email}
              />
              
              {/* CAMPO SENHA - Usando o CustomTextInput com secureTextEntry=true (o CustomTextInput agora tem o ícone de olho) */}
              <CustomTextInput
                iconName="lock"
                placeholder="Senha"
                value={values.senha}
                onChangeText={handleChange('senha')}
                onBlur={handleBlur('senha')}
                secureTextEntry={true} // Isso ativa o ícone de olho no CustomTextInput
                error={touched.senha && errors.senha}
              />
              
              {/* CAMPO CONFIRMAR SENHA - Usando o CustomTextInput com secureTextEntry=true */}
              <CustomTextInput
                iconName="lock"
                placeholder="Confirmar senha"
                value={values.confirmarSenha}
                onChangeText={handleChange('confirmarSenha')}
                onBlur={handleBlur('confirmarSenha')}
                secureTextEntry={true} // Isso ativa o ícone de olho no CustomTextInput
                error={touched.confirmarSenha && errors.confirmarSenha}
              />

              <TouchableOpacity 
                style={styles.checkboxContainer} 
                onPress={() => setFieldValue('aceitaTermos', !values.aceitaTermos)}
              >
                <View style={[styles.checkbox, values.aceitaTermos && styles.checkboxChecked]}>
                  {/* Ícone do checkbox em branco para contraste com o fundo azul */}
                  {values.aceitaTermos && <Icon name="check" size={16} color="white" />}
                </View>
                <Text style={styles.checkboxLabel}>Termos de uso e privacidade</Text>
              </TouchableOpacity>
              {touched.aceitaTermos && errors.aceitaTermos && <Text style={styles.termsErrorText}>{errors.aceitaTermos}</Text>}

              <CustomButton
                title={isSubmitting ? 'CADASTRANDO...' : 'CADASTRAR'}
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={styles.button}
                // O CustomButton foi ajustado para usar a cor #66ccff e texto #003366
              />
            </>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003366', // Fundo azul escuro para a tela
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
    marginTop: 20,
    tintColor: 'white', // Adiciona tintColor para o logo ficar branco
  },
  
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    width: '100%',
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white', // Borda branca
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#66ccff', // Azul claro para o check
    borderColor: '#66ccff',
  },
  checkboxLabel: {
    color: 'white', // Texto branco
    fontSize: 14,
  },
  termsErrorText: {
    color: '#ff4d4d',
    fontSize: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 35,
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
});
