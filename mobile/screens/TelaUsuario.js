// TelaUsuario.js - ATUALIZADO
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './components/AuthContext';
import Header from './components/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Image } from 'react-native';

export default function TelaUsuario({ navigation }) {
  const { user, logout } = useAuth();
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const perfilStr = await AsyncStorage.getItem('@perfil');
        if (perfilStr) {
          const perfil = JSON.parse(perfilStr);
          setNome(perfil.nome || '');
          setFotoPerfil(perfil.fotoPerfil || null);
        }
        
        // Sempre usa o email do contexto de autenticação
        if (user && user.email) {
          setEmail(user.email);
        }
        
        // Se não tiver nome no perfil, tenta pegar do usuário
        if (!nome && user && user.nome) {
          setNome(user.nome);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      }
    };
    
    carregarPerfil();
  }, [user, nome]);

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

  const go = (destino) => navigation.navigate(destino);

  return (
    <SafeAreaView style={styles.safe}>
      <Header 
        title="Meu Perfil" 
        leftIcon="arrow-back" 
        onLeftPress={() => navigation.goBack()}
        rightIcon="settings" 
        onRightPress={() => go('ConfigPerfil')}
      />

      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Informações do Perfil */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={() => go('ConfigPerfil')}>
            {fotoPerfil ? (
              <Image source={{ uri: fotoPerfil }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon name="account-circle" size={80} color="#003366" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.userName}>{nome || 'Usuário'}</Text>
          <Text style={styles.userEmail}>{email || 'email@exemplo.com'}</Text>
        </View>

        {/* Menu de Opções */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => go('Dashboard')}>
            <Icon name="dashboard" size={24} color="#003366" style={styles.menuIcon} />
            <Text style={styles.menuText}>Dashboard</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => go('Metas')}>
            <Icon name="flag" size={24} color="#003366" style={styles.menuIcon} />
            <Text style={styles.menuText}>Metas</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => go('Gastos')}>
            <Icon name="money-off" size={24} color="#003366" style={styles.menuIcon} />
            <Text style={styles.menuText}>Gastos</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => go('Contas')}>
            <Icon name="credit-card" size={24} color="#003366" style={styles.menuIcon} />
            <Text style={styles.menuText}>Contas Bancárias</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => go('Patrimonio')}>
            <Icon name="account-balance" size={24} color="#003366" style={styles.menuIcon} />
            <Text style={styles.menuText}>Patrimônio</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => go('Relatorios')}>
            <Icon name="bar-chart" size={24} color="#003366" style={styles.menuIcon} />
            <Text style={styles.menuText}>Relatórios</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => go('ConfigPerfil')}>
            <Icon name="settings" size={24} color="#003366" style={styles.menuIcon} />
            <Text style={styles.menuText}>Configurações de Perfil</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
            <Icon name="logout" size={24} color="#ff4d4d" style={styles.menuIcon} />
            <Text style={[styles.menuText, styles.logoutText]}>Sair da Conta</Text>
            <Icon name="chevron-right" size={24} color="#ff4d4d" />
          </TouchableOpacity>
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
    padding: 20,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#003366',
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#003366',
    backgroundColor: '#f0f0f0',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#003366',
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  menuContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  menuIcon: {
    width: 30,
  },
  logoutButton: {
    borderBottomWidth: 0,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10,
    paddingTop: 15,
  },
  logoutText: {
    color: '#ff4d4d',
    fontWeight: 'bold',
  },
});