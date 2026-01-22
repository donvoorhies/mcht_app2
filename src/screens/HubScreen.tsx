/**
 * Hub Screen - Main navigation hub
 * Displays top-level menu of static hubs and app pages
 */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { t } from '../i18n';
import { hubs, appPages } from '../content';
import Footer from '../components/Footer';

type NavigationProp = NativeStackNavigationProp<any>;

// Top-level menu items (hubs + app pages)
const topLevelItems: Array<{ id: string; type: 'hub' | 'app' }> = [
  { id: 'start', type: 'hub' },
  { id: 'train', type: 'hub' },
  { id: 'stopcas', type: 'hub' },
  { id: 'test', type: 'hub' },
  { id: 'maintenance', type: 'hub' },
  { id: 'overview', type: 'app' },
  { id: 'info', type: 'app' },
];

export default function HubScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Handle navigation based on item type
  const handleItemPress = (id: string, type: 'hub' | 'app') => {
    if (type === 'hub') {
      navigation.navigate('HubDetail', { hubId: id });
    } else {
      navigation.navigate('AppPage', { pageId: id });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.hub.title}</Text>
        <Image
          source={require('../assets/images/MCHT-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Hub items */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {topLevelItems.map((item) => {
          const content = item.type === 'hub' ? hubs[item.id] : appPages[item.id];
          if (!content) return null;
          
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.hubItem}
              onPress={() => handleItemPress(item.id, item.type)}
              activeOpacity={0.7}
            >
              <View style={styles.hubItemContent}>
                <Text style={styles.hubItemTitle}>{content.title}</Text>
                {item.type === 'hub' && content.nextLinks && (
                  <Text style={styles.hubItemSubtitle}>
                    {content.nextLinks.length} trin
                  </Text>
                )}
              </View>
              <Text style={styles.hubItemArrow}>›</Text>
            </TouchableOpacity>
          );
        })}

        {/* Disclaimer card */}
        <TouchableOpacity
          style={styles.disclaimerCard}
          onPress={() => navigation.navigate('AppPage', { pageId: 'info' })}
          activeOpacity={0.7}
        >
          <Text style={styles.disclaimerTitle}>⚠️ Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            Denne app er et refleksionsværktøj til metakognitiv træning. Den er ikke en erstatning for professionel behandling eller terapi. Kontakt en kvalificeret fagperson hvis du har brug for professionel hjælp.
          </Text>
          <Text style={styles.disclaimerLink}>Læs fuld disclaimer →</Text>
        </TouchableOpacity>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  logo: {
    width: 60,
    height: 60,
  },
  cacheIndicator: {
    backgroundColor: '#ffa500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cacheIndicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ffeaa7',
  },
  errorBannerText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  hubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
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
  hubItemContent: {
    flex: 1,
  },
  hubItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  hubItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  hubItemArrow: {
    fontSize: 28,
    color: '#0a7ea4',
    marginLeft: 12,
  },
  disclaimerCard: {
    backgroundColor: '#fff9e6',
    padding: 20,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#ffc107',
    // Shadow for iOS
    shadowColor: '#ffc107',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  disclaimerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  disclaimerText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
    marginBottom: 12,
  },
  disclaimerLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0a7ea4',
  },
});
