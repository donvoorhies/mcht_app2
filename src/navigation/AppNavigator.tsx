import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingScreen from '../screens/OnboardingScreen';
import StartScreen from '../screens/StartScreen';
import WebViewScreen from '../screens/WebViewScreen';
import { onboardingStore } from '../stores/onboardingStore';

export type RootStackParamList = {
  Start: undefined;
  Onboarding: undefined;
  WebView: { initialUrl?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    let mounted = true;
    const checkOnboarding = async () => {
      try {
        const hasSeenOnboarding = await onboardingStore.getHasSeenOnboarding();
        if (!mounted) return;
        
        // If onboarding is done, go directly to WebView
        setInitialRoute(hasSeenOnboarding ? 'WebView' : 'Start');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        if (!mounted) return;
        setInitialRoute('Start');
      }
    };
    
    checkOnboarding();
    
    return () => {
      mounted = false;
    };
  }, []);

  if (initialRoute === null) {
    // Still checking onboarding status
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
          <ActivityIndicator size="large" color="#0a7ea4" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Start" component={StartScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="WebView" component={WebViewScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
