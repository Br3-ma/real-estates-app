import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_BASE_URL } from '../../confg/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('window');

const OTPDigitInput = ({ value, isFocused, onFocus }) => (
  <TouchableOpacity
    style={[styles.digitContainer, isFocused && styles.digitContainerFocused]}
    onPress={onFocus}
  >
    <Text style={styles.digit}>{value || ''}</Text>
    {isFocused && !value && <View style={styles.cursor} />}
  </TouchableOpacity>
);

const OTPScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRef = useRef();
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(30);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
          // Set onboardingStatus to 'otp'
          await AsyncStorage.setItem('onboardingStatus', 'otp');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInput = (text) => {
    const newOtp = [...otp];
    const sanitizedText = text.replace(/[^0-9]/g, '');

    for (let i = 0; i < sanitizedText.length && i < 4; i++) {
      newOtp[i] = sanitizedText[i];
    }

    setOtp(newOtp);

    if (sanitizedText.length === 4) {
      verifyOTP(newOtp.join(''));
    }
  };

  const verifyOTP = async (code) => {
    try {
      const endpoint = `${API_BASE_URL}/signup/verify-otp`;
      const response = await axios.post(endpoint, { otp: code, email: userInfo.email });

      if (response.data.is_valid) {
        navigation.navigate('OverviewScreen');
      } else {
        handleOtpError();
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      handleOtpError();
    }
  };

  const handleOtpError = () => {
    setError(true);
    shakeInput();
    setOtp(['', '', '', '']);
    setFocusedIndex(0);
  };

  const shakeInput = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleResend = async () => {
    if (userInfo && userInfo.email) {
      try {
        const response = await axios.post(`${API_BASE_URL}/signup/request-otp`, {
          email: userInfo.email,
        });

        if (response.status === 200) {
          console.log('OTP resent successfully:', response.data.otp);
        }

        resetOtp();
      } catch (error) {
        console.error('Error resending OTP:', error);
        setError(true);
      }
    } else {
      console.error('User information or email not found');
    }
  };

  const resetOtp = () => {
    setTimer(30);
    setError(false);
    setOtp(['', '', '', '']);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="shield-check" size={50} color="#C850C0" />
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.subtitle}>
            Enter the 4-digit code sent to your email
          </Text>
        </View>

        <Animated.View
          style={[
            styles.otpContainer,
            { transform: [{ translateX: shakeAnimation }] }
          ]}
        >
          <TextInput
            ref={inputRef}
            value={otp.join('')}
            onChangeText={handleInput}
            maxLength={4}
            keyboardType="number-pad"
            style={styles.hiddenInput}
            autoFocus
          />

          <View style={styles.digitsContainer}>
            {otp.map((digit, index) => (
              <OTPDigitInput
                key={index}
                value={digit}
                isFocused={focusedIndex === index}
                onFocus={() => {
                  inputRef.current.focus();
                  setFocusedIndex(index);
                }}
              />
            ))}
          </View>

          {error && (
            <Text style={styles.errorText}>
              Invalid code. Please try again.
            </Text>
          )}
        </Animated.View>

        <View style={styles.bottomContainer}>
          <Text style={styles.timerText}>
            {timer > 0 ? (
              `Resend code in ${timer}s`
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendButton}>Resend Code</Text>
              </TouchableOpacity>
            )}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#F8F9FE',
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 24,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '80%',
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  digitsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    paddingHorizontal: 20,
  },
  digitContainer: {
    width: 68,
    height: 68,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  digitContainerFocused: {
    borderColor: '#4158D0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#4158D0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  digit: {
    fontSize: 28,
    color: '#1A1A1A',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cursor: {
    width: 2,
    height: 32,
    backgroundColor: '#4158D0',
    borderRadius: 1,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  errorText: {
    color: '#DC2626',
    marginTop: 24,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 'auto',
  },
  timerText: {
    color: '#666666',
    fontSize: 15,
    lineHeight: 22,
  },
  resendButton: {
    color: '#4158D0',
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

export default OTPScreen;
