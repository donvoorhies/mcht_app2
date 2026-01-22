/**
 * AppPageScreen - Display app pages (overview, info)
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
import { appPages } from '../content';
import ContactBox from '../components/ContactBox';
import TextWithLinks from '../components/TextWithLinks';
import Footer from '../components/Footer';
import OverviewScreen from './OverviewScreen';

type NavigationProp = NativeStackNavigationProp<any>;
type AppPageRouteProp = RouteProp<{ AppPage: { pageId: string } }, 'AppPage'>;

export default function AppPageScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AppPageRouteProp>();
  const { pageId } = route.params;
  
  const page = appPages[pageId];

  // Use dedicated OverviewScreen for overview page
  if (pageId === 'overview') {
    return <OverviewScreen />;
  }

  if (!page) {
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
        <Text style={styles.title}>{page.title}</Text>

        {/* Body paragraphs */}
        {page.paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}

        {/* Bullets (if any) */}
        {page.bullets && page.bullets.length > 0 && (
          <View style={styles.bulletsContainer}>
            {page.bullets.map((bullet, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Paragraphs after bullets (if any) */}
        {page.paragraphsAfterBullets && page.paragraphsAfterBullets.map((paragraph, index) => (
          <TextWithLinks key={`after-${index}`} style={styles.paragraph}>
            {paragraph}
          </TextWithLinks>
        ))}

        {/* Contact box on INFO page */}
        {pageId === 'info' && <ContactBox />}
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
