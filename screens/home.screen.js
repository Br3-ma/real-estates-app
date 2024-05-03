import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { Card, Button, Icon, SearchBar, ButtonGroup } from 'react-native-elements';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setProperties([
          { id: '1', name: 'Cozy Cottage', images: [require('../assets/house1.jpg'), require('../assets/house2.jpeg'), require('../assets/house3.jpg')], price: '250,000', location: 'Suburb', beds: 3, baths: 2, area: 1200 },
          { id: '2', name: 'Luxury Villa', images: [require('../assets/house1.jpg'), require('../assets/house3.jpg')], price: '950,000', location: 'City Center', beds: 5, baths: 4, area: 3500 },
          { id: '3', name: '2 Bedroom House in Kalundu', images: [require('../assets/house3.jpg')], price: '950,000', location: 'City Center', beds: 5, baths: 4, area: 3500 },
        ]);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const updateSearch = (search) => {
    setSearch(search);
  };

  const buttons = ['Buy', 'Rent', 'Projects'];
  const updateIndex = (selectedIndex) => {
    setSelectedIndex(selectedIndex);
  };

  const showImageViewer = (images) => {
    setCurrentImages(images);
    setImageViewVisible(true);
  };

  const renderPropertyItem = ({ item }) => (
    <Card containerStyle={styles.cardContainer}>
      <Card.Title style={styles.title}>{item.name}</Card.Title>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
        {item.images.map((img, index) => (
          <TouchableOpacity key={index} onPress={() => showImageViewer(item.images)}>
            <Image source={img} style={getImageStyle(item.images.length)} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.detailsContainer}>
        <Text style={styles.propertyPrice}>${item.price}</Text>
        <View style={styles.detailsRow}>
          <Icon name="bed" type="font-awesome-5" color="#4f9deb" />
          <Text style={styles.detailText}>{item.beds} Beds</Text>
          <Icon name="bath" type="font-awesome-5" color="#4f9deb" />
          <Text style={styles.detailText}>{item.baths} Baths</Text>
          <Icon name="expand" type="font-awesome-5" color="#4f9deb" />
          <Text style={styles.detailText}>{item.area} sqft</Text>
        </View>
        <Text style={styles.propertyLocation}>{item.location}</Text>
      </View>
      <View style={styles.actionButtons}>
        <Button
          icon={<Icon name="heart" type="font-awesome" color="#f50" />}
          buttonStyle={{ backgroundColor: 'transparent' }}
        />
        <Button
          icon={<Icon name="comment" type="font-awesome" color="#5b5" />}
          buttonStyle={{ backgroundColor: 'transparent' }}
        />
        <Button
          icon={<Icon name="share-alt" type="font-awesome" color="#29f" />}
          buttonStyle={{ backgroundColor: 'transparent' }}
        />
      </View>
    </Card>
  );

  const renderImageViewerModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isImageViewVisible}
      onRequestClose={() => setImageViewVisible(false)}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={true}>
          {currentImages.map((image, index) => (
            <Image key={index} source={image} style={styles.fullScreenImage} />
          ))}
        </ScrollView>
        <Button
          title="Close"
          onPress={() => setImageViewVisible(false)}
          containerStyle={{ position: 'absolute', top: 20, right: 20 }}
        />
      </SafeAreaView>
    </Modal>
  );

  const getImageStyle = (imageCount) => ({
    width: imageCount === 1 ? width : (width / Math.min(imageCount, 3)),
    height: 250,
    resizeMode: 'cover',
    marginRight: 5,
  });

  return (
    <SafeAreaView style={styles.screenContainer}>
      <Card containerStyle={styles.topBarCard}>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={updateSearch}
          value={search}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
        />
        <ButtonGroup
          buttons={buttons}
          selectedIndex={selectedIndex}
          onPress={updateIndex}
          containerStyle={styles.buttonGroupContainer}
        />
      </Card>
      <ScrollView style={styles.scrollViewStyle}>
        {loading ? (
          <ShimmerPlaceholder style={styles.shimmerPlaceholder} />
        ) : (
          properties.map((property) => renderPropertyItem({ item: property }))
        )}
      </ScrollView>
      {renderImageViewerModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  topBarCard: {
    flexDirection: 'column', // Makes the children of the card stack vertically
    justifyContent: 'space-between', // Distributes space evenly between children
    alignItems: 'center', // Centers children horizontally
    padding: 5,
    marginHorizontal: 20, // Centers the card horizontally with some margin
    marginTop: 10, // Give some margin at the top
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 4, // Adds shadow for elevation effect
  },
  searchBarContainer: {
    width: '100%', // Ensures the search bar fills the card width
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchBarInputContainer: {
    backgroundColor: '#EFEFEF',
  },
  buttonGroupContainer: {
    width: '100%', // Ensures the button group fills the card width
    marginTop: 5, // Gives some space between the search bar and button group
  },
  cardContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'row',
    padding: 0,
  },
  fullScreenImage: {
    width: width,
    height: width,
    resizeMode: 'contain',
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  propertyLocation: {
    fontSize: 14,
    marginBottom: 10,
  },
  detailsContainer: {
    paddingLeft: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 5,
    marginRight: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  shimmerPlaceholder: {
    height: 200,
    width: '100%',
    marginBottom: 20,
  },
  // buttonGroupContainer: {
  //   height: 40,
  //   marginHorizontal: 10,
  //   marginBottom: 10,
  // },
  scrollViewStyle: {
    marginTop: 10,
  }
});

export default HomeScreen;
