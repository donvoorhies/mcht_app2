import React from 'react';
import { Animated, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/theme';

interface Props {
  title: string;
  description: string;
  image?: ImageSourcePropType;
  imageAccessibilityLabel?: string;
}

const OnboardingSlide: React.FC<Props> = ({ title, description, image, imageAccessibilityLabel }) => {
  // small static parallax offset — keep simple for now
  const parallax = new Animated.Value(0);

  const imageStyle = {
    transform: [{ translateY: parallax.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }],
  };

  return (
    <View style={styles.container} accessible accessibilityRole="adjustable">
      {image ? (
        <Animated.Image
          source={image}
          style={[styles.image, imageStyle]}
          resizeMode="contain"
          accessibilityRole="image"
          accessibilityLabel={imageAccessibilityLabel}
        />
      ) : null}

      <View style={styles.textWrap}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  image: {
    width: '80%',
    height: 240,
    marginBottom: 20,
  },
  textWrap: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: Colors.light.icon,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default OnboardingSlide;
