import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const STATUS_TYPES = {
  0: { 
    label: 'Unverified', 
    color: '#9E9E9E', 
    textColor: '#FFFFFF',
    icon: (size = 18) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <Path d="M8 12L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </Svg>
    )
  },
  1: { 
    label: 'Verified', 
    color: '#4CAF50', 
    textColor: '#FFFFFF',
    icon: (size = 18) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <Path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </Svg>
    )
  },
  2: { 
    label: 'Under Review', 
    color: '#FFC107', 
    textColor: '#FFFFFF',
    icon: (size = 18) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <Path d="M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <Circle cx="12" cy="17" r="1" fill="currentColor"/>
      </Svg>
    )
  },
  3: { 
    label: 'Rejected', 
    color: '#F44336', 
    textColor: '#FFFFFF',
    icon: (size = 18) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <Path d="M8 8L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <Path d="M16 8L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </Svg>
    )
  },
  4: { 
    label: 'Unknown', 
    color: '#000000', 
    textColor: '#FFFFFF',
    icon: (size = 18) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <Path d="M12 16V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <Path d="M12 8V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </Svg>
    )
  }
};

const StatusBadge = ({ status }) => {
  const statusConfig = STATUS_TYPES[status] || STATUS_TYPES[4];

  return (
    <View style={[styles.badgeContainer, { backgroundColor: statusConfig.color }]}>
      <View style={styles.iconContainer}>
        {React.cloneElement(statusConfig.icon(), {
          color: statusConfig.textColor
        })}
      </View>
      <Text style={[styles.badgeText, { color: statusConfig.textColor }]}>
        {statusConfig.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    top: 0,
    left: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: 4,
    borderBottomRightRadius: 12,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});

export default StatusBadge;