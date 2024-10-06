import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Animated } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, TextInput, Button, Text, Title, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as Google from 'expo-auth-session/providers/google';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../confg/config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import * as Random from 'expo-random'; // Import expo-random

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6C63FF',
    accent: '#FF6584',
    background: 'transparent',
  },
};

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Google Sign-In setup
  const [googleRequest, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    clientId: '335360787471-f9vabut71lv9rcsp2qhcp8tmftohn2m6.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  // Handle authentication responses
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      handleGoogleSignIn(authentication.accessToken);
    }
  }, [googleResponse]);

  const handleGoogleSignIn = async (accessToken) => {
    setLoading(true);
    try {
      const userData = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const response = await axios.post(`${API_BASE_URL}/google-signin`, userData.data);
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      Toast.show({
        type: 'success',
        text1: 'Google Sign-In Successful',
        text2: `Welcome ${userData.data.name}!`,
      });
      navigation.navigate('Main');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Google Sign-In Error',
        text2: 'Unable to sign in with Google. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/signin`, { email, password });
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      Toast.show({
        type: 'success',
        text1: 'Sign In Successful',
        text2: 'Welcome back!',
      });
      navigation.navigate('Main');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Oops!',
        text2: 'Your Password or Username is wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <LinearGradient colors={['#4158D0', '#C850C0', '#FFCC70']} style={styles.gradient}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Animated.View style={[styles.surface, { opacity: fadeAnim }]}>
          <Surface style={styles.logoContainer}>
            <MaterialCommunityIcons name="home-outline" size={28} color={theme.colors.primary} />
          </Surface>
          <Title style={styles.title}>Square</Title>
          <Text style={styles.subtitle}>Houses for rent and sale</Text>

          {/* Email Input */}
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: theme.colors.primary } }}
            left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="email" size={24} color={theme.colors.primary} />} />}
          />

          {/* Password Input */}
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: theme.colors.primary } }}
            left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="lock" size={24} color={theme.colors.primary} />} />}
          />

          {/* Sign In Button */}
          <Button
            mode="contained"
            onPress={handleSignIn}
            loading={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            <Text>Sign In</Text>
          </Button>

          {/* Google Sign-In Button */}
          <Button
            mode="contained"
            onPress={() => promptGoogleAsync()}
            disabled={loading || !googleRequest}
            style={styles.googleButton}
            contentStyle={styles.googleButtonContent}
            labelStyle={styles.googleButtonLabel}
            icon={() => (
              <MaterialCommunityIcons name="google" size={24} color="#FFFFFF" />
            )}
          >
            <Text>Sign in with Google</Text>
          </Button>

          {/* Forgot Password Button */}
          <Button
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
            style={styles.textButton}
            labelStyle={styles.textButtonLabel}
          >
            <Text>Forgot Password?</Text>
          </Button>

          {/* Register Button */}
          <Button
            onPress={() => navigation.navigate('RegisterByOTP')}
            style={styles.textButton}
            labelStyle={styles.textButtonLabel}
          >
            <Text>Don't have an account? Sign Up</Text>
          </Button>
        </Animated.View>
      </ScrollView>
      <Toast />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollView: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 16 },
  surface: { padding: 20, width: '90%', maxWidth: 380, alignItems: 'center', borderRadius: 16, backgroundColor: 'rgba(255, 255, 255, 0.95)', elevation: 4 },
  logoContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12, elevation: 2 },
  title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.primary, marginVertical: 2 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  input: { width: '100%', marginBottom: 12, backgroundColor: 'white' },
  button: { width: '100%', marginTop: 6, borderRadius: 4 },
  buttonContent: { paddingVertical: 6 },
  buttonLabel: { fontSize: 16 },
  textButton: { marginTop: 12 },
  textButtonLabel: { fontSize: 14, color: theme.colors.primary },
  googleButton: {
    width: '100%',
    marginTop: 12,
    borderRadius: 4,
    backgroundColor: '#4285F4', // Google blue background
    borderWidth: 1,
    borderColor: '#4285F4', // Matching blue border
  },
  googleButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10, // Increased padding for comfortable clicking
  },
  googleButtonLabel: {
    fontSize: 16,
    color: '#FFFFFF', // White text to match official Google button theme
    marginLeft: 20, // Space between Google logo and text
    fontWeight: 'bold', // Bold text for better visibility
  },
});

export default SignInScreen;
