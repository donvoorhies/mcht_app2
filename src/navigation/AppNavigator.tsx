import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppPageScreen from '../screens/AppPageScreen';
import CardScreen from '../screens/CardScreen';
import HubDetailScreen from '../screens/HubDetailScreen';
import HubScreen from '../screens/HubScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import ProcessCardScreen from '../screens/ProcessCardScreen';
import SessionsScreen from '../screens/SessionsScreen';
import StartScreen from '../screens/StartScreen';
import StaticPageScreen from '../screens/StaticPageScreen';
import WebViewScreen from '../screens/WebViewScreen';
import { onboardingStore } from '../stores/onboardingStore';

export type RootStackParamList = {
  Start: undefined;
  Onboarding: undefined;
  Hub: undefined;
  HubDetail: { hubId: string };
  ProcessCard: { processId: string; uid?: string };
  AppPage: { pageId: string };
  StaticPage: { slug: string };
  Sessions: { hubId: string } | undefined;
  Card: { uid: string };
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
        
        // If onboarding not done, show Onboarding, otherwise go to Hub
        setInitialRoute(hasSeenOnboarding ? 'Hub' : 'Onboarding');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        if (!mounted) return;
        setInitialRoute('Onboarding');
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
          <Stack.Screen name="Hub" component={HubScreen} />
          <Stack.Screen name="HubDetail" component={HubDetailScreen} />
          <Stack.Screen name="ProcessCard" component={ProcessCardScreen} />
          <Stack.Screen name="AppPage" component={AppPageScreen} />
          <Stack.Screen name="StaticPage" component={StaticPageScreen} />
          <Stack.Screen name="Sessions" component={SessionsScreen} />
          <Stack.Screen name="Card" component={CardScreen} />
          <Stack.Screen name="WebView" component={WebViewScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
