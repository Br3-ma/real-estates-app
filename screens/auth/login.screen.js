import React, { useState } from 'react';
import { View, ImageBackground, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastProvider, useToast } from 'react-native-toast-notifications';

const backgroundImage = require('../../assets/img/otp.jpeg');

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://192.168.43.63/realestserver/est-server/api/signin', {
        email,
        password,
      });
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      navigation.navigate('Main');
    } catch (error) {
      toast.show('Invalid email or password. Please try again.', {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
      console.error('Sign In Error:', error);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <FontAwesome name="sign-in" size={80} color="#FFF" />
          <Text style={styles.title}>Sign In</Text>
        </View>
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
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterByOTP')}>
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
  signupText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default function App({ navigation }) {

  return (
    <ToastProvider>
      <SignInScreen navigation={navigation} />
    </ToastProvider>
  );
}
