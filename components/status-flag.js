import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';

const STATUS_TYPES = {
  0: { label: 'Unverified', color: '#9E9E9E', textColor: '#FFFFFF' },
  1: { label: 'Verified', color: '#4CAF50', textColor: '#FFFFFF' },
  2: { label: 'Under Review', color: '#FFC107', textColor: '#FFFFFF' },
  3: { label: 'Rejected', color: '#F44336', textColor: '#FFFFFF' },
  4: { label: 'Unknown', color: '#00000', textColor: '#FFFFFF' }
};

const StatusFlag = ({ status }) => {
  const statusConfig = STATUS_TYPES[status] || STATUS_TYPES[4];

  return (
    <View style={[styles.flagContainer, { backgroundColor: statusConfig.color }]}>
      <Text style={[styles.flagText, { color: statusConfig.textColor }]}>
        {statusConfig.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  flagContainer: {
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
  },
  flagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});

export default StatusFlag;