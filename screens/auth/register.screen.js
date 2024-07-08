import React, { useState } from 'react';
import { View, ImageBackground, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastProvider, useToast } from 'react-native-toast-notifications';
import { API_BASE_URL } from '../../confg/config';

const backgroundImage = require('../../assets/img/grad.gif');

const SignupRealEstateAgentScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Function to handle signup
  const handleSignup = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(`${API_BASE_URL}/signup/user-info`, {
        name,
        email,
        phone,
        password,
      });
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      navigation.navigate('Main');
    } catch (error) {
      toast.show('There was an issue with your signup. Email already exists or Invalid Information.', {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
      console.error('Signup Error:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to handle phone input change
  const handlePhoneChange = (inputText) => {
    // Remove non-digit characters
    const formattedPhone = inputText.replace(/\D/g, '');
    // Ensure it doesn't exceed 10 digits
    if (formattedPhone.length <= 10) {
      setPhone(formattedPhone);
    }
  };

  // Function to calculate password strength
  const getPasswordStrength = () => {
    // Define regex patterns for each criteria
    const hasLetters = /[a-zA-Z]/.test(password); // Check for letters
    const hasNumbers = /\d/.test(password);       // Check for numbers
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Check for symbols

    // Calculate strength based on criteria met
    let strength = 0;
    if (password.length > 10) {
      strength += 3; // Length bonus
    } else {
      strength += password.length / 4; // Partial length bonus
    }

    if (hasLetters) {
      strength += 3; // Letters bonus
    }
    if (hasNumbers) {
      strength += 2; // Numbers bonus
    }
    if (hasSymbols) {
      strength += 3; // Symbols bonus
    }

    // Determine color based on strength
    const color =
      strength > 7 ? 'green' : strength > 5 ? 'orange' : 'red';

    // Return strength as a percentage of maximum possible strength
    return {
      width: `${Math.min(strength * 10, 100)}%`, // Cap at 100% width
      backgroundColor: color,
    };
  };

  return (
    <ImageBackground style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <FontAwesome name="user-circle" size={80} color="#FFF" />
          <Text style={styles.title}>Sign Up</Text>
        </View>
        <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="account" size={20} color="#FFF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#cccccc"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="email" size={20} color="#FFF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#cccccc"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="phone" size={20} color="#FFF" style={styles.icon} />
          <Text color="#FFF" style={styles.hint}>+26</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor="#cccccc"
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock" size={20} color="#FFF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#cccccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
        <View style={[styles.passwordStrength, getPasswordStrength()]} />
        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.loginLink}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#6F428A', // Start color of the gradient
    zIndex: -1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFF',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  icon: {
    marginRight: 10,
  },
  hint: {
    marginRight: 5,
    color:'#fff',
  },
  passwordStrength: {
    height: 3,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#7D7399',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

const App = ({ navigation }) => (
  <ToastProvider>
    <SignupRealEstateAgentScreen navigation={navigation} />
  </ToastProvider>
);

export default App;
