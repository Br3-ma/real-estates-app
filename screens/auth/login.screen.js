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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

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
        text1: 'Sign In Error',
        text2: 'Please check your credentials and try again.',
      });
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
        Toast.show({
          type: 'success',
          text1: 'Google Sign-In Successful',
          text2: 'Welcome back!',
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
            <MaterialCommunityIcons name="home-outline" size={48} color={theme.colors.primary} />
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
            left={<TextInput.Icon icon="email" />}
          />
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

          <Button
            mode="outlined"
            onPress={handleGoogleSignIn}
            disabled={!request || loading}
            style={styles.googleButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.googleButtonLabel}
          >
            Sign In with Google
          </Button>

          <Button
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
            style={styles.textButton}
            labelStyle={styles.textButtonLabel}
          >
            Forgot Password?
          </Button>

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

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  surface: {
    padding: 20,
    width: '90%',
    maxWidth: 380,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 4,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginVertical: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 12,
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    marginTop: 6,
    borderRadius: 25,
  },
  googleButton: {
    width: '100%',
    marginTop: 12,
    backgroundColor: 'white',
    borderColor: theme.colors.primary,
    borderRadius: 25,
  },
  buttonContent: {
    height: 44,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  googleButtonLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  textButton: {
    marginTop: 12,
  },
  textButtonLabel: {
    fontSize: 13,
    color: theme.colors.primary,
  },
});

const Screen = ({ navigation }) => (
  <PaperProvider theme={theme}>
    <SignInScreen navigation={navigation} />
    <Toast />
  </PaperProvider>
);

export default Screen;
