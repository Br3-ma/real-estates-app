import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  imageSlider: {
    height: 250,
  },
  imageContainer: {
    width: width,
    height: 250,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayDetails: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlayIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  overlayTextSmall: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
    marginRight: 10,
  },
  detailsContainer: {
    padding: 15,
  },
  propertyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  propertyPrice: {
    fontSize: 18,
    color: '#165F56',
    marginBottom: 10,
  },
  propertyDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  propertyDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  propertyDetailsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyDetailsText: {
    marginLeft: 5,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  featureAmenitiesContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  featureAmenitiesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  featureAmenitiesText: {
    marginLeft: 10,
    fontSize: 14,
  },
  featureAmenitiesLink: {
    color: '#165F56',
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
  mapFinderContainer: {
    padding: 15,
  },
  mapImage: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openMapButton: {
    backgroundColor: '#165F56',
    paddingHorizontal: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
  },
  bottomBarButton: {
    alignItems: 'center',
  },
  bottomBarButtonText: {
    fontSize: 12,
    marginTop: 5,
    color: '#165F56',
  },
  videoCover: {
    width: width,
    height: 300,
  },   
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  commentButton: {
    alignItems: 'center',
  },
  whatsappIcon: {
    alignItems: 'center',
  },
}); 
export default styles;