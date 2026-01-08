import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { BASE_URL, WEB_APP_URL } from '../config';

const REFLECTIONS_KEY = 'mcht_reflections_v1';

interface Reflection {
  id: string;
  sessionId: string;
  text: string;
  createdAt: string;
}

type IncomingMessage =
  | { type: 'SAVE_REFLECTION'; payload: Reflection }
  | { type: 'GET_REFLECTIONS'; payload: { sessionId?: string } }
  | { type: 'DELETE_REFLECTION'; payload: { id: string } }
  | { type: 'CLEAR_ALL'; payload?: any };

type OutgoingMessage =
  | { type: 'SAVE_OK'; payload: { id: string } }
  | { type: 'REFLECTIONS'; payload: { items: Reflection[] } }
  | { type: 'DELETE_OK'; payload: { id: string } }
  | { type: 'CLEAR_OK'; payload?: any }
  | { type: 'ERROR'; payload: { code: string; message: string } };

export default function WebViewScreen() {
  const webViewRef = useRef<WebView>(null);

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
    [handleSaveReflection, handleGetReflections, handleDeleteReflection, handleClearAll, sendMessage]
  );

  const onShouldStartLoadWithRequest = useCallback((request: any) => {
    // Allow all http/https URLs to load within WebView
    const url = request.url.toLowerCase();
    return url.startsWith('http://') || url.startsWith('https://');
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_APP_URL }}
        onMessage={onMessage}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        allowsBackForwardNavigationGestures
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
