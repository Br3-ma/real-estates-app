import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { Card, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { SERVER_BASE_URL } from '../confg/config';
import ShareModal from './share-modal'; // Import the ShareModal component

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
    width: imageCount === 1 ? width : width / Math.min(imageCount, 3),
    height: 250,
    resizeMode: 'cover',
    marginRight: 5,
  });

  const openShareModal = () => {
    setShareModalVisible(true);
  };

  const closeShareModal = () => {
    setShareModalVisible(false);
  };

  return (
    <Card containerStyle={styles.fullWidthCard}>
      <Card.Title style={styles.postTitle}>{item.title}</Card.Title>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {item.images.map((img, index) => (
          <TouchableOpacity key={index} onPress={() => showImageViewer(item.images, item.id, item)}>
            <Image
              source={{ uri: `${SERVER_BASE_URL}/storage/app/` + img.path }}
              style={getImageStyle(item.images.length)}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.overlayStyle}>
        <Text style={styles.ribbonTag}>{`Posted by ${item?.user?.name} \u2022 ` + moment(item.created_at).fromNow()}</Text>
      </View>
      <View>
        <View style={styles.priceLocationRow}>
          <Text style={styles.priceText}>K{item.price}</Text>
          <TouchableOpacity>
            <Text>
              <MaterialIcons name="place" size={20} color="#000" />
              {item.location}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.iconRow}>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="hotel" size={20} color="#7D7399" />
            <Text style={styles.iconText}>{item.bedrooms} Beds</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="bathtub" size={20} color="#7D7399" />
            <Text style={styles.iconText}>{item.bathrooms} Baths</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="aspect-ratio" size={20} color="#7D7399" />
            <Text style={styles.iconText}>{item.area} sqft</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <Button
          type="clear"
          style={styles.buttonCover}
          icon={<MaterialIcons name={isFavorite ? "favorite" : "favorite-border"} size={24} color={isFavorite ? "#7D7399" : "gray"} />}
          onPress={() => toggleFavorite(item)}
        />
        <Button
          type="clear"
          style={styles.buttonCover}
          icon={<MaterialIcons name="comment" size={24} color="gray" />}
          onPress={() => openCommentsModal(item.id)}
        />
        <Button
          type="clear"
          style={styles.buttonCover}
          icon={<MaterialIcons name="share" size={24} color="gray" />}
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
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  overlayStyle: {
    position: 'absolute',
    bottom: 150,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
  ribbonTag: {
    color: '#fff',
    fontSize: 12,
  },
  priceLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    marginLeft: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  buttonCover: {
    paddingHorizontal: 10,
  },
});

export default RenderPropertyItem;
