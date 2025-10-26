import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaLogin from './screens/TelaLogin';
import TelaCadastro from './screens/TelaCadastro';
import TelaUsuario from './screens/TelaUsuario';
import TelaDashboard from './screens/TelaDashboard';
import TelaMetas from './screens/TelaMetas';
import TelaGastos from './screens/TelaGastos';
import TelaConfigPerfil from './screens/TelaConfigPerfil';
import TelaContas from './screens/TelaContas';
import TelaPatrimonio from './screens/TelaPatrimonio';
import TelaRelatorios from './screens/TelaRelatorios';
import { AuthProvider } from './screens/components/AuthContext'; // Importação do AuthProvider

const Stack = createNativeStackNavigator();

// Tela Inicial
function TelaInicial({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/lotus.png')} style={styles.logo} />
      <Text style={styles.title}>PROSPERA</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>INICIAR</Text>
      </TouchableOpacity>
    </View>
  );
}

// Navegação entre telas
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Inicial" component={TelaInicial} />
          <Stack.Screen name="Login" component={TelaLogin} />
          <Stack.Screen name="Cadastro" component={TelaCadastro} />
          <Stack.Screen name="Usuario" component={TelaUsuario} />
          <Stack.Screen name="Dashboard" component={TelaDashboard} />
          <Stack.Screen name="Metas" component={TelaMetas} />
          <Stack.Screen name="Gastos" component={TelaGastos} />
          <Stack.Screen name="ConfigPerfil" component={TelaConfigPerfil} />
          <Stack.Screen name="Contas" component={TelaContas} />
          <Stack.Screen name="Patrimonio" component={TelaPatrimonio} />
          <Stack.Screen name="Relatorios" component={TelaRelatorios} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003366',
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
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 60,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 18,
    color: '#003366',
    fontWeight: 'bold',
  },
});
