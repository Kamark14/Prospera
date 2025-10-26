// CustomTextInput.js - VERSÃO FINAL CORRIGIDA com visualização de senha e máscara de data
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';

const CustomTextInput = ({ 
  iconName, 
  placeholder, 
  value, 
  onChangeText, 
  keyboardType = 'default', 
  secureTextEntry = false, 
  error,
  autoCapitalize = 'none',
  mask, // Nova prop para máscara
  ...rest 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const isPasswordField = secureTextEntry;
  const hidePassword = isPasswordField && !isPasswordVisible;

  // Lógica de formatação de data
  const handleMaskedChange = (text) => {
    if (mask === 'date') {
      let cleanedText = text.replace(/\D/g, ''); // Remove tudo que não é dígito
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

      onChangeText(formattedText);
    } else {
      onChangeText(text);
    }
  };

  const handleChange = mask ? handleMaskedChange : onChangeText;

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused,
        error && styles.inputWrapperError,
      ]}>
        {iconName && (
          <Icon 
            name={iconName} 
            size={24} 
            color={error ? '#F44336' : (isFocused ? '#003366' : '#999')} 
            style={styles.icon} 
          />
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#ccc"
          value={value}
          onChangeText={handleChange}
          keyboardType={keyboardType}
          secureTextEntry={hidePassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize={autoCapitalize}
          maxLength={mask === 'date' ? 10 : undefined}
          {...rest}
        />

        {isPasswordField && (
          <TouchableOpacity 
            onPress={togglePasswordVisibility} 
            style={styles.eyeButton}
          >
            <Ionicons 
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} 
              size={24} 
              color="#999" 
            />
          </TouchableOpacity>
        )}
        
        {error && (
          <Icon 
            name="error-outline" 
            size={24} 
            color="#F44336" 
            style={styles.errorIcon} 
          />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'white',
    height: 55,
  },
  inputWrapperFocused: {
    borderColor: '#003366',
    borderWidth: 2,
  },
  inputWrapperError: {
    borderColor: '#F44336',
    borderWidth: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  eyeButton: {
    paddingLeft: 10,
  },
  errorIcon: {
    marginLeft: 10,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 15,
  },
});

export default CustomTextInput;