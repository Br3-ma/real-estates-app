import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const colors = {
  primary: '#165F56',
  secondary: '#30A789',
  background: '#F5F7FA',
  text: '#333333',
  textLight: '#777777',
  white: '#FFFFFF',
  borderColor: '#E0E0E0',
  overlay: 'rgba(0,0,0,0.6)',
};

const fontSizes = {
  small: 12,
  medium: 14,
  large: 16,
  xlarge: 18,
  xxlarge: 22,
};

const spacing = {
  xs: 5,
  small: 10,
  medium: 15,
  large: 20,
  xlarge: 25,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    elevation: 2,
  },
  closeButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSizes.xlarge,
    fontWeight: '600',
    color: colors.text,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  imageSlider: {
    height: height * 0.35,
  },
  imageContainer: {
    width: width,
    height: height * 0.35,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayDetails: {
    backgroundColor: colors.overlay,
    padding: spacing.medium,
  },
  overlayText: {
    color: colors.white,
    fontSize: fontSizes.large,
    fontWeight: '600',
  },
  overlayIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  overlayTextSmall: {
    color: colors.white,
    fontSize: fontSizes.small,
    marginLeft: spacing.xs,
    marginRight: spacing.small,
  },
  detailsContainer: {
    padding: spacing.medium,
    backgroundColor: colors.white,
    marginBottom: spacing.small,
    borderRadius: 8,
    elevation: 1,
  },
  propertyTitle: {
    fontSize: fontSizes.xxlarge,
    fontWeight: '700',
    marginBottom: spacing.xs,
    color: colors.text,
  },
  propertyPrice: {
    fontSize: fontSizes.xlarge,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.small,
  },
  propertyDescription: {
    fontSize: fontSizes.medium,
    color: colors.textLight,
    marginBottom: spacing.small,
    lineHeight: 22,
  },
  propertyLocation: {
    fontSize: fontSizes.medium,
    color: colors.textLight,
    marginBottom: spacing.small,
  },
  propertyDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.small,
  },
  propertyDetailsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyDetailsText: {
    marginLeft: spacing.xs,
    fontSize: fontSizes.medium,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: fontSizes.xlarge,
    fontWeight: '600',
    marginBottom: spacing.small,
    color: colors.text,
  },
  featureAmenitiesContainer: {
    padding: spacing.medium,
    backgroundColor: colors.white,
    marginBottom: spacing.small,
    borderRadius: 8,
    elevation: 1,
  },
  featureAmenitiesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureAmenitiesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  featureAmenitiesText: {
    marginLeft: spacing.small,
    fontSize: fontSizes.medium,
    color: colors.text,
  },
  featureAmenitiesLink: {
    color: colors.secondary,
    marginLeft: spacing.small,
    textDecorationLine: 'underline',
  },
  mapFinderContainer: {
    padding: spacing.medium,
    backgroundColor: colors.white,
    marginBottom: spacing.small,
    borderRadius: 8,
    elevation: 1,
  },
  mapImage: {
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  openMapButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.small,
    borderRadius: 25,
    marginTop: spacing.small,
  },
  openMapButtonText: {
    color: colors.white,
    fontSize: fontSizes.medium,
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
    paddingVertical: spacing.small,
    elevation: 5,
  },
  bottomBarButton: {
    alignItems: 'center',
  },
  bottomBarButtonText: {
    fontSize: fontSizes.small,
    marginTop: spacing.xs,
    color: colors.primary,
  },
  videoCover: {
    width: width,
    height: height * 0.4,
    borderRadius: 8,
    overflow: 'hidden',
  },   
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.medium,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
  },
  commentButton: {
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    borderRadius: 25,
  },
  commentButtonText: {
    color: colors.white,
    fontSize: fontSizes.medium,
    fontWeight: '600',
  },
  whatsappIcon: {
    alignItems: 'center',
    backgroundColor: '#25D366',
    padding: spacing.small,
    borderRadius: 25,
  },
});

export default styles;