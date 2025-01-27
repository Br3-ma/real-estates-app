import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Animated, View, Linking } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, TextInput, Button, Text, Title, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../confg/config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  const [googleRequest, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    clientId: '335360787471-f9vabut71lv9rcsp2qhcp8tmftohn2m6.apps.googleusercontent.com',
    redirectUri: 'myapp://auth',
    scopes: ['profile', 'email'],
  });
  
  // https://auth.expo.io/@br3mah/square
  const [facebookRequest, facebookResponse, promptFacebookAsync] = Facebook.useAuthRequest({
    clientId: '547040544348844',
  });

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      handleGoogleSignIn(authentication.accessToken);
    }
    if (facebookResponse?.type === 'success') {
      const { accessToken } = facebookResponse.authentication;
      handleFacebookSignIn(accessToken);
    }
  }, [googleResponse, facebookResponse]);

  const handleFacebookSignIn = async (accessToken) => {
    setLoading(true);
    try {
      const userData = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`);
      const response = await axios.post(`${API_BASE_URL}/facebook-signin`, {
        id: userData.data.id,
        name: userData.data.name,
        email: userData.data.email,
        picture: userData.data.picture.data.url
      });
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      Toast.show({ type: 'success', text1: 'Facebook Sign-In Successful', text2: `Welcome ${userData.data.name}!` });
      navigation.navigate('Main');
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Facebook Sign-In Error', text2: 'Unable to sign in with Facebook. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (accessToken) => {
    setLoading(true);
    try {
      const userData = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const response = await axios.post(`${API_BASE_URL}/google-signin`, userData.data);
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      Toast.show({ type: 'success', text1: 'Google Sign-In Successful', text2: `Welcome ${userData.data.name}!` });
      navigation.navigate('Main');
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Google Sign-In Error', text2: 'Unable to sign in with Google. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/signin`, { email, password });
      if (response.data.message === 'success') {
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
        Toast.show({ type: 'success', text1: 'Sign In Successful', text2: 'Welcome back!' });
        navigation.navigate('Main');
      } else {
        Toast.show({ type: 'error', text1: 'Sign In Failed', text2: response.data.message });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Oops!', text2: 'Your Password or Username is wrong' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#4158D0', '#C850C0', '#FFCC70']} style={styles.gradient}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Animated.View style={[styles.surface, { opacity: fadeAnim }]}>
            <Title style={styles.title}>Square</Title>
            <TextInput
              label="Email" value={email} onChangeText={setEmail} mode="outlined"
              style={styles.input} theme={{ colors: { primary: theme.colors.primary } }}
              left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="email" size={18} color={theme.colors.primary} />} />}
            />
            <TextInput
              label="Password" value={password} onChangeText={setPassword} secureTextEntry
              mode="outlined" style={styles.input} theme={{ colors: { primary: theme.colors.primary } }}
              left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="lock" size={18} color={theme.colors.primary} />} />}
            />
            <Button
              mode="contained" onPress={handleSignIn} loading={loading}
              style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}
            >
              Sign In
            </Button>
            {/* <Button
              mode="contained" onPress={() => promptGoogleAsync()} disabled={loading || !googleRequest}
              style={styles.googleButton} contentStyle={styles.socialButtonContent} labelStyle={styles.socialButtonLabel}
              icon={() => <MaterialCommunityIcons name="google" size={18} color="#FFF" />}
            >
              Sign in with Google
            </Button>
            <Button
              mode="contained" onPress={() => promptFacebookAsync()} disabled={loading || !facebookRequest}
              style={styles.facebookButton} contentStyle={styles.socialButtonContent} labelStyle={styles.socialButtonLabel}
              icon={() => <MaterialCommunityIcons name="facebook" size={18} color="#FFF" />}
            >
              Sign in with Facebook
            </Button> */}
            <Button onPress={() => navigation.navigate('ForgotPasswordScreen')} style={styles.textButton} labelStyle={styles.textButtonLabel}>
              Forgot Password?
            </Button>
            <Button onPress={() => navigation.navigate('RegisterByOTP')} style={styles.textButton} labelStyle={styles.textButtonLabel}>
              Don't have an account? Sign Up
            </Button>
            <Text onPress={() => Linking.openURL('https://square.twalitso.com/privacy-policy')} style={styles.privacyPolicyLink}>
              Privacy Policy
            </Text>
          </Animated.View>
        </ScrollView>
        <Toast />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  gradient: { flex: 1 },
  scrollView: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 12 },
  surface: { padding: 12, width: '85%', maxWidth: 320, alignItems: 'center', borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.95)', elevation: 3 },
  title: { fontSize: 20, fontWeight: '600', color: theme.colors.primary, marginVertical: 2 },
  input: { width: '100%', marginBottom: 8, backgroundColor: 'white', height: 42 },
  button: { width: '100%', marginTop: 4, borderRadius: 3 },
  buttonContent: { paddingVertical: 4 },
  buttonLabel: { fontSize: 13 },
  textButton: { marginTop: 6 },
  textButtonLabel: { fontSize: 11, color: theme.colors.primary },
  googleButton: { width: '100%', marginTop: 6, borderRadius: 3, backgroundColor: '#4285F4', borderWidth: 1, borderColor: '#4285F4' },
  facebookButton: { width: '100%', marginTop: 8, backgroundColor: '#4267B2' },
  socialButtonContent: { height: 40 },
  socialButtonLabel: { fontSize: 12, color: '#FFF' },
  privacyPolicyLink: { marginTop: 12, fontSize: 11, color: theme.colors.accent },
});

export default SignInScreen;


//only commented login with fb and google buttons