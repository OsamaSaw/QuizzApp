import React, { useEffect } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface ShakeAnimationProps {
  children: React.ReactNode;
  shake: boolean;
}

export const ShakeAnimation: React.FC<ShakeAnimationProps> = ({ children, shake }) => {
  const shakeAnimation = new Animated.Value(0);

  useEffect(() => {
    if (shake) {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [shake]);

  return (
    <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
      {children}
    </Animated.View>
  );
};

interface FloatingNumberProps {
  value: string;
  style?: any;
}

export const FloatingNumber: React.FC<FloatingNumberProps> = ({ value, style }) => {
  const translateY = new Animated.Value(0);
  const opacity = new Animated.Value(1);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -50,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.Text
      style={[
        styles.floatingText,
        style,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      {value}
    </Animated.Text>
  );
};

export const StarBurst: React.FC = () => {
  const scale = new Animated.Value(0);
  const opacity = new Animated.Value(1);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.starBurst,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <FontAwesome5 name="star" size={30} color="#FFD700" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingText: {
    position: 'absolute',
    fontSize: SCREEN_HEIGHT * 0.02,
    fontWeight: 'bold',
  },
  starBurst: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 