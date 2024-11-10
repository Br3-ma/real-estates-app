import axios from 'axios';
import React, { useState } from 'react';
import { View, ActivityIndicator, Button } from 'react-native';
import Toast from 'react-native-toast-message';

const generateUUID = () => {
  return 'xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const handlePaymentSubmit = async ({
  paymentMethod,
  mobileNetwork,
  mobilePhone,
  amount,
  payingFor,
  boostInfo,
  postID,
  planID,
  userID,
  setIsLoading,
}) => {
  setIsLoading(true);

  try {
    const requestBody = {
      amount,
      correspondent: mobileNetwork,
      phone: '26' + mobilePhone,
      plan_id: planID,
      user_id: userID,
      post_id: postID,
      payingFor: payingFor,
      boost: boostInfo?.id,
    };

    // Notify user of the payment submission
    Toast.show({
      type: 'info',
      text1: 'Submitting payment',
      text2: JSON.stringify(requestBody),
    });

    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      // "Authorization": "Bearer YOUR_LARAVEL_API_TOKEN",
    };

    // Send request to Laravel endpoint
    const response = await axios.post("https://square.twalitso.com/api/v1/submit-mobile-payment", requestBody, { headers });

    Toast.show({
      type: 'success',
      text1: 'Payment submitted successfully',
      text2: JSON.stringify(response.data),
    });
  } catch (error) {
    console.error(error);
    Toast.show({
      type: 'error',
      text1: 'Error submitting payment',
      text2: error.response?.data?.message || error.message,
    });
  } finally {
    setIsLoading(false);
  }
};

const LoadingIndicator = ({ isLoading }) => (
  <View>
    {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
  </View>
);

const PaymentComponent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    handlePaymentSubmit({
      paymentMethod: 'mobile',
      mobileNetwork: 'AIRTEL_OAPI_ZMB',
      mobilePhone: '260772147755',
      amount: 15,
      payingFor: 'subscription',
      boostInfo: '',
      postID: 'POST_ID',
      planID: 2,
      userID: 1,
      setIsLoading,
    });
  };

  return (
    <View>
      <LoadingIndicator isLoading={isLoading} />
      <Button title="Submit Payment" onPress={handleSubmit} disabled={isLoading} />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

export default PaymentComponent;
