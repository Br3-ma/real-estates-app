import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { Card, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { SERVER_BASE_URL } from '../confg/config';
import ShareModal from './share-modal';
import { Video } from 'expo-av';
import StatusFlag from './status-flag';

const { width } = Dimensions.get('window');

const RenderPropertyItem = ({ item, showImageViewer, openCommentsModal }) => {
  const [favorites, setFavorites] = useState([]);
  const [isShareModalVisible, setShareModalVisible] = useState(false);

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
    width: imageCount === 1 ? width - 20 : (width - 40) / Math.min(imageCount, 3),
    height: 250,
    resizeMode: 'cover',
    marginRight: 0,
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

  return (
    <Card containerStyle={styles.fullWidthCard}>
      <StatusFlag status={item.verified_status} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
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
          </TouchableOpacity>
        ))}
        {item.videos.map((video, index) => (
          <TouchableOpacity key={index} onPress={() => showImageViewer(item.images, item.videos, item)}>
            <Video
              source={{ uri: `${SERVER_BASE_URL}/storage/app/` + video.path }}
              style={getImageStyle(item.videos.length)}
              resizeMode="cover"
              isMuted
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.titleHeaders}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.ribbonTag}>{`Posted by ${item?.user?.name} \u2024 ${moment(item.created_at).fromNow()}`}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.priceLocationRow}>
          <Text style={styles.priceText}>K{parseFloat(item.price).toLocaleString()}</Text>
          <TouchableOpacity>
            <Text style={styles.locationText}>
              <MaterialIcons name="place" size={20} color="#333" />
              {truncateText(item.location, 18)}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.iconRow}>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="hotel" size={20} color="#333" />
            <Text style={styles.iconText}>{item.bedrooms} Beds</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="bathtub" size={20} color="#333" />
            <Text style={styles.iconText}>{item.bathrooms} Baths</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="aspect-ratio" size={20} color="#333" />
            <Text style={styles.iconText}>{item.area} sqft</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <Button
          type="clear"
          style={styles.buttonCover}
          icon={<MaterialIcons name={isFavorite ? "favorite" : "favorite-border"} size={20} color={isFavorite ? "#FFCC70" : "gray"} />}
          onPress={() => toggleFavorite(item)}
          
        />
        <Button
          type="clear"
          style={styles.buttonCover}
          icon={<MaterialIcons name="comment" size={20} color="gray" />}
          onPress={() => openCommentsModal(item.id)}
        />
        <Button
          type="clear"
          style={styles.buttonCover}
          icon={<MaterialIcons name="share" size={20} color="gray" />}
          onPress={openShareModal}
        />
      </View>
      <ShareModal
        isVisible={isShareModalVisible}
        onClose={closeShareModal}
        item={item}
        serverBaseUrl={SERVER_BASE_URL}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  fullWidthCard: {
    width: '100%',
    margin: 0,
    marginBottom:17,
    padding: 0,
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 1,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  scrollContainer: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  titleHeaders: {
    paddingHorizontal: 0,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  ribbonTag: {
    color: '#666',
    fontSize: 14,
  },
  detailsContainer: {
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  priceLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C850C0',
  },
  locationText: {
    fontSize: 14,
    color: '#333',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 1,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  buttonCover: {
    paddingHorizontal: 5,
  },
});

export default RenderPropertyItem;
