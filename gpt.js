// When clicked make the SearchBar to open dialogBox(Modal) input field form 
// that will allow a user to search keyword when, the input dialogBox(Modal) 
// is open the background overlay should be Blur, and when user clicks away 
// from the dialogBox it should close, the search should post the key and the 
// category (append dropdown at search input) to an API and once a response data 
// is return pass to a new stackscreen (Search Result Screen) to display the list

import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, SafeAreaView, StatusBar, ScrollView, Platform, TouchableWithoutFeedback } from 'react-native';
import { SearchBar, ButtonGroup } from 'react-native-elements';
import { BlurView } from 'react-native-blur';
import { useNavigation } from '@react-navigation/native';

// Assume other necessary imports

const HomeScreen = () => {
  const [search, setSearch] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [category, setCategory] = useState('');
  const navigation = useNavigation();

  const updateSearch = (search) => {
    setSearch(search);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch('YOUR_API_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: search, category }),
      });
      const data = await response.json();
      closeModal();
      navigation.navigate('SearchResultScreen', { results: data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchBar
        placeholder="Search properties..."
        onFocus={openModal}
        value={search}
        platform={Platform.OS}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInput}
      />
      <ScrollView style={styles.homeBody}>
        <ButtonGroup
          buttons={buttons}
          selectedIndex={selectedIndex}
          onPress={updateIndex}
          containerStyle={styles.buttonGroupContainer}
          selectedButtonStyle={styles.selectedButton}
        />

        {/* Add the new section below the ButtonGroup */}
        <View style={styles.featuredSection}>
          <Text style={styles.featuredSectionTitle}>Featured Items</Text>
          <FeaturedItems />
        </View>

        {loading ? (
          <View style={styles.loader}>
            {[1, 2, 3].map((item) => (
              <ShimmerPlaceholder key={item} style={styles.placeholder} />
            ))}
          </View>
        ) : (
          <View style={styles.bodyContent}>
            {properties.map((property) => (
              <View key={property.id}>{renderPropertyItem({ item: property })}</View>
            ))}
          </View>
        )}

        <AdAdPost />
        <BlankView />
      </ScrollView>

      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay}>
            <BlurView style={styles.absolute} blurType="light" blurAmount={10} />
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TextInput
                  placeholder="Search..."
                  value={search}
                  onChangeText={updateSearch}
                  style={styles.searchInput}
                />
                <View style={styles.dropdownContainer}>
                  <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                    style={styles.dropdown}
                  >
                    <Picker.Item label="Category 1" value="category1" />
                    <Picker.Item label="Category 2" value="category2" />
                  </Picker>
                </View>
                <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                  <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {renderImageViewerModal()}
      {renderCommentsModal()}
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
  },
  searchBarInput: {
    backgroundColor: '#eee',
  },
  homeBody: {
    flex: 1,
  },
  buttonGroupContainer: {
    marginVertical: 10,
  },
  selectedButton: {
    backgroundColor: 'blue',
  },
  featuredSection: {
    padding: 10,
  },
  featuredSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  placeholder: {
    height: 150,
    backgroundColor: '#ccc',
  },
  bodyContent: {
    padding: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  searchInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    padding: 10,
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
  },
  dropdown: {
    width: '100%',
    height: 50,
  },
  searchButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
};

export default HomeScreen;
