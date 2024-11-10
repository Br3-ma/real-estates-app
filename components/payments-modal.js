import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { handlePaymentSubmit } from '../controllers/payments/__initiateDeposit';

// Loading dots animation remains the same
const LoadingDots = () => {
  const [dot1Anim] = useState(new Animated.Value(0));
  const [dot2Anim] = useState(new Animated.Value(0));
  const [dot3Anim] = useState(new Animated.Value(0));

  const animateDots = (animation, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1, delay }
    ).start();
  };

  useEffect(() => {
    animateDots(dot1Anim, 0);
    animateDots(dot2Anim, 150);
    animateDots(dot3Anim, 300);
  }, []);

  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={[styles.dot, { opacity: dot1Anim }]} />
      <Animated.View style={[styles.dot, { opacity: dot2Anim }]} />
      <Animated.View style={[styles.dot, { opacity: dot3Anim }]} />
    </View>
  );
};


const PaymentBottomSheet = ({ isVisible, onClose, amount, payFor, boostData = null, postID = null, planID = null, userID = null }) => {
  const [paymentMethod, setPaymentMethod] = useState('mobile');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [mobileName, setMobileName] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [mobileNetwork, setMobileNetwork] = useState('MTN_MOMO_ZMB');
  const [phoneError, setPhoneError] = useState('');
  const payingFor = payFor;
  const boostInfo = boostData;
  const [isLoading, setIsLoading] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const onSubmit = () => {    
    if (!validatePhoneNumber(mobilePhone)) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return;
    }

    handlePaymentSubmit({
      paymentMethod,
      cardNumber,
      expiryDate,
      cvv,
      mobileNetwork,
      mobilePhone,
      amount,
      payingFor,
      boostInfo,
      postID,
      planID,
      userID,
      setIsLoading,
    });
  };

  const animateSlide = (toValue) => {
    Animated.timing(slideAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const validatePhoneNumber = (phone) => {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Update state with only digits
    setMobilePhone(cleanPhone);
    
    // Validate length
    if (cleanPhone.length === 0) {
      setPhoneError('');
    } else if (cleanPhone.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits');
    } else {
      setPhoneError('');
    }
    
    return cleanPhone.length === 10;
  };

  return (
    <Modal
      isVisible={isVisible}
      style={styles.modal}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      onShow={() => animateSlide(1)}
      onModalHide={() => animateSlide(0)}
    >
      <Animated.View style={[styles.container, { transform: [{ translateY: slideAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
      }) }] }]}>
        <View style={styles.handle} />
        <Text style={styles.title}>Payment Information</Text>

        <View style={styles.toggleContainer}>
          {/* <TouchableOpacity
            style={[styles.toggleButton, paymentMethod === 'card' && styles.activeButton]}
            onPress={() => setPaymentMethod('card')}
          >
            <Icon name="credit-card" size={24} color={paymentMethod === 'card' ? '#fff' : '#333'} />
            <Text style={paymentMethod === 'card' ? styles.activeButtonText : styles.buttonText}>Card</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[styles.toggleButton, paymentMethod === 'mobile' && styles.activeButton]}
            onPress={() => setPaymentMethod('mobile')}
          >
            <Icon name="cellphone" size={24} color={paymentMethod === 'mobile' ? '#fff' : '#333'} />
            <Text style={paymentMethod === 'mobile' ? styles.activeButtonText : styles.buttonText}>Mobile</Text>
          </TouchableOpacity>
        </View>

        {paymentMethod === 'card' && (
          <Animated.View style={{ opacity: slideAnimation }}>
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
              importantForAccessibility="yes"
              textContentType="creditCardNumber"
            />
            <TextInput
              style={styles.input}
              placeholder="Expiry Date (MM/YY)"
              value={expiryDate}
              onChangeText={setExpiryDate}
              textContentType="none"
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              keyboardType="numeric"
              secureTextEntry
              value={cvv}
              onChangeText={setCvv}
            />
          </Animated.View>
        )}

        {paymentMethod === 'mobile' && (
          <Animated.View style={{ opacity: slideAnimation }}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={mobileName}
              onChangeText={setMobileName}
              textContentType="name"
            />
            <View>
              <TextInput
                style={[styles.input, phoneError ? styles.inputError : null]}
                placeholder="000-000-0000"
                keyboardType="phone-pad"
                value={mobilePhone}
                onChangeText={(text) => validatePhoneNumber(text)}
                textContentType="telephoneNumber"
                maxLength={10}
              />
              {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
            </View>
            <View style={styles.pickerContainer}>
              {Platform.OS === 'web' ? (
                <select
                  value={mobileNetwork}
                  onChange={(e) => setMobileNetwork(e.target.value)}
                  style={styles.picker}
                >
                  <option value="AIRTEL_OAPI_ZMB">Airtel Money</option>
                  <option value="MTN_MOMO_ZMB">MTN Money</option>
                  <option value="ZAMTEL_ZMB">Zamtel Money</option>
                </select>
              ) : (
                <Picker
                  selectedValue={mobileNetwork}
                  onValueChange={(itemValue) => setMobileNetwork(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Airtel" value="AIRTEL_OAPI_ZMB" />
                  <Picker.Item label="MTN" value="MTN_MOMO_ZMB" />
                  <Picker.Item label="Zamtel" value="ZAMTEL_ZMB" />
                </Picker>
              )}
            </View>
          </Animated.View>
        )}

        <TouchableOpacity 
          style={[styles.submitButton, phoneError ? styles.submitButtonDisabled : null]} 
          onPress={onSubmit} 
          disabled={isLoading || !!phoneError}
        >
          {isLoading ? <LoadingDots /> : <Text style={styles.submitButtonText}>Submit Payment</Text>}
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },  
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#60279C',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  activeButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#4a4e69',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#8a8a8a',
  },
});

export default PaymentBottomSheet;
