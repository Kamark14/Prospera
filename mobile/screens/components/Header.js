// Header.js - ATUALIZADO
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const Header = ({ 
  title, 
  leftIcon = 'arrow-back', 
  onLeftPress, 
  rightIcon, 
  onRightPress, 
  theme = 'light',
  leftComponent, // Nova prop para componente personalizado à esquerda
  rightComponent // Nova prop para componente personalizado à direita
}) => {
  const navigation = useNavigation();

  const handleLeftPress = onLeftPress || (() => navigation.goBack());
  
  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#003366' : 'white';
  const textColor = isDark ? 'white' : '#003366';
  const iconColor = isDark ? 'white' : '#003366';

  return (
    <View style={[styles.headerContainer, { 
        backgroundColor: backgroundColor, 
        borderBottomColor: isDark ? 'transparent' : '#eee'
    }]}>
      
      {/* Lado Esquerdo */}
      <View style={styles.iconContainer}>
        {leftComponent ? (
          leftComponent
        ) : (
          <TouchableOpacity 
            onPress={handleLeftPress}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Icon name={leftIcon} size={24} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={[styles.headerTitle, { color: textColor }]}>{title}</Text>
      
      {/* Lado Direito */}
      <View style={styles.iconContainer}>
        {rightComponent ? (
          rightComponent
        ) : (
          <TouchableOpacity 
            onPress={onRightPress}
            disabled={!rightIcon}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            {rightIcon ? <Icon name={rightIcon} size={24} color={iconColor} /> : <View style={{ width: 24 }} />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 30 : 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  iconContainer: {
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;