import React, { useState } from 'react';
import { ImageBackground, StyleSheet, ScrollView } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, TextInput, Button, Text, Title, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../confg/config';

WebBrowser.maybeCompleteAuthSession();
const backgroundImage = require('../../assets/img/sweet.gif');

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#8E2DE2',
    accent: '#03dac4',
    background: 'transparent',
  },
};

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

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
    <ImageBackground source={backgroundImage} style={styles.background}>
      <LinearGradient colors={['rgba(0,0,0,0.7)', '#fff']} style={styles.gradient}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Surface style={styles.surface}>
            <Title style={styles.title}>SQuare</Title>
            <Text style={styles.subtitle}>Houses for rent and sale</Text>
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { primary: theme.colors.accent } }}
              dense
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
              style={styles.input}
              theme={{ colors: { primary: theme.colors.accent } }}
              dense
            />
            
            <Button mode="contained" onPress={handleSignIn} loading={loading} style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}>
              Sign In
            </Button>
            
            <Button mode="outlined" onPress={handleGoogleSignIn} disabled={!request || loading} style={styles.googleButton} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}>
              Sign In with Google
            </Button>
            
            <Button onPress={() => navigation.navigate('ForgotPasswordScreen')} style={styles.textButton} labelStyle={styles.textButtonLabel}>
              Forgot Password?
            </Button>
            
            <Button onPress={() => navigation.navigate('RegisterByOTP')} style={styles.textButton} labelStyle={styles.textButtonLabel}>
              Don't have an account? Sign Up
            </Button>
          </Surface>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
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
    paddingVertical: 5,
  },
  surface: {
    padding: 10,
    width: '92%',
    maxWidth: 400,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginVertical:4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius:25,
    height: 40,
  },
  button: {
    width: '100%',
    marginTop: 8,
  },
  googleButton: {
    width: '100%',
    marginTop: 8,
    backgroundColor: '#fff',
  },
  buttonContent: {
    height: 36,
  },
  buttonLabel: {
    fontSize: 14,
  },
  textButton: {
    marginTop: 8,
  },
  textButtonLabel: {
    fontSize: 12,
  },
});

const Screen = ({ navigation }) => (
  <PaperProvider theme={theme}>
    <SignInScreen navigation={navigation} />
  </PaperProvider>
);

export default Screen;