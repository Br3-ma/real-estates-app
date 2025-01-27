import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { ToastProvider, useToast } from 'react-native-toast-notifications';
import { API_BASE_URL } from '../../confg/config';

const { width } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleForgotPassword = async () => {
    if (!email) {
      toast.show('Please enter your email address', {
        type: 'warning',
        placement: 'top',
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/signup/request-otp`, { email });
      if (response.status === 200) {
        toast.show('OTP sent to your email. Please check your inbox.', {
          type: 'success',
          placement: 'top',
          duration: 4000,
        });
        navigation.navigate('OTPVerification', { email });
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      toast.show('Failed to send OTP. Please try again.', {
        type: 'danger',
        placement: 'top',
        duration: 4000,
      });
      console.error('Forgot Password Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#ffff', '#02206f']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.header}>
          <Feather name="lock" size={30} color="#FFF" style={styles.icon} />
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your email to reset</Text>
        </View>
        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color="#02206f" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#02206f"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleForgotPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Feather name="arrow-left" size={18} color="#FFF" />
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>version. 13</Text>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
    maxWidth: 250,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    marginBottom: 20,
    width: width * 0.85,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#FFF',
  },
  button: {
    backgroundColor: '#02206f',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 30,
    width: width * 0.85,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  footerText: {
    fontSize: 12,
    color: '#bfcfd9',
    textAlign: 'center',
    fontWeight: '500',
  },
});

const Screen = ({ navigation }) => (
  <ToastProvider>
    <ForgotPasswordScreen navigation={navigation} />
  </ToastProvider>
);

export default Screen;
