import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 20,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Animated.View style={[
                styles.content,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                }
            ]}>
                <View style={styles.iconContainer}>
                    <Feather name="home" size={48} color="#ffffff" />
                </View>
                <Text style={styles.title}>Square</Text>
                <Text style={styles.subtitle}>Find, Rent and Buy Houses</Text>
            </Animated.View>
            <Text style={styles.footerText}>powered by Twalitso</Text>
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
    content: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    title: {
        fontSize: 48,
        fontWeight: '800',
        color: '#333333',
        marginBottom: 10,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 18,
        color: '#666666',
        textAlign: 'center',
        maxWidth: '80%',
        lineHeight: 24,
    },
    footerText: {
        position: 'absolute',
        bottom: 20,
        fontSize: 14,
        color: '#999999',
    }
});

export default SplashScreen;