import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';

export default function StartScreen() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    // Auto-navigate to onboarding after a brief delay
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/images/CoreHyponoselogo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="MCHT Logo"
        />
        <Text style={styles.title}>MCHT</Text>
        <Text style={styles.subtitle}>Mindfulness & Clinical Hypnosis Training</Text>
        <ActivityIndicator size="large" color={Colors.light.tint} style={styles.loader} />
      </View>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace('Onboarding')}
        accessibilityLabel="Skip to onboarding"
      >
        <Text style={styles.skipText}>Tryk for at fortsætte</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.icon,
    textAlign: 'center',
    marginBottom: 32,
  },
  loader: {
    marginTop: 16,
  },
  skipButton: {
    padding: 20,
    alignItems: 'center',
  },
  skipText: {
    color: Colors.light.tint,
    fontSize: 15,
    fontWeight: '600',
  },
});
