// CustomButton.js - VERSÃO ATUALIZADA (com suporte a textColor)
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false, 
  type = 'primary',
  textColor // NOVA PROPRIEDADE ADICIONADA
}) => {
  const getButtonStyle = () => {
    switch (type) {
      case 'secondary':
        return styles.secondaryButton;
      case 'danger':
        return styles.dangerButton;
      case 'primary':
      default:
        return styles.primaryButton;
    }
  };

  const getButtonTextStyle = () => {
    switch (type) {
      case 'secondary':
        return styles.secondaryButtonText;
      case 'danger':
        return styles.dangerButtonText;
      case 'primary':
      default:
        return styles.primaryButtonText;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.baseButton, getButtonStyle(), style, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.baseButtonText, 
        getButtonTextStyle(), 
        textStyle,
        textColor && { color: textColor } // APLICA COR PERSONALIZADA SE FOR FORNECIDA
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButton: {
    backgroundColor: '#66ccff',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#003366',
  },
  dangerButton: {
    backgroundColor: '#ff4d4d',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  baseButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  primaryButtonText: {
    color: '#003366',
  },
  secondaryButtonText: {
    color: '#003366',
  },
  dangerButtonText: {
    color: 'white',
  },
});

export default CustomButton;