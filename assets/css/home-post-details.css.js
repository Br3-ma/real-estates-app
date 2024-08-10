import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    modalContent: {
      flexGrow: 1,
    },  
    topImageContainer: {
        height: height * 0.4,
    },
    imageContainer: {
        width: width,
        height: '100%',
    },
    imageBackground: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'flex-end',
    },  
    overlayDetails: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 15,
    },
    overlayText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    overlayTextSmall: {
      color: '#fff',
      fontSize: 14,
    },
    overlayIconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    detailsContainer: {
        padding: 20,
        backgroundColor: '#3f7a9d',
        borderBottomLeftRadius:30,
        borderBottomRightRadius:30,
      },
      propertyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color:'#fff'
      },
      propertyPrice: {
        fontSize: 20,
        color: '#b3e5f9',
        marginBottom: 8,
      },
      propertyDescription: {
        fontSize: 16,
        color: '#e4e9eb',
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
        color:'#f5f5f5',
      },
      // =================== New Modal Sections ===
      featureAmenitiesContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#EFEEFA',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginTop: 10,
        marginHorizontal:10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
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
        marginTop: 0,
        marginHorizontal:10,
        padding: 13,
        backgroundColor: '#f9f9f9',
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
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
        paddingHorizontal:4,
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
        paddingHorizontal: 25,
      },
      recommendedPropertyImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 8, // Rounded corners for the image
        overflow: 'hidden',
        marginBottom: 10,
        shadowColor: '#000', // Shadow color
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5, // Android shadow
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
      recommendedPropertyItem:{
        padding: 10,
      },
      buttonLabel:{
        color:'#3f7a9d'
      },
    
      featuredSection: {
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom:10,
      },
      featuredSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color:'#405466', 
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
      buttonLabel: {
        marginTop: 10,
        fontSize: 11,
        color: '#333',
      },    
  });

  export default styles;
