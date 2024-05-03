import React, { useState } from 'react';
import { View, ImageBackground, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backgroundImage = require('../../assets/img/otp.jpeg');

const SignupRealEstateAgentScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post('https://api.yourdomain.com/api/signup', {
        name,
        email,
        password,
      });
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Signup Error:', error);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Full name"
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
          placeholder="Password"
          placeholderTextColor="#cccccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 30,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
});

export default SignupRealEstateAgentScreen;
