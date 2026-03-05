/**
 * Entry point for the MCHT React Native application
 * 
 * INITIALIZATION:
 *   - Imports App component from App.tsx
 *   - Registers app with React Native AppRegistry
 *   - App name comes from app.json ("mchtapp")
 * 
 * STARTUP FLOW:
 *   1. React Native loads this file
 *   2. AppRegistry.registerComponent() called
 *   3. App component rendered
 *   4. App renders AppNavigator
 *   5. AppNavigator checks onboarding status
 *   6. User sees either OnboardingScreen or HubScreen
 * 
 * DO NOT MODIFY:
 *   - This is standard React Native bootstrap code
 *   - Changes here rarely needed
 *   - App logic should go in App.tsx or src/ files
 * 
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
