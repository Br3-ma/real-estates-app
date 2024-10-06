import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
    const logoScale = new Animated.Value(0);
    const textOpacity = new Animated.Value(0);

    useEffect(() => {
        Animated.sequence([
            Animated.spring(logoScale, {
                toValue: 1,
                tension: 10,
                friction: 2,
                useNativeDriver: true,
            }),
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
                <Image source={require('../assets/animation/2.gif')} style={styles.logo} />
            </Animated.View>
            <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
                <Text style={styles.title}>Square</Text>
                <Text style={styles.subtitle}>Find, Rent and Buy Houses!</Text>
            </Animated.View>
            <Text style={styles.footerText}>powered by Twalitso</Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'cover',
    },
    textContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    footerText: {
        position: 'absolute',
        bottom: 20,
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
    }
});

export default SplashScreen;