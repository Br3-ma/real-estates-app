import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Animated } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, TextInput, Button, Text, Title, Surface, ProgressBar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../confg/config';
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6C63FF',
    accent: '#FF6584',
    background: 'transparent',
  },
};

const SignupsquareateAgentScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    loadSavedValues();
  }, []);

  const loadSavedValues = async () => {
    try {
      const savedName = await AsyncStorage.getItem('signupName');
      const savedEmail = await AsyncStorage.getItem('signupEmail');
      const savedPhone = await AsyncStorage.getItem('signupPhone');
      if (savedName) setName(savedName);
      if (savedEmail) setEmail(savedEmail);
      if (savedPhone) setPhone(savedPhone);
    } catch (error) {
      console.error('Error loading saved values:', error);
    }
  };

  const saveValues = async () => {
    try {
      await AsyncStorage.setItem('signupName', name);
      await AsyncStorage.setItem('signupEmail', email);
      await AsyncStorage.setItem('signupPhone', phone);
    } catch (error) {
      console.error('Error saving values:', error);
    }
  };

  const handleSignup = async () => {
      setLoading(true);
      try {
          const response = await axios.post(`${API_BASE_URL}/signup/user-info`, {
              name,
              email,
              phone,
              password,
          });
          await AsyncStorage.removeItem('userInfo');
          await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
          await AsyncStorage.multiRemove(['signupName', 'signupEmail', 'signupPhone']);
          navigation.navigate('OTPScreen');
      } catch (error) {
          if (error.response) {
              const errorMessages = Object.values(error.response.data.message).flat().join('\n');
              Toast.show({
                  type: 'error',
                  text1: 'Sign Up Failure',
                  text2: errorMessages || 'Unknown error occurred. Please try again.',
              });
          }
      } finally {
          setLoading(false);
      }
  };

  const handlePhoneChange = (inputText) => {
    const formattedPhone = inputText.replace(/\D/g, '');
    if (formattedPhone.length <= 10) {
      setPhone(formattedPhone);
      saveValues();
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
    <LinearGradient colors={['#4158D0', '#C850C0', '#FFCC70']} style={styles.gradient}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Animated.View style={[styles.surface, { opacity: fadeAnim }]}>
          <Title style={styles.title}>Create Account</Title>
          <Text style={styles.subtitle}>Join our real estate community</Text>
          
          <TextInput
            label="Full Name"
            value={name}
            onChangeText={(text) => { setName(text); saveValues(); }}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: theme.colors.primary } }}
            left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="account" size={20} color={theme.colors.primary} />} />}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => { setEmail(text); saveValues(); }}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            theme={{ colors: { primary: theme.colors.primary } }}
            left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="email" size={20} color={theme.colors.primary} />} />}
          />

          <TextInput
            label="Phone"
            value={phone}
            onChangeText={handlePhoneChange}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
            theme={{ colors: { primary: theme.colors.primary } }}
            left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="phone" size={20} color={theme.colors.primary} />} />}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            theme={{ colors: { primary: theme.colors.primary } }}
            left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="lock" size={20} color={theme.colors.primary} />} />}
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
            onPress={() => navigation.navigate('SignIn')}
            style={styles.textButton}
            labelStyle={styles.textButtonLabel}
          >
            Already have an account? Log In
          </Button>
        </Animated.View>
      </ScrollView>
      <Toast />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  surface: {
    padding: 15,
    width: '90%',
    maxWidth: 380,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginVertical: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    marginBottom: 8,
    backgroundColor: 'white',
  },
  progressBar: {
    width: '100%',
    height: 3,
    marginBottom: 12,
  },
  button: {
    width: '100%',
    marginTop: 4,
    borderRadius: 20,
  },
  buttonContent: {
    height: 40,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textButton: {
    marginTop: 10,
  },
  textButtonLabel: {
    fontSize: 12,
    color: theme.colors.primary,
  },
});

export default SignupsquareateAgentScreen;
