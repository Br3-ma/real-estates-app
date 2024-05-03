import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/animation/2.gif')} style={styles.logo}/>
            <Text style={styles.text}>Real Estates</Text>
            <Text style={styles.text2}>Any body home</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    logo:{
        width:200,
        height:200,
        resizeMode:'contain',
    },
    text:{
        marginTop:20,
        fontSize:18,
        fontWeight:'bold',
        color:'#316790'
    },
    text2:{
        marginTop:20,
        fontSize:10,
        fontWeight:'normal',
        color:'#316790'
    }
});
export default SplashScreen;