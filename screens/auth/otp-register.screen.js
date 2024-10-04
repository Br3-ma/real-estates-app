import React, { useState } from 'react';
import { ImageBackground, StyleSheet, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, TextInput, Button, Text, Title, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from 'react-native-toast-notifications';
import { API_BASE_URL } from '../../confg/config';

const backgroundImage = require('../../assets/img/modern-city.jpg');

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FFD700',
    accent: '#FFF',
    background: 'transparent',
    text: '#FFF',
  },
};

const SignupsquareateAgentScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSignup = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/signup/user-info`, {
        name,
        email,
        phone,
        password,
      }, { timeout: 10000 });
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      navigation.navigate('Main');
    } catch (error) {
      let errorMessage = 'There was an issue with your signup. Please try again.';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      toast.show(errorMessage, {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
      console.error('Signup Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <ImageBackground source={backgroundImage} style={styles.background}>
        <StatusBar style="light" />
        <LinearGradient colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <Surface style={styles.surface}>
              <View style={styles.header}>
                <FontAwesome5 name="home" size={60} color={theme.colors.primary} />
                <Title style={styles.title}>Real Estate Agent Signup</Title>
              </View>
              
              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                theme={{ colors: { primary: theme.colors.primary } }}
                left={<TextInput.Icon icon="account" color={theme.colors.primary} />}
              />
              
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                theme={{ colors: { primary: theme.colors.primary } }}
                left={<TextInput.Icon icon="email" color={theme.colors.primary} />}
              />
              
              <TextInput
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                mode="outlined"
                style={styles.input}
                keyboardType="phone-pad"
                theme={{ colors: { primary: theme.colors.primary } }}
                left={<TextInput.Icon icon="phone" color={theme.colors.primary} />}
              />
              
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                theme={{ colors: { primary: theme.colors.primary } }}
                left={<TextInput.Icon icon="lock" color={theme.colors.primary} />}
              />
              
              <Button 
                mode="contained" 
                onPress={handleSignup} 
                loading={isLoading} 
                disabled={isLoading}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </Surface>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  surface: {
    padding: 32,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    width: '100%',
    marginTop: 24,
    paddingVertical: 8,
    backgroundColor: theme.colors.primary,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 18,
    color: '#000',
  },
});

export default SignupsquareateAgentScreen;