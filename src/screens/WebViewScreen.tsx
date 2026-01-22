import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { ALLOWED_DOMAINS, BASE_URL, WEB_APP_URL } from '../config';
import { t } from '../i18n';
import type { IncomingMessage, OutgoingMessage, Reflection, SessionInfo } from '../types/webview';
import { getInjectedJavaScript } from '../utils/webViewInjection';

const REFLECTIONS_KEY = 'mcht_reflections_v1';
const LAST_SESSION_KEY = 'mcht_last_session';

type NavigationProp = NativeStackNavigationProp<any>;

export default function WebViewScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const webViewRef = useRef<WebView>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  
  // Get initial URL from navigation params or use default
  const initialUrl = route.params?.initialUrl 
    ? (route.params.initialUrl.startsWith('http') 
        ? route.params.initialUrl 
        : `${BASE_URL}${route.params.initialUrl}`)
    : WEB_APP_URL;

  // Platform-specific injected JavaScript
  const injectedJavaScript = useMemo(
    () => getInjectedJavaScript(Platform.OS as 'ios' | 'android'),
    []
  );

  const sendMessage = useCallback((message: OutgoingMessage) => {
    webViewRef.current?.postMessage(JSON.stringify(message));
  }, []);

  const handleSaveReflection = useCallback(
    async (reflection: Reflection) => {
      try {
        const raw = await AsyncStorage.getItem(REFLECTIONS_KEY);
        const existing: Reflection[] = raw ? JSON.parse(raw) : [];

        // Upsert: remove old entry with same id, add new at beginning
        const filtered = existing.filter((r) => r.id !== reflection.id);
        const updated = [reflection, ...filtered];

        await AsyncStorage.setItem(REFLECTIONS_KEY, JSON.stringify(updated));
        sendMessage({ type: 'SAVE_OK', payload: { id: reflection.id } });
      } catch (error) {
        console.error('Error saving reflection:', error);
        sendMessage({
          type: 'ERROR',
          payload: { code: 'SAVE_ERROR', message: 'Failed to save reflection' },
        });
      }
    },
    [sendMessage]
  );

  const handleGetReflections = useCallback(
    async (sessionId?: string) => {
      try {
        const raw = await AsyncStorage.getItem(REFLECTIONS_KEY);
        const all: Reflection[] = raw ? JSON.parse(raw) : [];

        const items = sessionId ? all.filter((r) => r.sessionId === sessionId) : all;

        sendMessage({ type: 'REFLECTIONS', payload: { items } });
      } catch (error) {
        console.error('Error getting reflections:', error);
        sendMessage({
          type: 'ERROR',
          payload: { code: 'GET_ERROR', message: 'Failed to retrieve reflections' },
        });
      }
    },
    [sendMessage]
  );

  const handleDeleteReflection = useCallback(
    async (id: string) => {
      try {
        const raw = await AsyncStorage.getItem(REFLECTIONS_KEY);
        const existing: Reflection[] = raw ? JSON.parse(raw) : [];
        const updated = existing.filter((r) => r.id !== id);

        await AsyncStorage.setItem(REFLECTIONS_KEY, JSON.stringify(updated));
        sendMessage({ type: 'DELETE_OK', payload: { id } });
      } catch (error) {
        console.error('Error deleting reflection:', error);
        sendMessage({
          type: 'ERROR',
          payload: { code: 'DELETE_ERROR', message: 'Failed to delete reflection' },
        });
      }
    },
    [sendMessage]
  );

  const handleClearAll = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(REFLECTIONS_KEY);
      sendMessage({ type: 'CLEAR_OK' });
    } catch (error) {
      console.error('Error clearing reflections:', error);
      sendMessage({
        type: 'ERROR',
        payload: { code: 'CLEAR_ERROR', message: 'Failed to clear reflections' },
      });
    }
  }, [sendMessage]);

  const handleSessionStarted = useCallback(
    async (sessionData: { id: string; title: string; url?: string }) => {
      try {
        const sessionInfo: SessionInfo = {
          id: sessionData.id,
          title: sessionData.title,
          url: sessionData.url || '',
          timestamp: new Date().toISOString(),
        };
        
        await AsyncStorage.setItem(LAST_SESSION_KEY, JSON.stringify(sessionInfo));
        sendMessage({ type: 'SESSION_SAVED' });
      } catch (error) {
        console.error('Error saving session:', error);
        sendMessage({
          type: 'ERROR',
          payload: { code: 'SESSION_ERROR', message: 'Failed to save session' },
        });
      }
    },
    [sendMessage]
  );

  const handleGetLastSession = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(LAST_SESSION_KEY);
      const sessionInfo: SessionInfo | null = raw ? JSON.parse(raw) : null;
      
      sendMessage({ type: 'LAST_SESSION', payload: sessionInfo });
    } catch (error) {
      console.error('Error getting last session:', error);
      sendMessage({
        type: 'ERROR',
        payload: { code: 'GET_SESSION_ERROR', message: 'Failed to retrieve last session' },
      });
    }
  }, [sendMessage]);

  // Handle OPEN_CARD message from WebView
  const handleOpenCard = useCallback(
    (uid: string) => {
      // Navigate to card endpoint
      const cardUrl = `${BASE_URL}wp-json/mct/v1/cards/${uid}`;
      console.log('[MCHT] Opening card:', uid, cardUrl);
      
      // Update current URL and reload WebView
      if (webViewRef.current) {
        setCurrentUrl(cardUrl);
        webViewRef.current.injectJavaScript(`window.location.href = '${cardUrl}';`);
      }
    },
    []
  );

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const message: IncomingMessage = JSON.parse(event.nativeEvent.data);

        switch (message.type) {
          case 'SAVE_REFLECTION':
            handleSaveReflection(message.payload);
            break;
          case 'GET_REFLECTIONS':
            handleGetReflections(message.payload?.sessionId);
            break;
          case 'DELETE_REFLECTION':
            handleDeleteReflection(message.payload.id);
            break;
          case 'CLEAR_ALL':
            handleClearAll();
            break;
          case 'SESSION_STARTED':
            handleSessionStarted(message.payload);
            break;
          case 'GET_LAST_SESSION':
            handleGetLastSession();
            break;
          case 'OPEN_CARD':
            // Handle OPEN_CARD message from WebView
            if (message.payload && message.payload.uid) {
              handleOpenCard(message.payload.uid);
            }
            break;
          default:
            console.warn('Unknown message type:', (message as any).type);
        }
      } catch (error) {
        console.error('Error handling message:', error);
        sendMessage({
          type: 'ERROR',
          payload: { code: 'PARSE_ERROR', message: 'Failed to parse message' },
        });
      }
    },
    [handleSaveReflection, handleGetReflections, handleDeleteReflection, handleClearAll, handleSessionStarted, handleGetLastSession, handleOpenCard, sendMessage]
  );

  const handleRetry = useCallback(() => {
    setHasError(false);
    setErrorMessage(null);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  }, []);

  const handleOpenInBrowser = useCallback(() => {
    const urlToOpen = currentUrl || initialUrl;
    Linking.openURL(urlToOpen).catch(err =>
      console.error('[MCHT] Failed to open URL in browser:', err)
    );
  }, [currentUrl, initialUrl]);

  const onError = useCallback((syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('[MCHT] WebView error:', nativeEvent);
    
    setHasError(true);
    
    // Determine error message based on error code
    let message: string = t.webview.errorGeneric;
    if (nativeEvent.description) {
      const desc = nativeEvent.description.toLowerCase();
      if (desc.includes('network') || desc.includes('internet') || desc.includes('connection')) {
        message = t.webview.errorOffline;
      } else if (desc.includes('timeout')) {
        message = t.webview.errorTimeout;
      }
    }
    
    setErrorMessage(message);
  }, []);

  const onLoadStart = useCallback(() => {
    setHasError(false);
    setErrorMessage(null);
  }, []);

  const onShouldStartLoadWithRequest = useCallback((request: any) => {
    const url = request.url.toLowerCase();
    
    // Handle app:// protocol for navigating to native screens
    if (url.startsWith('app://')) {
      const appUrl = request.url.replace('app://', '');
      console.log('[MCHT] App navigation requested:', appUrl);
      
      sendMessage({
        type: 'ERROR',
        payload: { 
          code: 'APP_NAV', 
          message: `App navigation not yet implemented: ${appUrl}` 
        },
      });
      return false;
    }
    
    // Handle special URL schemes (tel:, mailto:, sms:, etc.) with native apps
    if (url.startsWith('tel:') || 
        url.startsWith('mailto:') || 
        url.startsWith('sms:') || 
        url.startsWith('whatsapp:') ||
        url.startsWith('maps:') ||
        url.startsWith('geo:')) {
      Linking.openURL(request.url).catch(err => 
        console.error('[MCHT] Failed to open URL:', err)
      );
      return false;
    }
    
    // Check if URL is from allowed domains (stay in WebView)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const urlObj = new URL(request.url);
        const hostname = (urlObj as any).hostname?.replace('www.', '') || '';
        
        const isAllowedDomain = ALLOWED_DOMAINS.some(domain => 
          hostname === domain || hostname.endsWith('.' + domain)
        );
        
        if (isAllowedDomain) {
          setCurrentUrl(request.url);
          return true;
        } else {
          console.log('[MCHT] Opening external URL in browser:', request.url);
          Linking.openURL(request.url).catch(err => 
            console.error('[MCHT] Failed to open external URL:', err)
          );
          return false;
        }
      } catch (err) {
        console.error('[MCHT] Error parsing URL:', err);
        return true;
      }
    }
    
    return true;
  }, [sendMessage]);

  // Show error view if WebView failed to load
  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>{t.webview.errorTitle}</Text>
        <Text style={styles.errorMessage}>
          {errorMessage || t.webview.errorMessage}
        </Text>
        <View style={styles.errorActions}>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>{t.common.retry}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.browserButton} onPress={handleOpenInBrowser}>
            <Text style={styles.browserButtonText}>{t.common.openInBrowser}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: initialUrl }}
        onMessage={onMessage}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onError={onError}
        onLoadStart={onLoadStart}
        injectedJavaScript={injectedJavaScript}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        allowsBackForwardNavigationGestures
        {...(Platform.OS === 'android' && {
          allowFileAccess: true,
          allowFileAccessFromFileURLs: true,
          allowUniversalAccessFromFileURLs: true,
          mixedContentMode: 'always',
        })}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0a7ea4" />
            <Text style={styles.loadingText}>{t.webview.loading}</Text>
          </View>
        )}
        startInLoadingState
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorActions: {
    flexDirection: 'row',
    gap: 12,
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
  browserButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browserButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
