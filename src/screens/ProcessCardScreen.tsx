/**
 * ProcessCardScreen - Display process card content + WordPress card (WebView)
 * Shows Danish intro text from content layer, then loads therapeutic content from WordPress
 * Uses manifest to get dynamic UIDs (no hardcoded UIDs needed)
 */

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { processCards } from '../content';
import { getFinalUid } from '../content/contentManifestMapper';
import { getManifest } from '../manifest/manifest.service';
import { BASE_URL } from '../config';
import { t } from '../i18n';
import Footer from '../components/Footer';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { progressStore } from '../stores/progressStore';

type NavigationProp = NativeStackNavigationProp<any>;
type ProcessCardRouteProp = RouteProp<{ ProcessCard: { processId: string; uid?: string } }, 'ProcessCard'>;

type CardContent = {
  uid: string;
  title: string;
  content: string;
  contentHtml?: string;
  phase?: string;
  durationMin?: number;
};

export default function ProcessCardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ProcessCardRouteProp>();
  const { processId, uid: paramUid } = route.params;
  
  const processContent = processCards[processId];
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [card, setCard] = useState<CardContent | null>(null);
  const [finalUid, setFinalUid] = useState<string | undefined>(undefined);

  // Track process card visit
  React.useEffect(() => {
    if (processId) {
      progressStore.markProcessCardVisited(processId);
    }
  }, [processId]);

  // Load manifest and determine final UID
  useEffect(() => {
    async function loadManifestAndUid() {
      try {
        const manifestResult = await getManifest();
        const manifest = manifestResult.manifest;
        
        // Get UID from manifest or fallback to param
        const uid = getFinalUid(processContent, processId, manifest) || paramUid;
        
        setFinalUid(uid);
        
        // Fetch WordPress content if we have a valid UID
        if (uid && !uid.startsWith('TODO-UID')) {
          await fetchCard(uid);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('[ProcessCardScreen] Error loading manifest:', err);
        setLoading(false);
      }
    }
    
    loadManifestAndUid();
  }, [processId, paramUid]);

  const fetchCard = async (cardUid: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${BASE_URL}wp-json/mct/v1/cards/${cardUid}`;
      console.log('[ProcessCardScreen] Fetching card:', url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[ProcessCardScreen] Card loaded:', data.title);
      
      setCard(data);
    } catch (err) {
      console.error('[ProcessCardScreen] Error fetching card:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Extract YouTube URLs from HTML
  const extractYouTubeUrls = (html: string): string[] => {
    const urls: string[] = [];
    const iframePattern = /src=["']([^"']*(?:youtube\.com|youtube-nocookie\.com)[^"']*)["']/gi;
    let match;
    
    while ((match = iframePattern.exec(html)) !== null) {
      urls.push(match[1]);
    }
    
    return urls;
  };

  // Remove YouTube iframes from HTML
  const removeYouTubeIframes = (html: string): string => {
    return html.replace(/<iframe[^>]*(?:youtube\.com|youtube-nocookie\.com)[^>]*>.*?<\/iframe>/gi, '');
  };

  if (!processContent) {
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

  const shouldFetchWordPress = finalUid && !finalUid.startsWith('TODO-UID');
  
  // Extract YouTube URLs and clean HTML
  const youtubeUrls = card ? extractYouTubeUrls(card.contentHtml || card.content || '') : [];
  const cleanedHtml = card ? removeYouTubeIframes(card.contentHtml || card.content || '') : '';
  
  const htmlContent = cleanedHtml && card ? `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          padding: 20px;
          margin: 0;
          line-height: 1.6;
          color: #333;
          background-color: #f9f9f9;
        }
        h1, h2, h3 { color: #0a7ea4; margin-top: 1em; }
        p { margin-bottom: 1em; }
        a { color: #0a7ea4; }
        img { max-width: 100%; height: auto; }
      </style>
    </head>
    <body>
      ${cleanedHtml}
    </body>
    </html>
  ` : '';

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

      {/* Danish intro content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.title}>{processContent.title}</Text>

        {/* Body paragraphs */}
        {processContent.paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}

        {/* Bullets (if any) */}
        {processContent.bullets && processContent.bullets.length > 0 && (
          <View style={styles.bulletsContainer}>
            {processContent.bullets.map((bullet, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Loading state for WordPress card */}
        {loading && shouldFetchWordPress && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0a7ea4" />
            <Text style={styles.loadingText}>{t.card.loading}</Text>
          </View>
        )}

        {/* Error state */}
        {error && !loading && shouldFetchWordPress && (
          <View style={styles.errorMessageContainer}>
            <Text style={styles.errorTitle}>{t.card.error}</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => finalUid && fetchCard(finalUid)}
            >
              <Text style={styles.retryButtonText}>Prøv igen</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* YouTube Videos */}
        {card && !loading && !error && shouldFetchWordPress && youtubeUrls.map((url, index) => (
          <YouTubeEmbed key={index} url={url} height={220} />
        ))}

        {/* WordPress Card WebView (without YouTube iframes) */}
        {card && !loading && !error && shouldFetchWordPress && cleanedHtml && (
          <View style={styles.webViewContainer}>
            <WebView
              source={{ html: htmlContent }}
              style={styles.webView}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              mixedContentMode="compatibility"
              originWhitelist={['*']}
              useWebKit={true}
            />
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
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
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
  errorMessageContainer: {
    padding: 20,
    backgroundColor: '#fee',
    borderRadius: 8,
    marginTop: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#c33',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#c33',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0a7ea4',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#256f86',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  webViewContainer: {
    minHeight: 400,
    backgroundColor: '#f9f9f9',
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  webView: {
    minHeight: 400,
    backgroundColor: 'transparent',
  },
});
