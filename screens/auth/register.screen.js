import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, ScrollView } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, TextInput, Button, Text, Title, Surface, ProgressBar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../confg/config';
import Toast from 'react-native-toast-message';

const backgroundImage = require('../../assets/img/grad.gif');

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#8E2DE2',
    accent: '#FFF',
    background: 'transparent',
    text: '#FFF',
  },
};

const SignupRealEstateAgentScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/signup/user-info`, {
        name,
        email,
        phone,
        password,
      });
      console.log(response);
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      navigation.navigate('Main');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Error: ${error.message}`
      });
      console.error('Signup Error:', error.message);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request data:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (inputText) => {
    const formattedPhone = inputText.replace(/\D/g, '');
    if (formattedPhone.length <= 10) {
      setPhone(formattedPhone);
    }
  };

  const getPasswordStrength = () => {
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let strength = 0;
    if (password.length > 10) {
      strength += 3;
    } else {
      strength += password.length / 4;
    }

    if (hasLetters) strength += 3;
    if (hasNumbers) strength += 2;
    if (hasSymbols) strength += 3;

    const progress = Math.min(strength / 10, 1);
    const color = progress > 0.7 ? 'green' : progress > 0.5 ? 'orange' : 'red';

    return { progress, color };
  };

  
  const passwordStrength = getPasswordStrength();

  return (
    <PaperProvider theme={theme}>
      <ImageBackground source={backgroundImage} style={styles.background}>
        <StatusBar style="dark" />
        <LinearGradient colors={['#fff', 'rgba(125, 115, 153, 0.8)']} style={styles.gradient}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Surface style={styles.surface}>
              <View style={styles.header}>
                <FontAwesome name="user-circle" size={60} color={theme.colors.primary} />
                <Title style={styles.title}>Create your account</Title>
              </View>

              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                theme={{ colors: { primary: theme.colors.primary } }}
                left={<TextInput.Icon icon="account" color={theme.colors.primary} size={20} />}
                dense
              />

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                theme={{ colors: { primary: theme.colors.primary } }}
                left={<TextInput.Icon icon="email" color={theme.colors.primary} size={20} />}
                dense
              />

              <TextInput
                label="Phone"
                value={phone}
                onChangeText={handlePhoneChange}
                mode="outlined"
                style={styles.input}
                keyboardType="phone-pad"
                theme={{ colors: { primary: theme.colors.primary } }}
                left={<TextInput.Icon icon="phone" color={theme.colors.primary} size={20} />}
                dense
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                theme={{ colors: { primary: theme.colors.primary } }}
                left={<TextInput.Icon icon="lock" color={theme.colors.primary} size={20} />}
                dense
              />

              <ProgressBar progress={passwordStrength.progress} color={passwordStrength.color} style={styles.progressBar} />

              <Button 
                mode="contained" 
                onPress={handleSignup} 
                loading={loading} 
                disabled={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Sign Up
              </Button>

              <Button 
                mode="text" 
                onPress={() => navigation.navigate('SignIn')}
                style={styles.loginLink}
                labelStyle={styles.loginLinkText}
              >
                Already have an account? Log In
              </Button>
            </Surface>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
      
      <Toast />
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
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  surface: {
    padding: 16,
    width: '95%',
    maxWidth: 400,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8E2DE2',
    marginTop: 8,
  },
  input: {
    width: '100%',
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 50,
  },
  progressBar: {
    width: '100%',
    height: 3,
    marginBottom: 8,
  },
  button: {
    width: '100%',
    marginTop: 8,
  },
  buttonContent: {
    height: 40,
  },
  buttonLabel: {
    fontSize: 16,
  },
  loginLink: {
    marginTop: 8,
  },
  loginLinkText: {
    color: '#FFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default SignupRealEstateAgentScreen;