import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Animated } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, TextInput, Button, Text, Title, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../confg/config';
import { Ionicons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

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

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);


  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/signin`, { email, password });
      // console.log(response);
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      navigation.navigate('Main');
    } catch (error) {
      console.error('Sign In Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await promptAsync();
    if (result.type === 'success') {
      const { id_token } = result.params;
      try {
        const response = await axios.post(`${API_BASE_URL}/google-signin`, { id_token });
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
        navigation.navigate('Main');
      } catch (error) {
        console.error('Google Sign-In Error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#4158D0', '#C850C0', '#FFCC70']} style={styles.gradient}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Animated.View style={[styles.surface, { opacity: fadeAnim }]}>
          <Surface style={styles.logoContainer}>
            <Ionicons name="home-outline" size={64} color={theme.colors.primary} />
          </Surface>
          <Title style={styles.title}>SQuare</Title>
          <Text style={styles.subtitle}>Houses for rent and sale</Text>
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: theme.colors.primary } }}
            left={<TextInput.Icon name="email" color={theme.colors.primary} />}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: theme.colors.primary } }}
            left={<TextInput.Icon name="lock" color={theme.colors.primary} />}
          />
          
          <Button mode="contained" onPress={handleSignIn} loading={loading} style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}>
            Sign In
          </Button>
          
          <Button mode="outlined" onPress={handleGoogleSignIn} disabled={!request || loading} style={styles.googleButton} contentStyle={styles.buttonContent} labelStyle={styles.googleButtonLabel}>
            Sign In with Google
          </Button>
          
          <Button onPress={() => navigation.navigate('ForgotPasswordScreen')} style={styles.textButton} labelStyle={styles.textButtonLabel}>
            Forgot Password?
          </Button>
          
          <Button onPress={() => navigation.navigate('RegisterByOTP')} style={styles.textButton} labelStyle={styles.textButtonLabel}>
            Don't have an account? Sign Up
          </Button>
        </Animated.View>
      </ScrollView>
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
    paddingVertical: 20,
  },
  surface: {
    padding: 24,
    width: '92%',
    maxWidth: 400,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    elevation: 4,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginVertical: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    marginTop: 8,
    borderRadius: 25,
  },
  googleButton: {
    width: '100%',
    marginTop: 16,
    backgroundColor: 'white',
    borderColor: theme.colors.primary,
    borderRadius: 25,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  textButton: {
    marginTop: 16,
  },
  textButtonLabel: {
    fontSize: 14,
    color: theme.colors.primary,
  },
});

const Screen = ({ navigation }) => (
  <PaperProvider theme={theme}>
    <SignInScreen navigation={navigation} />
  </PaperProvider>
);

export default Screen;