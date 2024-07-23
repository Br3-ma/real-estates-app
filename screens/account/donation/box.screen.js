import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Image, TouchableOpacity, Modal, Dimensions, RefreshControl } from 'react-native';
import { Icon } from 'react-native-elements';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { API_BASE_URL } from '../../../confg/config';

const NotificationScreen = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const userId = 1;
      const response = await fetch(`${API_BASE_URL}/notify/${userId}`);
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

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const openNotificationPreview = useCallback((notification) => {
    setSelectedNotification(notification);
  }, []);

  const closeNotificationPreview = useCallback(() => {
    setSelectedNotification(null);
  }, []);

  const getHumanReadableDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  }, []);

  const renderNotification = useCallback(
    ({ item: notification }) => (
      <TouchableOpacity onPress={() => openNotificationPreview(notification)}>
        <LinearGradient
          colors={['#ffffff', '#f0f0f0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.notificationItem}
        >
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>{notification.data['title']}</Text>
            <Text style={styles.notificationDate}>{getHumanReadableDate(notification.created_at)}</Text>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.notificationMessage}>
              {notification.data['message']}
            </Text>
          </View>
          <Icon name="chevron-right" type="material-community" color="#bbb" size={20} />
        </LinearGradient>
      </TouchableOpacity>
    ),
    [getHumanReadableDate, openNotificationPreview]
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
      <Text style={styles.emptyText}>No notifications available</Text>
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#F5F4F6', '#F9EDFB']} style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={clearAllNotifications} style={styles.clearButton}>
          <Icon name="delete-sweep" type="material" color="#fff" size={24} />
        </TouchableOpacity>
      </LinearGradient>
      <View style={styles.container}>
        {loading ? (
          renderShimmer()
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3D6DCC']} />}
            ListEmptyComponent={ListEmptyComponent}
          />
        )}
        {selectedNotification && (
          <Modal visible={true} transparent={true} animationType="fade">
            <BlurView intensity={80} style={styles.modalContainer}>
              <View style={styles.previewContainer}>
                <Image source={{ uri: selectedNotification.data['image'] }} style={styles.fullScreenImage} />
                <Text style={styles.previewTitle}>{selectedNotification.data['title']}</Text>
                <Text style={styles.previewDate}>{getHumanReadableDate(selectedNotification.created_at)}</Text>
                <Text style={styles.previewMessage}>{selectedNotification.data['message']}</Text>
                <TouchableOpacity onPress={closeNotificationPreview} style={styles.closeButton}>
                  <Icon name="close" type="material-community" color="#fff" size={24} />
                </TouchableOpacity>
              </View>
            </BlurView>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
  },
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  notificationDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
  },
  shimmerContainer: {
    padding: 16,
  },
  shimmerItem: {
    height: 100,
    marginBottom: 12,
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
    fontSize: 18,
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
});

export default React.memo(NotificationScreen);