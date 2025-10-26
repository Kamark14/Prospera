// TelaLogin.js - REFATORADO PARA USAR AuthContext
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
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
import { useAuth } from './components/AuthContext'; // Importação do useAuth

export default function TelaLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { login, user } = useAuth(); // Usando o hook useAuth

  useEffect(() => {
    // Se o usuário já estiver logado (estado do AuthContext), navega para o Dashboard
    if (user) {
      navigation.replace('Dashboard');
    }
  }, [user, navigation]);

  const handleLogin = async () => {
    // 1. Validação básica
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    // 2. Chama a função de login do AuthContext
    const result = await login(email, senha);

    // 3. Trata o resultado
    if (result.success) {
      // A navegação para o Dashboard é tratada pelo useEffect, que reage à mudança do estado 'user'
      // Mas para garantir uma transição imediata, podemos chamar replace aqui também.
      navigation.replace('Dashboard');
    } else {
      Alert.alert('Erro', result.message || 'Falha ao realizar login.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={require('../assets/lotus.png')} style={styles.logo} />
        <Text style={styles.title}>ENTRAR EM CONTA</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        {/* CAMPO SENHA COM BOTÃO VISUALIZAR */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha"
            secureTextEntry={!mostrarSenha}
            placeholderTextColor="#ccc"
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity 
            style={styles.eyeButton}
            onPress={() => setMostrarSenha(!mostrarSenha)}
          >
            <Icon 
              name={mostrarSenha ? "visibility-off" : "visibility"} 
              size={24} 
              color="#003366" 
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
        
        <Text style={styles.linkText} onPress={() => navigation.navigate('Cadastro')}>
          Não possui conta? Cadastre-se já
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003366',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginBottom: 30,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeButton: {
    padding: 10,
  },
  button: {
    backgroundColor: '#66ccff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#003366',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    color: 'white',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});
