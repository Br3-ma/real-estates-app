import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

const MovingPlaceholder = ({ text }) => {
  const animatedValues = text.split('').map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    const animations = animatedValues.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 500,
            delay: index * 100,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      )
    );
    Animated.stagger(100, animations).start();
  }, []);

  return (
    <View style={{ flexDirection: 'row' }}>
      {text.split('').map((char, index) => (
        <Animated.Text
          key={index}
          style={{
            opacity: animatedValues[index],
            transform: [
              {
                translateY: animatedValues[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -10],
                }),
              },
            ],
          }}
        >
          {char}
        </Animated.Text>
      ))}
    </View>
  );
};

export default MovingPlaceholder;
