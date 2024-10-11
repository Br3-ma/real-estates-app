import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView, Image,
  TouchableOpacity, Modal, Dimensions, RefreshControl, Animated
} from 'react-native';
import { Icon } from 'react-native-elements';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchUserInfo } from '../../../controllers/auth/userController';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { API_BASE_URL } from '../../../confg/config';
import NotificationPreviewModal from '../../../components/notification-preview-modal';

const NotificationScreen = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [showClearWarning, setShowClearWarning] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const user = await fetchUserInfo();
      const response = await fetch(`${API_BASE_URL}/notify/${user.user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }, [fetchNotifications]);

  const openNotificationPreview = useCallback((notification) => {
    setSelectedNotification(notification);
  }, []);

  const closeNotificationPreview = useCallback(() => {
    setSelectedNotification(null);
  }, []);
  const clearAllNotifications = useCallback(() => {
    setShowClearWarning(true);
  }, []);

  const confirmClearNotifications = useCallback(() => {
    setNotifications([]);
    setShowClearWarning(false);
  }, []);

  const cancelClearNotifications = useCallback(() => {
    setShowClearWarning(false);
  }, []);
  const getHumanReadableDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.round(diffTime / (1000 * 60));
    const diffHours = Math.round(diffTime / (1000 * 60 * 60));
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
  }, []);

  const renderNotification = useCallback(
    ({ item: notification, index }) => (
      <Animated.View
        style={[
          styles.notificationItem,
          {
            opacity: scrollY.interpolate({
              inputRange: [-1, 0, (index * 100)],
              outputRange: [1, 1, 0],
            }),
            transform: [{
              translateY: scrollY.interpolate({
                inputRange: [-1, 0, (index * 100)],
                outputRange: [0, 0, 50],
              }),
            }],
          },
        ]}
      >
        <TouchableOpacity onPress={() => openNotificationPreview(notification)}>
          <LinearGradient
            colors={['#ffffff', '#f8f8f8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.notificationContent}
          >
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>{notification.data['title']}</Text>
              <Text style={styles.notificationDate}>{getHumanReadableDate(notification.created_at)}</Text>
            </View>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.notificationMessage}>
              {notification.data['message']}
            </Text>
            <Icon name="chevron-right" type="material-community" color="#bbb" size={20} style={styles.chevronIcon} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    ),
    [getHumanReadableDate, openNotificationPreview, scrollY]
  );

  const renderShimmer = useCallback(() => (
    <View style={styles.shimmerContainer}>
      {[1, 2, 3].map((index) => (
        <ShimmerPlaceholder
          key={index}
          style={styles.shimmerItem}
          LinearGradient={LinearGradient}
        />
      ))}
    </View>
  ), []);

  const ListEmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Image source={require('../../../assets/icon/notify.png')} style={styles.emptyImage} />
      <Text style={styles.emptyText}>No notifications yet</Text>
      <Text style={styles.emptySubText}>We'll notify you when something new arrives!</Text>
    </View>
  ), []);

  const WarningPopup = useCallback(() => (
    <Modal visible={showClearWarning} transparent animationType="fade">
      <BlurView intensity={80} style={styles.modalContainer}>
        <View style={styles.warningContainer}>
          <Icon name="warning" type="material" size={48} color="#FFA500" style={styles.warningIcon} />
          <Text style={styles.warningTitle}>Clear All Notifications</Text>
          <Text style={styles.warningMessage}>Are you sure you want to clear all notifications? This action cannot be undone.</Text>
          <View style={styles.warningButtons}>
            <TouchableOpacity style={[styles.warningButton, styles.cancelButton]} onPress={cancelClearNotifications}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.warningButton, styles.confirmButton]} onPress={confirmClearNotifications}>
              <Text style={styles.buttonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  ), [showClearWarning, cancelClearNotifications, confirmClearNotifications]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <LinearGradient colors={['#8E2DE2', '#8E2DE2']} style={styles.headerGradient}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity onPress={clearAllNotifications} style={styles.clearButton}>
            <Icon name="delete-sweep" type="material" color="#fff" size={24} />
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
      <View style={styles.container}>
        {loading ? (
          renderShimmer()
        ) : (
          <Animated.FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#4a90e2']}
                tintColor="#4a90e2"
              />
            }
            ListEmptyComponent={ListEmptyComponent}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
          />
        )}

        <NotificationPreviewModal
          visible={!!selectedNotification}
          notification={selectedNotification}
          onClose={closeNotificationPreview}
          getHumanReadableDate={getHumanReadableDate}
        />
      </View>
      
      <WarningPopup />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    marginTop: 70,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  notificationItem: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationContent: {
    padding: 16,
    borderRadius: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  notificationDate: {
    fontSize: 12,
    color: '#888',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    marginRight: 24,
  },
  chevronIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
  shimmerContainer: {
    padding: 16,
  },
  shimmerItem: {
    height: 80,
    width: '100%',
    marginBottom: 16,
    borderRadius: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: Dimensions.get('window').width - 48,
    maxHeight: Dimensions.get('window').height - 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  fullScreenImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  previewDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  previewMessage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    lineHeight: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: Dimensions.get('window').width - 48,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  warningIcon: {
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  warningMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  warningButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  warningButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default React.memo(NotificationScreen);