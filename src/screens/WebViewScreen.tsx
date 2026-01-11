import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useRef } from 'react';
import { ActivityIndicator, Linking, Platform, StyleSheet, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { ALLOWED_DOMAINS, BASE_URL, WEB_APP_URL } from '../config';
import type { IncomingMessage, OutgoingMessage, Reflection, SessionInfo } from '../types/webview';
import { getInjectedJavaScript } from '../utils/webViewInjection';

const REFLECTIONS_KEY = 'mcht_reflections_v1';
const LAST_SESSION_KEY = 'mcht_last_session';

export default function WebViewScreen() {
  const route = useRoute<any>();
  const webViewRef = useRef<WebView>(null);
  
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
    [handleSaveReflection, handleGetReflections, handleDeleteReflection, handleClearAll, handleSessionStarted, handleGetLastSession, sendMessage]
  );

  const onShouldStartLoadWithRequest = useCallback((request: any) => {
    const url = request.url.toLowerCase();
    
    // Handle app:// protocol for navigating to native screens
    // Example: app://session/start?id=session1&title=Session%201
    if (url.startsWith('app://')) {
      const appUrl = request.url.replace('app://', '');
      console.log('[MCHT] App navigation requested:', appUrl);
      
      // Parse URL - for now just log, we can implement navigation later
      // This allows WordPress to trigger navigation to app screens
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
      return false; // Don't load in WebView
    }
    
    // Check if URL is from allowed domains (stay in WebView)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const urlObj = new URL(request.url);
        const hostname = urlObj.hostname.replace('www.', '');
        
        // Check if this domain is allowed to load in WebView
        const isAllowedDomain = ALLOWED_DOMAINS.some(domain => 
          hostname === domain || hostname.endsWith('.' + domain)
        );
        
        if (isAllowedDomain) {
          // Load in WebView
          return true;
        } else {
          // External link - open in browser
          console.log('[MCHT] Opening external URL in browser:', request.url);
          Linking.openURL(request.url).catch(err => 
            console.error('[MCHT] Failed to open external URL:', err)
          );
          return false;
        }
      } catch (err) {
        console.error('[MCHT] Error parsing URL:', err);
        return true; // Default to WebView on error
      }
    }
    
    // Allow other URLs to load in WebView
    return true;
  }, [sendMessage]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: initialUrl }}
        onMessage={onMessage}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
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
});
