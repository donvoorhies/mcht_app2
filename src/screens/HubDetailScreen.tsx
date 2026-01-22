/**
 * HubDetailScreen - Display hub content with links to process cards
 */

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { hubs, processCards } from '../content';
import Footer from '../components/Footer';
import { progressStore } from '../stores/progressStore';

type NavigationProp = NativeStackNavigationProp<any>;
type HubDetailRouteProp = RouteProp<{ HubDetail: { hubId: string } }, 'HubDetail'>;

export default function HubDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<HubDetailRouteProp>();
  const { hubId } = route.params;
  
  const hub = hubs[hubId];

  // Track hub visit
  React.useEffect(() => {
    if (hubId) {
      progressStore.markHubVisited(hubId);
    }
  }, [hubId]);

  if (!hub) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>‹ Tilbage</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>(Indhold mangler)</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Tilbage</Text>
        </TouchableOpacity>
        <Image
          source={require('../assets/images/MCHT-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.title}>{hub.title}</Text>

        {/* Body paragraphs */}
        {hub.paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}

        {/* Bullets (if any) */}
        {hub.bullets && hub.bullets.length > 0 && (
          <View style={styles.bulletsContainer}>
            {hub.bullets.map((bullet, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Next links */}
        {hub.nextLinks && hub.nextLinks.length > 0 && (
          <View style={styles.linksContainer}>
            <Text style={styles.linksTitle}>Videre herfra:</Text>
            {hub.nextLinks.map((link, index) => {
              const processCard = processCards[link.target];
              const uid = processCard?.uid;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.linkButton}
                  onPress={() => navigation.navigate('ProcessCard', { 
                    processId: link.target,
                    uid: uid 
                  })}
                  activeOpacity={0.7}
                >
                  <Text style={styles.linkButtonText}>{link.label}</Text>
                  <Text style={styles.linkButtonArrow}>›</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 8,
  },
  backText: {
    fontSize: 18,
    color: '#0a7ea4',
    fontWeight: '600',
  },
  logo: {
    width: 50,
    height: 50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 16,
  },
  bulletsContainer: {
    marginBottom: 20,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletDot: {
    fontSize: 16,
    color: '#555',
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  linksContainer: {
    marginTop: 24,
  },
  linksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  linkButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    // Shadow for iOS
    shadowColor: '#256f86',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  linkButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  linkButtonArrow: {
    fontSize: 20,
    color: '#0a7ea4',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
});
