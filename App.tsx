/**
 * MCHT App - Mindfulness & Clinical Hypnosis Training
 * Android-first minimal native shell with WebView
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
