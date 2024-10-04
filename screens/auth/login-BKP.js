import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Animated } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, TextInput, Button, Text, Title, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook'; // Import Facebook provider
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../confg/config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import * as Random from 'expo-random'; // Import expo-random

// Define a custom theme for react-native-paper
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

  // Set up Google sign-in with expo-auth-session
  const [googleRequest, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    clientId: '335360787471-f9vabut71lv9rcsp2qhcp8tmftohn2m6.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  // Set up Facebook sign-in with expo-auth-session
  const [facebookRequest, facebookResponse, promptFacebookAsync] = Facebook.useAuthRequest({
    clientId: '547040544348844',
  });

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      handleGoogleSignIn(authentication.accessToken);
    }

    if (facebookResponse?.type === 'success') {
      const { authentication } = facebookResponse;
      handleFacebookSignIn(authentication.accessToken);
    }
  }, [googleResponse, facebookResponse]);

  // Handle Google sign-in using API
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

  // Handle Facebook sign-in using API
  const handleFacebookSignIn = async (accessToken) => {
    setLoading(true);
    try {
      const userData = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`);
      const response = await axios.post(`${API_BASE_URL}/facebook-signin`, userData.data);
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      Toast.show({
        type: 'success',
        text1: 'Facebook Sign-In Successful',
        text2: `Welcome ${userData.data.name}!`,
      });
      navigation.navigate('Main');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Not Sign-In with Facebook',
        text2: 'Unable to sign in with Facebook. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Default Sign-in function
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
      console.log('Error details:', error);
      Toast.show({
        type: 'error',
        text1: 'Oops!',
        text2: 'Your Password or Username is wrong',
        // +error.message, // Show error message to help debugging
      });
    } finally {
      setLoading(false);
    }
  };

  // Animating surface opacity on component mount
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
            <MaterialCommunityIcons name="home-outline" size={48} color={theme.colors.primary} />
          </Surface>
          <Title style={styles.title}>SQuare</Title>
          <Text style={styles.subtitle}>Houses for rent and sale</Text>

          {/* Email Input */}
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: theme.colors.primary } }}
            left={<TextInput.Icon icon="email" />}
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
            left={<TextInput.Icon icon="lock" />}
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
            Sign In
          </Button>

          {/* Google Sign-In Button */}
          <Button
            mode="outlined"
            onPress={() => promptGoogleAsync()}
            disabled={loading || !googleRequest}
            style={styles.googleButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.googleButtonLabel}
          >
            Sign In with Google
          </Button>

          {/* Facebook Sign-In Button */}
          <Button
            mode="outlined"
            onPress={() => promptFacebookAsync()}
            disabled={loading || !facebookRequest}
            style={styles.facebookButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.facebookButtonLabel}
          >
            Sign In with Facebook
          </Button>

          {/* Forgot Password Button */}
          <Button
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
            style={styles.textButton}
            labelStyle={styles.textButtonLabel}
          >
            Forgot Password?
          </Button>

          {/* Register Button */}
          <Button
            onPress={() => navigation.navigate('RegisterByOTP')}
            style={styles.textButton}
            labelStyle={styles.textButtonLabel}
          >
            Don't have an account? Sign Up
          </Button>
        </Animated.View>
      </ScrollView>
      <Toast />
    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollView: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 16 },
  surface: { padding: 20, width: '90%', maxWidth: 380, alignItems: 'center', borderRadius: 16, backgroundColor: 'rgba(255, 255, 255, 0.95)', elevation: 4 },
  logoContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12, elevation: 2 },
  title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.primary, marginVertical: 2 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  input: { width: '100%', marginBottom: 12, backgroundColor: 'white' },
  button: { width: '100%', marginTop: 6, borderRadius: 25 },
  googleButton: { width: '100%', marginTop: 12, backgroundColor: 'white', borderColor: theme.colors.primary, borderRadius: 25 },
  facebookButton: { width: '100%', marginTop: 12, backgroundColor: 'white', borderColor: theme.colors.accent, borderRadius: 25 },
  buttonContent: { height: 44 },
  buttonLabel: { fontSize: 15, fontWeight: 'bold' },
  googleButtonLabel: { fontSize: 15, fontWeight: 'bold', color: theme.colors.primary },
  facebookButtonLabel: { fontSize: 15, fontWeight: 'bold', color: theme.colors.accent },
  textButton: { marginTop: 10 },
  textButtonLabel: { fontSize: 13, color: '#666' },
});

export default SignInScreen;
