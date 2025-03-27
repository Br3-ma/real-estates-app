import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform,
  Animated
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import { API_BASE_URL } from '../../confg/config';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleForgotPassword = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter your email address'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/signup/request-otp`, { email });
      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: 'Check your email for the verification code'
        });
        navigation.navigate('OTPVerification', { email });
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send OTP. Please try again.'
      });
      console.error('Forgot Password Error:', error);
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Animated.View 
            style={[
              styles.content, 
              { 
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons 
                name="lock-reset" 
                size={50} 
                color="#6C63FF" 
                style={styles.icon} 
              />
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.subtitle}>Enter your email to reset password</Text>
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

              <Button 
                mode="contained" 
                onPress={handleForgotPassword} 
                loading={loading}
                style={styles.resetButton}
                labelStyle={styles.resetButtonLabel}
              >
                Send Reset Link
              </Button>

              <TouchableOpacity 
                style={styles.backToLoginContainer}
                onPress={() => navigation.navigate('SignIn')}
              >
                <MaterialCommunityIcons 
                  name="arrow-left" 
                  size={18} 
                  color="#6C63FF" 
                />
                <Text style={styles.backToLoginText}>Back to Login</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.versionText}>version 13</Text>
          </Animated.View>
        </KeyboardAvoidingView>
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
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
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
  icon: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderRadius: 50,
    padding: 15,
    marginBottom: 10
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
    color: '#666',
    textAlign: 'center'
  },
  formContainer: {
    width: '100%'
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'white',
    fontFamily: 'Montserrat-Regular'
  },
  resetButton: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 5
  },
  resetButtonLabel: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16
  },
  backToLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15
  },
  backToLoginText: {
    fontFamily: 'Montserrat-Regular',
    color: '#6C63FF',
    fontSize: 14,
    marginLeft: 5
  },
  versionText: {
    marginTop: 15,
    fontFamily: 'Montserrat-Light',
    fontSize: 12,
    color: '#666'
  }
});

export default ForgotPasswordScreen;