/**
 * MCHT App - Mindfulness & Clinical Hypnosis Training
 * 
 * APP OVERVIEW:
 *   - React Native app for Metacognitive Therapy (MCT) program
 *   - Combines static Danish UI with dynamic WordPress content
 *   - Tracks user progress through structured therapy program
 *   - Supports YouTube video embedding and offline caching
 * 
 * MAIN FEATURES:
 *   1. Onboarding: 4-slide introduction for new users
 *   2. Hub Navigation: 5 therapy phases + 2 app pages
 *   3. Progress Tracking: Automatic visit tracking with AsyncStorage
 *   4. WordPress Integration: Dynamic therapeutic content
 *   5. YouTube Support: Native video player for embedded videos
 *   6. Offline Support: Cached manifest and progress data
 * 
 * ARCHITECTURE:
 *   - Navigation: React Navigation (native stack)
 *   - State Management: AsyncStorage for persistence
 *   - Content: Hybrid static/dynamic model
 *   - WordPress: REST API integration
 *   - Video: react-native-youtube-iframe
 * 
 * TECH STACK:
 *   - React Native 0.83.1
 *   - TypeScript 5.8.3
 *   - React Navigation v6
 *   - AsyncStorage
 *   - react-native-youtube-iframe
 * 
 * ENTRY POINT:
 *   - index.js registers this component
 *   - App renders AppNavigator
 *   - AppNavigator checks onboarding status
 *   - Routes to Onboarding or Hub accordingly
 * 
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AppNavigator />
    </>
  );
}

export default App;
