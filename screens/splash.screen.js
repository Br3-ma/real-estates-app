import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/animation/2.gif')} style={styles.logo}/>
            <Text style={styles.text}>Square</Text>
            <Text style={styles.text2}>Find, Rent and Buy Houses!</Text>
            <Text style={styles.footerText}>powered by Twalitso</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo:{
        width:100,
        height:100,
        resizeMode:'cover',
        backgroundColor: '#fff',
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
    },
    footerText: {
        position: 'absolute',
        bottom: 10,
        fontSize: 12,
        color: '#316790',
    }
});

export default SplashScreen;
