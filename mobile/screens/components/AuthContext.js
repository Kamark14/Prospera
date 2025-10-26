// AuthContext.js - REFATORADO PARA SEGURANÇA E ESTABILIDADE
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem('logado');
        const usuarioStr = await AsyncStorage.getItem('usuario');
        
        if (loggedIn === 'true' && usuarioStr) {
          // Apenas carrega os dados do usuário. A senha não é mais armazenada no objeto.
          const usuarioData = JSON.parse(usuarioStr);
          // REMOVENDO SENHA DO OBJETO DE USUÁRIO PARA SEGURANÇA
          delete usuarioData.senha; 
          setUser(usuarioData); 
        }
      } catch (e) {
        console.error('Falha ao carregar o estado de autenticação', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, senha) => {
    // Em um cenário real, esta chamada seria para uma API de backend.
    // Aqui, simulamos a verificação de credenciais no AsyncStorage.
    const usuarioStr = await AsyncStorage.getItem('usuario');
    if (!usuarioStr) {
      return { success: false, message: 'Nenhum usuário cadastrado!' };
    }

    const usuario = JSON.parse(usuarioStr);
    
    // VERIFICAÇÃO DE CREDENCIAIS
    if (email === usuario.email && senha === usuario.senha) {
      await AsyncStorage.setItem('logado', 'true');
      
      // Cria um objeto de usuário sem a senha para armazenar no estado do Context
      const userWithoutPassword = { ...usuario };
      delete userWithoutPassword.senha;
      
      setUser(userWithoutPassword); 
      return { success: true };
    } else {
      return { success: false, message: 'Email ou senha inválidos' };
    }
  };
  
  // Função de cadastro para manter a compatibilidade com o fluxo atual
  const cadastrar = async (usuarioData) => {
    try {
      // Em um cenário real, o backend faria o hash da senha antes de salvar.
      // Aqui, salvamos o objeto completo (incluindo senha) para a simulação de login funcionar.
      await AsyncStorage.setItem('usuario', JSON.stringify(usuarioData));
      return { success: true };
    } catch (e) {
      console.error('Falha ao cadastrar usuário', e);
      return { success: false, message: 'Erro ao cadastrar usuário.' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('logado');
      setUser(null);
    } catch (e) {
      console.error('Falha ao fazer logout', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, cadastrar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
