import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const { width } = Dimensions.get('window');

const ShimmerSearchLoading = ({ isLoading }) => {
  // Common shimmer props for consistency
  const shimmerProps = {
    visible: !isLoading,
    style: { borderRadius: 4 },
    shimmerStyle: {
      backgroundColor: '#E8E8E8',
      highlightColor: '#F5F5F5',
    },
    duration: 1500,
  };

  return (
    <View style={styles.container}>
      {/* Main Property Image */}
      <ShimmerPlaceholder
        {...shimmerProps}
        style={[shimmerProps.style, styles.mainImage]}
      />

      {/* Price and Status Row */}
      <View style={styles.priceRow}>
        <ShimmerPlaceholder
          {...shimmerProps}
          style={[shimmerProps.style, styles.price]}
        />
        <ShimmerPlaceholder
          {...shimmerProps}
          style={[shimmerProps.style, styles.status]}
        />
      </View>

      {/* Property Details */}
      <View style={styles.detailsContainer}>
        {/* Title */}
        <ShimmerPlaceholder
          {...shimmerProps}
          style={[shimmerProps.style, styles.title]}
        />

        {/* Address */}
        <ShimmerPlaceholder
          {...shimmerProps}
          style={[shimmerProps.style, styles.address]}
        />

        {/* Property Features Row */}
        <View style={styles.featuresRow}>
          {[...Array(3)].map((_, index) => (
            <ShimmerPlaceholder
              key={index}
              {...shimmerProps}
              style={[shimmerProps.style, styles.feature]}
            />
          ))}
        </View>

        {/* Description Lines */}
        {[...Array(2)].map((_, index) => (
          <ShimmerPlaceholder
            key={`desc-${index}`}
            {...shimmerProps}
            style={[
              shimmerProps.style,
              styles.descriptionLine,
              { width: index === 1 ? '70%' : '90%' }
            ]}
          />
        ))}

        {/* Agent Info Row */}
        <View style={styles.agentRow}>
          <ShimmerPlaceholder
            {...shimmerProps}
            style={[shimmerProps.style, styles.agentAvatar]}
          />
          <View style={styles.agentInfo}>
            <ShimmerPlaceholder
              {...shimmerProps}
              style={[shimmerProps.style, styles.agentName]}
            />
            <ShimmerPlaceholder
              {...shimmerProps}
              style={[shimmerProps.style, styles.agentRole]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  price: {
    width: 120,
    height: 24,
  },
  status: {
    width: 80,
    height: 24,
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    width: '85%',
    height: 24,
    marginBottom: 8,
  },
  address: {
    width: '60%',
    height: 16,
    marginBottom: 16,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  feature: {
    width: width * 0.25,
    height: 16,
  },
  descriptionLine: {
    height: 14,
    marginBottom: 8,
  },
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  agentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  agentName: {
    width: 120,
    height: 16,
    marginBottom: 4,
  },
  agentRole: {
    width: 80,
    height: 14,
  },
});

export default ShimmerSearchLoading;