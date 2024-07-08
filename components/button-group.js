import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { API_BASE_URL } from '../confg/config';

const CategoryButtonGroup = ({ onButtonPress }) => {
  const [buttons, setButtons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    const fetchButtons = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        setButtons(response.data.data);
      } catch (error) {
        console.error('Failed to fetch buttons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchButtons();
  }, []);

  const handleButtonPress = (id) => {
    setSelectedButton(id);
    onButtonPress(id);
  };

  return (
    <View style={styles.buttonGroupContainer}>
      {loading ? (
        [1, 2, 3].map((item) => (
          <ShimmerPlaceholder key={item} style={styles.buttonPlaceholder} />
        ))
      ) : (
        buttons.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={[
              styles.button,
              selectedButton === button.id && styles.selectedButton
            ]}
            onPress={() => handleButtonPress(button.id)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedButton === button.id && styles.selectedButtonText
              ]}
            >
              {button.name}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonPlaceholder: {
    width: 80,
    height: 40,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F7F5FD',
    color:'#438ab5',
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#7D7399',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#fff',
  },
});


export default CategoryButtonGroup;
