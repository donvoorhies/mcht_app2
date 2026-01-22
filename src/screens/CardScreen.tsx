/**
 * CardScreen - Display therapeutic card content from WordPress
 * Fetches content from /wp-json/mct/v1/cards/{uid}
 */

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { BASE_URL } from '../config';
import { t } from '../i18n';

type NavigationProp = NativeStackNavigationProp<any>;
type CardRouteProp = RouteProp<{ Card: { uid: string } }, 'Card'>;

type CardContent = {
  uid: string;
  title: string;
  contentHtml: string;
  phase?: string;
  durationMin?: number;
};

export default function CardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CardRouteProp>();
  const { uid } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [card, setCard] = useState<CardContent | null>(null);

  useEffect(() => {
    fetchCard();
  }, [uid]);

  const fetchCard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${BASE_URL}wp-json/mct/v1/cards/${uid}`;
      console.log('[CardScreen] Fetching card:', url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[CardScreen] Card loaded:', data.title);
      
      setCard(data);
    } catch (err) {
      console.error('[CardScreen] Error fetching card:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text style={styles.loadingText}>{t.card.loading}</Text>
      </View>
    );
  }

  if (error || !card) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>{t.card.error}</Text>
        <Text style={styles.errorMessage}>{error || t.card.notFound}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCard}>
          <Text style={styles.retryButtonText}>{t.common.retry}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Tilbage</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render HTML content in WebView
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #333;
          padding: 20px;
          background-color: #fff;
        }
        h1, h2, h3, h4, h5, h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
          line-height: 1.3;
        }
        h1 { font-size: 1.8em; }
        h2 { font-size: 1.5em; }
        h3 { font-size: 1.3em; }
        p {
          margin-bottom: 1em;
        }
        ul, ol {
          margin-left: 1.5em;
          margin-bottom: 1em;
        }
        li {
          margin-bottom: 0.5em;
        }
        img {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
        }
        a {
          color: #0a7ea4;
          text-decoration: none;
        }
        blockquote {
          border-left: 4px solid #0a7ea4;
          padding-left: 1em;
          margin: 1em 0;
          color: #666;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      ${card.contentHtml}
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackButton}>
          <Text style={styles.backText}>‹ Tilbage</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{card.title}</Text>
          {card.durationMin && (
            <Text style={styles.headerDuration}>{card.durationMin} min</Text>
          )}
        </View>
      </View>

      {/* Content */}
      <WebView
        source={{ html: htmlContent }}
        style={styles.webView}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerBackButton: {
    marginRight: 12,
  },
  backText: {
    fontSize: 28,
    color: '#0a7ea4',
    fontWeight: '300',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerDuration: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
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
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  webView: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
