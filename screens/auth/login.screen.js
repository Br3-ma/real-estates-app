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
import { useFonts } from 'expo-font'; 

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
  const [fontsLoaded] = useFonts({
    'Montserrat': require('../../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Thin': require('../../assets/fonts/Montserrat-Thin.ttf'),
    'Montserrat-Light': require('../../assets/fonts/Montserrat-Light.ttf'),
    'Montserrat-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Bold-x2': require('../../assets/fonts/Montserrat-ExtraBold.ttf'),
    'Montserrat-Italic': require('../../assets/fonts/Montserrat-Italic.ttf'),
  });

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
  }, [fadeAnim, fontsLoaded]);

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
  title: { fontFamily:'Montserrat-Bold-x2',fontSize: 20, fontWeight: '600', color: theme.colors.primary, marginVertical: 2 },
  input: { width: '100%', marginBottom: 8, backgroundColor: 'white', height: 42, fontFamily:'Montserrat-Light' },
  button: { fontFamily:'Montserrat', width: '100%', marginTop: 4, borderRadius: 3 },
  buttonContent: { paddingVertical: 4 },
  buttonLabel: { fontSize: 13 },
  textButton: { marginTop: 6 },
  textButtonLabel: { fontSize: 11, color: theme.colors.primary },
  googleButton: { width: '100%', marginTop: 6, borderRadius: 3, backgroundColor: '#4285F4', borderWidth: 1, borderColor: '#4285F4' },
  facebookButton: { width: '100%', marginTop: 8, backgroundColor: '#4267B2' },
  socialButtonContent: { height: 40 },
  socialButtonLabel: { fontSize: 12, color: '#FFF' },
  privacyPolicyLink: { marginTop: 12, fontSize: 11, color: theme.colors.accent, fontFamily:'Montserrat' },
});

export default SignInScreen;
