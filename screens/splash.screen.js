import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar, Image } from 'react-native';

const { width, height } = Dimensions.get('window');
const logo = require('../assets/icon/splash.png');

const SplashScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const footerAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Start animations
        Animated.sequence([
            // First animate the logo appearance
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 20,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
            // Then start the continuous animations
            Animated.parallel([
                // Subtle bounce effect
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(bounceAnim, {
                            toValue: 1,
                            duration: 1500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(bounceAnim, {
                            toValue: 0,
                            duration: 1500,
                            useNativeDriver: true,
                        }),
                    ])
                ),
                // Subtle pulse effect
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(pulseAnim, {
                            toValue: 1.05,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(pulseAnim, {
                            toValue: 1,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                    ])
                ),
            ]),
        ]).start();

        // Animate footer separately
        Animated.timing(footerAnim, {
            toValue: 1,
            duration: 1000,
            delay: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const bounceInterpolation = bounceAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -8],
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <Animated.View 
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { scale: scaleAnim },
                            { translateY: bounceInterpolation },
                        ],
                    }
                ]}
            >
                <Animated.View 
                    style={[
                        styles.iconContainer,
                        {
                            transform: [
                                { rotate: spin },
                                { scale: pulseAnim },
                            ],
                        }
                    ]}
                >
                    <Image 
                        source={logo} 
                        style={styles.logo} 
                        resizeMode="contain" 
                    />
                </Animated.View>
            </Animated.View>

            <Animated.View 
                style={[
                    styles.footer,
                    {
                        opacity: footerAnim,
                        transform: [{
                            translateY: footerAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                            })
                        }]
                    }
                ]}
            >
                <Text style={styles.footerText}>Twalitso Innovations</Text>
            </Animated.View>
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
        justifyContent: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5.62,
    },
    logo: {
        width: 100,
        height: 100,
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    footerText: {
        fontSize: 16,
        color: '#bfcfd9',
        textAlign: 'center',
        fontWeight: '500',
        letterSpacing: 0.5,
    },
});

export default SplashScreen;