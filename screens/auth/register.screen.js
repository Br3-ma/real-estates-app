import React, { useState } from 'react';
import { View, ImageBackground, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastProvider, useToast } from 'react-native-toast-notifications';
import { API_BASE_URL } from '../../confg/config';

const backgroundImage = require('../../assets/img/otp.jpeg');

const SignupRealEstateAgentScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSignup = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(`${API_BASE_URL}/signup/user-info`, {
        name,
        email,
        phone,
        password,
      });
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      navigation.navigate('Main');
    } catch (error) {
      toast.show('There was an issue with your signup. Email already exist or Invalid Information.', {
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

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <FontAwesome name="user-circle" size={80} color="#FFF" />
          <Text style={styles.title}>Sign Up</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#cccccc"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#cccccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          placeholderTextColor="#cccccc"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#cccccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
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
  input: {
    width: '100%',
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#FFF',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    backgroundColor: '#FF6F61',
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
