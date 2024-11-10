import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { ToastProvider, useToast } from 'react-native-toast-notifications';
import { API_BASE_URL } from '../../confg/config';
import { LinearGradient } from 'expo-linear-gradient';

const OTPInput = ({ value, setValue }) => {
  const inputRefs = useRef([]);
  const LENGTH = 4; // Length of OTP

  const handleChange = (text, index) => {
    const newOTP = value.split('');
    newOTP[index] = text;
    setValue(newOTP.join(''));
    
    if (text && index < LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {[...Array(LENGTH)].map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={styles.otpInput}
          maxLength={1}
          keyboardType="number-pad"
          value={value[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
              inputRefs.current[index - 1].focus();
            }
          }}
        />
      ))}
    </View>
  );
};

const OTPVerificationScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) {
      toast.show('Please enter a valid 4-digit OTP', {
        type: 'warning',
        placement: 'top',
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/signup/verify-otp`, { email, otp });
      
      if(response.data.is_valid) {
        toast.show('OTP verified successfully!', {
          type: 'success',
          placement: 'top',
          duration: 3000,
        });
        navigation.navigate('ChangePasswordScreen', { email });
      } else {
        toast.show('Invalid OTP code', {
          type: 'danger',
          placement: 'top',
          duration: 3000,
        });
      }
    } catch (error) {
      toast.show('Verification failed. Please try again.', {
        type: 'danger',
        placement: 'top',
        duration: 3000,
      });
      console.error('Verify OTP Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#f8f9fa', '#e9ecef']}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.card}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the verification code sent to{'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>
          
          <OTPInput value={otp} setValue={setOtp} />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerifyOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
          >
            <Text style={styles.backText}>Back to Forgot Password</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#6b46c1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4a5568',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  emailText: {
    color: '#6b46c1',
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 55,
    height: 55,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#f7fafc',
    color: '#4a5568',
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#6b46c1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6b46c1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#9f7aea',
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backText: {
    color: '#6b46c1',
    fontSize: 16,
    fontWeight: '500',
  },
});

const Screen = ({ route, navigation }) => (
  <ToastProvider>
    <OTPVerificationScreen navigation={navigation} route={route} />
  </ToastProvider>
);

export default Screen;