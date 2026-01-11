import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';

const LAST_SESSION_KEY = 'mcht_last_session';

interface SessionInfo {
  id: string;
  title: string;
  url: string;
  timestamp: string;
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [lastSession, setLastSession] = useState<SessionInfo | null>(null);

  useEffect(() => {
    loadLastSession();
  }, []);

  const loadLastSession = async () => {
    try {
      const raw = await AsyncStorage.getItem(LAST_SESSION_KEY);
      if (raw) {
        setLastSession(JSON.parse(raw));
      }
    } catch (error) {
      console.error('Error loading last session:', error);
    }
  };

  const openWebView = (url?: string) => {
    navigation.navigate('WebView', { initialUrl: url });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/images/CoreHyponoselogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Velkommen</Text>
        </View>

        {/* Dagens anbefaling */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dagens anbefaling</Text>
          <Text style={styles.cardDescription}>
            Start med en guidet session til mindfulness og metakognitiv træning
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => openWebView()}
          >
            <Text style={styles.primaryButtonText}>Start session →</Text>
          </TouchableOpacity>
        </View>

        {/* Fortsæt seneste session */}
        {lastSession && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Fortsæt seneste session</Text>
            <Text style={styles.sessionTitle}>{lastSession.title}</Text>
            <Text style={styles.sessionDate}>
              Sidst besøgt: {new Date(lastSession.timestamp).toLocaleDateString('da-DK', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => openWebView(lastSession.url)}
            >
              <Text style={styles.secondaryButtonText}>Fortsæt →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Denne app er et refleksionsværktøj til metakognitiv træning. Den er ikke en erstatning for professionel behandling eller terapi.
          </Text>
          <TouchableOpacity onPress={() => openWebView()}>
            <Text style={styles.disclaimerLink}>Læs mere →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    color: Colors.light.icon,
    marginBottom: 16,
    lineHeight: 22,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  secondaryButtonText: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  disclaimerText: {
    fontSize: 13,
    color: Colors.light.icon,
    lineHeight: 20,
    marginBottom: 8,
  },
  disclaimerLink: {
    fontSize: 14,
    color: Colors.light.tint,
    fontWeight: '600',
  },
});
