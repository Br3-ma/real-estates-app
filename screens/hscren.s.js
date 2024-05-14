import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { Card, Button, Icon, SearchBar, ButtonGroup } from '@rneui/themed';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
        await new Promise(resolve => setTimeout(resolve, 2000));  // Simulating fetch delay
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
    <Card>
      <Card.Title>{item.name}</Card.Title>
  
      {/* Include overlay on the ScrollView with buttons and ribbon tags */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {item.images.map((img, index) => (
          <TouchableOpacity key={index} onPress={() => showImageViewer(item.images)}>
            <Image source={img} style={getImageStyle(item.images.length)} />
          </TouchableOpacity>
        ))}
        {/* Overlay with buttons and ribbon ${item.postedHours} */}
        <View style={styles.overlayStyle}>
          <Text style={styles.ribbonTag}>{`Posted 2 hours ago`}</Text>
        </View>
      </ScrollView>
      <View>
        {/* Content align in a row for price and location */}
        <View style={styles.priceLocationRow}>
          {/* Stylized price text */}
          <Text style={styles.priceText}>K{item.price}</Text>
  
          {/* Location with a map icon */}
          <TouchableOpacity onPress={() => navigation.navigate('MapScreen', {location: item.location})}>
            
            <Text>
              <MaterialIcons name="place" size={20} color="#000" /> 
              {item.location}
            </Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.iconRow}>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="hotel" size={20} color="#000" />
            <Text style={styles.iconText}>{item.beds} Beds</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="bathtub" size={20} color="#000" />
            <Text style={styles.iconText}>{item.baths} Baths</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="aspect-ratio" size={20} color="#000" />
            <Text style={styles.iconText}>{item.area} sqft</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <Button type="clear" icon={() => <MaterialIcons name="favorite-border" size={24} color="black" />} />
        <Button type="clear" icon={() => <MaterialIcons name="comment" size={24} color="black" />} />
        <Button type="clear" icon={() => <MaterialIcons name="share" size={24} color="black" />} />
      </View>
    </Card>
  );

  
  const renderImageViewerModal = () => {
    if (!isImageViewVisible || selectedIndex === null || !properties[selectedIndex]) {
      return null; // Safeguard against undefined properties
    }

    const property = properties[selectedIndex];

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isImageViewVisible}
        onRequestClose={() => setImageViewVisible(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={true}>
            {currentImages.map((image, index) => (
              <View key={index} style={{ width, height: width, position: 'relative' }}>
                <Image source={image} style={{ width, height: width, resizeMode: 'contain' }} />
                <View style={styles.overlayDetails}>
                  <Text style={styles.overlayText}>{property.name} - ${property.price}</Text>
                  <View style={styles.overlayIconRow}>
                    <Icon name="bed" type="material" size={15} color="#fff" />
                    <Text style={styles.overlayTextSmall}>{property.beds} Beds</Text>
                    <Icon name="bathtub" type="material" size={15} color="#fff" />
                    <Text style={styles.overlayTextSmall}>{property.baths} Baths</Text>
                    <Icon name="square-foot" type="material" size={15} color="#fff" />
                    <Text style={styles.overlayTextSmall}>{property.area} sqft</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
            <View>
              <Card>
                <Card.Title>{property.name}</Card.Title>
                <Card.Divider />
                <Text style={{ marginBottom: 10 }}>
                  Discover more about this wonderful property located at {property.location}.
                </Text>
                <View style={styles.actionRow}>
                  <Button
                    icon={<Icon name="heart" type="font-awesome" color="#f50" />}
                    type="clear"
                    onPress={() => console.log('Added to favourites')}
                  />
                  <Button
                    icon={<Icon name="comment" type="font-awesome" color="#5b5" />}
                    type="clear"
                    onPress={() => console.log('Comment')}
                  />
                  <Button
                    icon={<Icon name="thumbs-up" type="font-awesome" color="#29f" />}
                    type="clear"
                    onPress={() => console.log('Liked')}
                  />
                  <Button
                    icon={<Icon name="share-alt" type="font-awesome" color="#76448A" />}
                    type="clear"
                    onPress={() => console.log('Share')}
                  />
                </View>
              </Card>
            </View>
          <Button
            icon={{ name: 'close', color: '#fff' }}
            type="clear"
            containerStyle={{ position: 'absolute', top: 20, right: 10 }}
            onPress={() => setImageViewVisible(false)}
          />
        </SafeAreaView>
      </Modal>
    );
  };


  const getImageStyle = (imageCount) => ({
    width: imageCount === 1 ? width : width / Math.min(imageCount, 3),
    height: 250,
    resizeMode: 'cover',
    marginRight: 5,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Card>
        <SearchBar placeholder="Type Here..." onChangeText={updateSearch} value={search} />
        <ButtonGroup buttons={buttons} selectedIndex={selectedIndex} onPress={updateIndex} />
      </Card>
      <ScrollView>
        {loading ? (
          <ShimmerPlaceholder />
        ) : (
          properties.map((property) => (
            <React.Fragment key={property.id}>
              {renderPropertyItem({ item: property })}
            </React.Fragment>
          ))
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
  scrollViewStyle: {
    marginTop: 10,
  },
  overlayDetails: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    padding: 10,
  },
  overlayText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  overlayTextSmall: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 5,
  },
  overlayIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Ensures icons and text are aligned vertically
    justifyContent: 'center' // Centers each icon and text horizontally
  },
  iconText: {
    marginLeft: 5, // Adds space between the icon and the text
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // This will distribute the icon containers evenly
    alignItems: 'center',          // This will align the icons vertically centered
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  overlayStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  ribbonTag: {
    color: 'white',
    fontWeight: 'bold',
  },
  priceLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  priceText: {
    fontSize: 18,
    color: '#4169E1',  // A blueish color
    fontWeight: 'bold',
  },
});
export default HomeScreen;
