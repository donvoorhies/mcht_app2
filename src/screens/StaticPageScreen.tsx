/**
 * StaticPageScreen - Generic screen for displaying static hub, process, and app pages
 * Renders content from staticPages.da.ts based on slug
 */

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getPageBySlug } from '../content/staticPages.da';

type NavigationProp = NativeStackNavigationProp<any>;
type StaticPageRouteProp = RouteProp<{ StaticPage: { slug: string } }, 'StaticPage'>;

export default function StaticPageScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<StaticPageRouteProp>();
  const { slug } = route.params;
  
  const page = getPageBySlug(slug);

  if (!page) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>‹ Tilbage</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Siden blev ikke fundet</Text>
          <Text style={styles.errorSlug}>{slug}</Text>
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
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.title}>{page.title}</Text>

        {/* Body paragraphs */}
        {page.body.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}

        {/* Links (for hub pages) */}
        {page.links && page.links.length > 0 && (
          <View style={styles.linksContainer}>
            {page.links.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.linkButton}
                onPress={() => navigation.navigate('StaticPage', { slug: link.slug })}
                activeOpacity={0.7}
              >
                <Text style={styles.linkButtonText}>{link.title}</Text>
                <Text style={styles.linkButtonArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 12,
  },
  backText: {
    fontSize: 28,
    color: '#0a7ea4',
    fontWeight: '300',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
  },
  linksContainer: {
    marginTop: 24,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  linkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  linkButtonArrow: {
    fontSize: 24,
    color: '#0a7ea4',
    marginLeft: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSlug: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
