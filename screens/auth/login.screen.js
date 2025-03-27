import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  Animated, 
  View, 
  Linking, 
  Dimensions,
  TouchableOpacity,
  Platform 
} from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../confg/config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font'; 

const { width, height } = Dimensions.get('window');

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Fonts
  const [fontsLoaded] = useFonts({
    'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Light': require('../../assets/fonts/Montserrat-Light.ttf'),
  });

  // Animate entrance
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/signin`, { email, password });
      if (response.data.message === 'success') {
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
        Toast.show({ 
          type: 'success', 
          text1: 'Welcome Back', 
          text2: 'You are now connected' 
        });
        navigation.navigate('Main');
      } else {
        Toast.show({ 
          type: 'error', 
          text1: 'Connection Failed', 
          text2: response.data.message 
        });
      }
    } catch (error) {
      Toast.show({ 
        type: 'error', 
        text1: 'Oops!', 
        text2: 'Check your credentials' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient 
        colors={['#4158D0', '#C850C0', '#FFCC70']} 
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar style="light" />
        <ScrollView 
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.container, 
              { 
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <Title style={styles.title}>Square</Title>
              <Text style={styles.subtitle}>Connect to your community</Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                theme={{ 
                  colors: { 
                    primary: '#6C63FF',
                    background: 'white'
                  } 
                }}
                left={
                  <TextInput.Icon 
                    icon={() => (
                      <MaterialCommunityIcons 
                        name="email-outline" 
                        size={20} 
                        color="#6C63FF" 
                      />
                    )} 
                  />
                }
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureTextEntry}
                mode="outlined"
                style={styles.input}
                theme={{ 
                  colors: { 
                    primary: '#6C63FF',
                    background: 'white'
                  } 
                }}
                left={
                  <TextInput.Icon 
                    icon={() => (
                      <MaterialCommunityIcons 
                        name="lock-outline" 
                        size={20} 
                        color="#6C63FF" 
                      />
                    )} 
                  />
                }
                right={
                  <TextInput.Icon 
                    icon={() => (
                      <MaterialCommunityIcons 
                        name={secureTextEntry ? "eye-off" : "eye"} 
                        size={20} 
                        color="#6C63FF" 
                      />
                    )}
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                  />
                }
              />

              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={() => navigation.navigate('ForgotPasswordScreen')}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button 
                mode="contained" 
                onPress={handleSignIn} 
                loading={loading}
                style={styles.signInButton}
                labelStyle={styles.signInButtonLabel}
              >
                Sign In
              </Button>

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Do not have an account? </Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('RegisterByOTP')}
                >
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => Linking.openURL('https://square.twalitso.com/privacy-policy')}
            >
              <Text style={styles.privacyLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
        <Toast />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1 
  },
  gradient: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollView: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: width 
  },
  container: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    })
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 25
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: '#6C63FF',
    marginBottom: 5
  },
  subtitle: {
    fontFamily: 'Montserrat-Light',
    fontSize: 14,
    color: '#666'
  },
  formContainer: {
    width: '100%'
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
    fontFamily: 'Montserrat-Regular'
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 15
  },
  forgotPasswordText: {
    fontFamily: 'Montserrat-Regular',
    color: '#6C63FF',
    fontSize: 12
  },
  signInButton: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 5
  },
  signInButtonLabel: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15
  },
  signUpText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12
  },
  signUpLink: {
    fontFamily: 'Montserrat-Bold',
    color: '#6C63FF',
    fontSize: 12
  },
  privacyLink: {
    marginTop: 20,
    fontFamily: 'Montserrat-Light',
    color: '#666',
    fontSize: 11
  }
});

export default SignInScreen;