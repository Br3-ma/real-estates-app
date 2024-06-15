import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchBarInput: {
    backgroundColor: '#ececec',
  },
  buttonGroupContainer: {
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: '#6c63ff',
  },
  fullWidthCard: {
    width: '100%',
  },
  priceLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    marginLeft: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  closeButton: {
    marginLeft: 10,
    marginTop: 10,
  },
  topImageContainer: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  imageContainer: {
    width: width,
    height: 300,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  overlayDetails: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  overlayIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlayTextSmall: {
    color: '#fff',
    fontSize: 12,
  },
  toggleButton: {
    flexDirection: 'row', // Changed to row layout
    justifyContent: 'space-around', // Adjusted spacing between buttons
    alignItems: 'center', // Center items vertically
    marginVertical: 5,
  },
  commentSection: {
    backgroundColor: '#f1f1f1',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  messageContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 5,
  },
  messageTextTitle: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'purple',
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
  },
  replyLink: {
    fontSize: 12,
    color: '#007aff',
    marginTop: 5,
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: '90%',
    height: 200,
    marginBottom: 10,
  },
  overlayStyle: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  ribbonTag: {
    color: '#fff',
    fontSize: 12,
  },
  // =================== Property Details ===
  detailsContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 20,
    color: '#888',
    marginBottom: 8,
  },
  propertyDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  propertyDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyDetailsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyDetailsText: {
    marginLeft: 4,
    fontSize: 16,
  },
  // =================== New Modal Sections ===
  featureAmenitiesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#EFEEFA',
    marginTop: 10,
  },
  featureAmenitiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureAmenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureAmenitiesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  featureAmenitiesText: {
    fontSize: 14,
    marginLeft: 8,
  },
  featureAmenitiesLink: {
    color: '#007aff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  // --------------------MapFinder Section --
  mapFinderContainer: {
    alignItems: 'left',
    marginTop: 10,
    padding: 13,
    backgroundColor: '#f9f9f9',
    borderRadius: 10, // Rounded corners
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Android shadow
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mapImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 10, // Rounded corners for the image
    overflow: 'hidden', // Ensure borderRadius works
  },
  openMapButton: {
    backgroundColor: '#6c63ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20, // Rounded button
    marginTop: 10,
    elevation: 3, // Android shadow
  },
  openMapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  recommendedPropertiesContainer: {
    marginTop: 10,
    borderRadius: 10, // Rounded corners
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Android shadow
    backgroundColor: '#f9f9f9',
    padding: 12,
  },
  recommendedPropertyImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8, // Rounded corners for the image
    overflow: 'hidden',
  },
  recommendedPropertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recommendedPropertyPrice: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  recommendedPropertyDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});

export default styles;
