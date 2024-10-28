import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PaymentBottomSheet from './payments-modal';
import { fetchUserInfo } from '../controllers/auth/userController';

// Sample internal data for subscription plans
const subscriptionPlans = [
  {
    id: 1,
    name: 'free',
    title: 'Free',
    price: 'K0/month',
    features: ['Basic access', 'Limited posts', 'Ad-supported'],
  },
  {
    id: 2,
    name: 'special',
    title: 'Special',
    price: 'K9.99/month',
    features: ['Unlimited posts', 'No ads', 'Priority support'],
    isRecommended: true,
  },
  {
    id: 3,
    name: 'premium',
    title: 'Premium',
    price: 'K19.99/month',
    features: ['All Special features', 'Advanced analytics', 'Exclusive content'],
  },
];

const PlanCard = ({ plan, onSubscribe }) => {
  const { id, title, price, features, isRecommended } = plan;
  
  return (
    <View style={[styles.planCard, isRecommended && styles.recommendedPlan]}>
      {isRecommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>Recommended</Text>
        </View>
      )}
      <Text style={styles.planTitle}>{title}</Text>
      <Text style={styles.planPrice}>{price}</Text>
      {features && features.map((feature, index) => (
        <View key={index} style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={20} color="#60279C" />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}
      <TouchableOpacity 
        style={styles.subscribeButton} 
        onPress={() => onSubscribe(id)}
        accessibilityLabel={`Subscribe to ${title} plan`}
      >
        <Text style={styles.subscribeButtonText}>Subscribe</Text>
      </TouchableOpacity>
    </View>
  );
};

const ConfirmationModal = ({ visible, plan, onConfirm, onCancel }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onCancel}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Confirm Subscription</Text>
        <Text style={styles.modalText}>
          Are you sure you want to subscribe to the {plan?.title} plan for {plan?.price}?
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={onConfirm}>
            <Text style={styles.modalButtonText}>Continue to Payments</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const SubscriptionPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPaymentSheetVisible, setIsPaymentSheetVisible] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await fetchUserInfo();
        setUser(userInfo);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    getUserInfo();
}, []); // No need to log `user` immediately here


  const handleSubscribe = (planId) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    setSelectedPlan(plan);
    setIsModalVisible(true);
  };

  const handleConfirmSubscription = () => {
    console.log(`Subscribed to ${selectedPlan.title}`);
    // Here you would typically handle the actual subscription process
    console.log(selectedPlan);
    console.log('-------User Me--------');
    console.log('---------------');
    console.log(user);

    setIsModalVisible(false);
    setSelectedPlan(null);
    setIsPaymentSheetVisible(true);
  };

  return (
    <View style={styles.subscriptionSection}>
      <Text style={styles.sectionTitle}>Upgrade Your Experience</Text>
      {/* <SubscriptionIllustration /> */}
      <Text style={styles.sectionDescription}>
        Choose a plan that suits your needs and unlock amazing features!
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.plansScrollView}
        contentContainerStyle={styles.plansContainer}
      >
        {subscriptionPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSubscribe={handleSubscribe} />
        ))}
      </ScrollView>
      <ConfirmationModal 
        visible={isModalVisible}
        plan={selectedPlan}
        onConfirm={handleConfirmSubscription}
        onCancel={() => setIsModalVisible(false)}
      />

      {/* Bottom sheet for payment form */}
      <PaymentBottomSheet 
        isVisible={isPaymentSheetVisible} 
        onClose={() => setIsPaymentSheetVisible(false)} 
        payFor='subscription'
        planID={22}
        userID={user ? user.id : null}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  subscriptionSection: {
    padding: 20,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  plansScrollView: {
    marginBottom: 20,
  },
  plansContainer: {
    paddingHorizontal: 10,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 10,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  recommendedPlan: {
    borderColor: '#60279C',
    borderWidth: 2,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: '#60279C',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  recommendedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 24,
    color: '#60279C',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  subscribeButton: {
    backgroundColor: '#60279C',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  illustration: {
    height: 150,
    width: 150,
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  confirmButton: {
    backgroundColor: '#9c2de8',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  illustration: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default SubscriptionPlan;