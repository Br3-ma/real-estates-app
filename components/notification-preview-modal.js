import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

const NotificationPreviewModal = ({ visible, notification, onClose, getHumanReadableDate, onImagePress, onActionPress }) => {
  const getNotificationStyle = (type) => {
    switch (type) {
      case 'welcome':
        return { gradientColors: ['#4158D0', '#C850C0'], icon: 'hand-wave', illustratorImage: 'https://example.com/welcome.svg' };
      case 'comment':
        return { gradientColors: ['#FF512F', '#DD2476'], icon: 'tag', illustratorImage: 'https://example.com/promotion.svg' };
      case 'post':
        return { gradientColors: ['#11998e', '#38ef7d'], icon: 'bell', illustratorImage: 'https://example.com/reminder.svg' };
      case 'onboarding':
        return { gradientColors: ['#FF512F', '#FF512F'], icon: 'alert-circle', illustratorImage: 'https://media.istockphoto.com/id/1425222394/vector/search-for-houses-online.jpg?s=612x612&w=0&k=20&c=z4aJ0iE6PEJhT3K_sREHP-tmV2sxBHdzqHkHjoVMB2k=' };
      default:
        return { gradientColors: ['#8E2DE2', '#4A00E0'], icon: 'information', illustratorImage: 'https://example.com/default.svg' };
    }
  };

  const { gradientColors, icon, illustratorImage } = getNotificationStyle(notification?.data?.type);

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <BlurView intensity={80} style={styles.modalContainer}>
        <LinearGradient colors={gradientColors} style={styles.previewContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Icon name={icon} type="material-community" color="#fff" size={40} containerStyle={styles.typeIcon} />
            
            {notification?.data?.type && (
              <Image 
                source={{ uri: illustratorImage }} 
                style={styles.notificationImage} 
                onPress={onImagePress}
              />
            )}

            <Text style={styles.previewTitle}>{notification?.data?.title}</Text>
            <Text style={styles.previewDate}>{getHumanReadableDate(notification?.created_at)}</Text>

            <Text style={styles.previewMessage}>{notification?.data?.message}</Text>

            {notification?.data?.type === 'promotion' && (
              <View style={styles.promoContainer}>
                <Text style={styles.promoCode}>Use code: {notification?.data?.promo_code}</Text>
                <Text style={styles.promoExpiry}>Expires: {notification?.data?.expiry_date}</Text>
              </View>
            )}

            {notification?.data?.type === 'reminder' && (
              <View style={styles.reminderContainer}>
                <Text style={styles.reminderDetails}>Due: {notification?.data?.due_date}</Text>
                <Text style={styles.reminderPriority}>Priority: {notification?.data?.priority}</Text>
              </View>
            )}

            {notification?.data?.type && notification?.data?.action && (
              <TouchableOpacity 
                style={[styles.actionButton, getActionButtonStyle(notification?.data?.type)]} 
                onPress={() => onActionPress(notification?.data?.action)}
              >
                <Text style={styles.actionButtonText}>{notification?.data?.action?.title || 'Take Action'}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" type="material-community" color="#fff" size={24} />
          </TouchableOpacity>
        </LinearGradient>
      </BlurView>
    </Modal>
  );
};

const getActionButtonStyle = (type) => {
  switch (type) {
    case 'welcome':
      return { backgroundColor: 'rgba(255, 255, 255, 0.4)' };
    case 'promotion':
      return { backgroundColor: 'rgba(255, 255, 255, 0.3)' };
    case 'reminder':
      return { backgroundColor: 'rgba(0, 0, 0, 0.2)' };
    case 'alert':
      return { backgroundColor: 'rgba(255, 255, 255, 0.2)' };
    default:
      return { backgroundColor: 'rgba(255, 255, 255, 0.3)' };
  }
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    borderRadius: 20,
    width: width - 40,
    maxHeight: height - 80,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 24,
  },
  typeIcon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  notificationImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
    textAlign: 'center',
  },
  previewDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    textAlign: 'center',
  },
  previewMessage: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    lineHeight: 24,
  },
  promoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  promoCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  promoExpiry: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  reminderContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reminderDetails: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  reminderPriority: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actionButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 8,
  },
});

export default NotificationPreviewModal;