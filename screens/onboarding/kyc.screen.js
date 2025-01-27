import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const RoleOption = ({ icon, title, isSelected, onSelect }) => {
  return (
    <TouchableOpacity 
      style={[styles.roleOption, isSelected && styles.roleOptionSelected]} 
      onPress={onSelect}
    >
      <FontAwesome name={icon} size={24} color={isSelected ? "#00332b" : "#fff"} />
      <Text style={[styles.roleText, isSelected && styles.roleTextSelected]}>{title}</Text>
      {isSelected && (
        <View style={styles.checkmark}>
          <FontAwesome name="check" size={16} color="#00332b" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const KYCScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
     AsyncStorage.setItem('onboardingStatus', 'ktc');
  }, []);

  const handleNext = async () => {
    if (selectedRole) {
      navigation.navigate('Main');
      // navigation.navigate('Main', { userRole: selectedRole });
    }
  };

  return (
      <View style={styles.overlay}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>Select your role to get started</Text>
        </View>

        <View style={styles.rolesContainer}>
          <RoleOption
            icon="home"
            title="Property Owner"
            isSelected={selectedRole === 'owner'}
            onSelect={() => setSelectedRole('owner')}
          />
          <RoleOption
            icon="user"
            title="Tenant"
            isSelected={selectedRole === 'tenant'}
            onSelect={() => setSelectedRole('tenant')}
          />
          <RoleOption
            icon="briefcase"
            title="Agent"
            isSelected={selectedRole === 'agent'}
            onSelect={() => setSelectedRole('agent')}
          />
        </View>

        <TouchableOpacity 
          style={[styles.nextButton, !selectedRole && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedRole}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
          <FontAwesome 
            name="angle-right" 
            size={24} 
            color={selectedRole ? "#00332b" : "#666"} 
          />
        </TouchableOpacity>

        <Text style={styles.helperText}>
          {selectedRole ? 
            `You're joining Square as a ${selectedRole}` : 
            'Please select your role to continue'}
        </Text>
      </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 48,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 12,
    color: '#4158D0',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(65, 88, 208, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 17,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: 0.3,
    opacity: 0.9,
  },
  rolesContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 48,
    paddingHorizontal: 4,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4158D0',
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#4158D0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  roleOptionSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#4158D0',
    transform: [{ scale: 1.02 }],
    shadowColor: '#C850C0',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 20,
    flex: 1,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  roleTextSelected: {
    color: '#4158D0',
    fontWeight: '700',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFCC70',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C850C0',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C850C0',
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 30,
    marginBottom: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#C850C0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.01 }],
  },
  nextButtonDisabled: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0.1,
    transform: [{ scale: 1 }],
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginRight: 12,
    letterSpacing: 0.5,
  },
  helperText: {
    color: '#4158D0',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.2,
    marginTop: 8,
    opacity: 0.9,
  },
});


export default KYCScreen;