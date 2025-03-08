import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { SERVER_BASE_URL } from '../confg/config';
import ShareModal from './share-modal';
import { Video } from 'expo-av';
import StatusFlag from './status-flag';
import ProfileBottomSheet from './poster-profile';

const { width, height } = Dimensions.get('window');

const RenderPropertyItem = ({ item, showImageViewer, openCommentsModal }) => {
  const [favorites, setFavorites] = useState([]);
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [isProfileVisible, setProfileVisible] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }, []);

  const saveFavorites = useCallback(async (newFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }, []);

  const toggleFavorite = useCallback((item) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    const updatedFavorites = isFavorite
      ? favorites.filter(fav => fav.id !== item.id)
      : [...favorites, item];
    saveFavorites(updatedFavorites);
  }, [favorites, saveFavorites]);

  const isFavorite = favorites.some(fav => fav.id === item.id);

  const getImageStyle = (imageCount) => ({
    width: width,
    height: height * 0.5,
    resizeMode: 'cover',
  });

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  const openShareModal = () => {
    setShareModalVisible(true);
  };

  const closeShareModal = () => {
    setShareModalVisible(false);
  };

  const openProfileSheet = () => {
    setProfileVisible(true);
  };

  const closeProfileSheet = () => {
    setProfileVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mediaContainer}>
        <StatusFlag status={item.verified_status} style={styles.statusFlag} />
        <ScrollView 
          horizontal 
          pagingEnabled
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContainer}
        >
          {item.images.map((img, index) => (
            <TouchableOpacity key={index} onPress={() => showImageViewer(item.images, item.videos, item)}>
              <Image
                source={{
                  uri: img?.path
                    ? `${SERVER_BASE_URL}/storage/app/` + img.path
                    : `${SERVER_BASE_URL}/storage/app/images/no-img.png`, 
                }}
                style={getImageStyle(item.images.length)}
              />
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>{index + 1}/{item.images.length + item.videos.length}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {item.videos.map((video, index) => (
            <TouchableOpacity key={`video-${index}`} onPress={() => showImageViewer(item.images, item.videos, item)}>
              <Video
                source={{ uri: `${SERVER_BASE_URL}/storage/app/` + video.path }}
                style={getImageStyle(1)}
                resizeMode="cover"
                isMuted
              />
              <View style={styles.videoIndicator}>
                <MaterialIcons name="play-circle-fill" size={40} color="white" />
              </View>
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>{item.images.length + index + 1}/{item.images.length + item.videos.length}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <TouchableOpacity onPress={openProfileSheet}>
            <Text style={styles.posterInfo}>
              Posted by <Text style={styles.posterName}>{item?.user?.name}</Text> • {moment(item.created_at).fromNow()}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.priceLocationContainer}>
          <Text style={styles.priceText}>K{parseFloat(item.price).toLocaleString()}</Text>
          <View style={styles.locationContainer}>
            <MaterialIcons name="place" size={16} color="#555" />
            <Text style={styles.locationText}>
              {truncateText(item.location, 25)}
            </Text>
          </View>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <MaterialIcons name="hotel" size={20} color="#555" />
            <Text style={styles.featureText}>{item.bedrooms} Beds</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.featureItem}>
            <MaterialIcons name="bathtub" size={20} color="#555" />
            <Text style={styles.featureText}>{item.bathrooms} Baths</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.featureItem}>
            <MaterialIcons name="aspect-ratio" size={20} color="#555" />
            <Text style={styles.featureText}>{item.area} sqft</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => toggleFavorite(item)}
        >
          <MaterialIcons 
            name={isFavorite ? "favorite" : "favorite-border"} 
            size={24} 
            color={isFavorite ? "#FF5A5F" : "#555"} 
          />
          <Text style={styles.actionText}>Save</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => openCommentsModal(item.id)}
        >
          <MaterialIcons name="comment" size={24} color="#555" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={openShareModal}
        >
          <MaterialIcons name="share" size={24} color="#555" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      <ShareModal
        isVisible={isShareModalVisible}
        onClose={closeShareModal}
        item={item}
        serverBaseUrl={SERVER_BASE_URL}
      />

      <ProfileBottomSheet 
        isVisible={isProfileVisible}
        onClose={closeProfileSheet}
        userData={item.user}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'white',
    elevation: 1,
  },
  mediaContainer: {
    position: 'relative',
    width: '100%',
    height: height * 0.5,
  },
  scrollContainer: {
    flexGrow: 0,
  },
  statusFlag: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  imageCounterText: {
    color: 'white',
    fontSize: 12,
  },
  videoIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  posterInfo: {
    fontSize: 14,
    color: '#777',
  },
  posterName: {
    color: '#4A90E2',
    fontWeight: '500',
  },
  priceLocationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5A5F',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 4,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  featureDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#DDD',
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 12,
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
});

export default RenderPropertyItem;