import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from '../confg/config';
import { Ionicons } from '@expo/vector-icons';

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
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContent}
    >
      {loading ? (
        [1, 2, 3].map((item) => (
          <ShimmerPlaceholder
            key={item}
            LinearGradient={LinearGradient}
            style={styles.buttonPlaceholder}
          />
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  buttonPlaceholder: {
    width: 120,
    height: 60,
    marginHorizontal: 8,
    borderRadius: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: '#D3C3E4',
    marginHorizontal: 8,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0,
    shadowRadius: 1,
    elevation: 1,
  },
  selectedButton: {
    backgroundColor: '#60279C',
  },
  buttonText: {
    color: '#60279C',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
});

export default CategoryButtonGroup;