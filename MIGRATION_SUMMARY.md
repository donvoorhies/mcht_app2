# MCHT App - Migration Summary

## ✅ Completed Tasks

### 1. Migrated from Old Project
Successfully copied and adapted the following from `/home/don/mcht_app-clone`:

**Screens:**
- ✅ `OnboardingScreen.tsx` - Full onboarding flow with slides
- ✅ `OnboardingSlide.tsx` - Individual slide component
- ✅ `StartScreen.tsx` - Splash/start screen (newly created with auto-navigate)

**Supporting Files:**
- ✅ `onboardingStore.ts` - AsyncStorage-based persistence
- ✅ `theme.ts` - Colors and fonts constants
- ✅ `CoreHyponoselogo.png` - Logo asset

**Modifications:**
- Changed onboarding completion to navigate to `WebView` route instead of `MainTabs`
- Changed AsyncStorage key to `@mcht_app:onboarding_done` for consistency

---

### 2. Added Dependencies
Installed all required packages:
- ✅ `react-native-webview` - WebView component
- ✅ `@react-native-async-storage/async-storage` - Local storage
- ✅ `@react-navigation/native` - Navigation core
- ✅ `@react-navigation/native-stack` - Stack navigator
- ✅ `react-native-screens` - Native screen components

Note: `react-native-safe-area-context` was already installed.

---

### 3. App Flow & Navigation
Created `src/navigation/AppNavigator.tsx` with three routes:

1. **Start** → Splash screen with logo (auto-navigates to onboarding after 2s)
2. **Onboarding** → Multi-slide onboarding with skip/next buttons
3. **WebView** → Main app (WordPress WebView)

**Logic:**
- On first launch: `Start` → `Onboarding` → `WebView`
- On subsequent launches: `WebView` (direct)
- Onboarding completion sets `AsyncStorage` key and navigates to WebView

---

### 4. Configuration
Created `src/config.ts`:

```typescript
export const BASE_URL = 'https://example.com';
export const APP_PATH = '/app/';
export const WEB_APP_URL = `${BASE_URL}${APP_PATH}`;
```

**To deploy:**
1. Edit `src/config.ts`
2. Set `BASE_URL` to your WordPress site
3. Set `APP_PATH` to your app page path

---

### 5. WebView + Message Bridge
Created `src/screens/WebViewScreen.tsx` with full message protocol:

**From Web → Native:**
- `SAVE_REFLECTION` - Save/update reflection
- `GET_REFLECTIONS` - Retrieve reflections (all or by sessionId)
- `DELETE_REFLECTION` - Delete reflection by id
- `CLEAR_ALL` - Clear all reflections

**From Native → Web:**
- `SAVE_OK` - Confirmation
- `REFLECTIONS` - Array of reflections
- `DELETE_OK` - Confirmation
- `CLEAR_OK` - Confirmation
- `ERROR` - Error details

**Security:**
- `originWhitelist` restricts to `BASE_URL`
- `onShouldStartLoadWithRequest` prevents navigation outside `BASE_URL`
- `setSupportMultipleWindows={false}` prevents popups

**Storage:**
- AsyncStorage key: `mcht_reflections_v1`
- Data: JSON array of reflections
- Operations: Upsert (newest first), filter, delete, clear

---

### 6. Wired Everything Up
Updated `App.tsx` to render `AppNavigator` with proper navigation container.

Updated Android `MainActivity.kt` to support `react-native-screens`:
```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(null)
}
```

---

## 📁 Project Structure

```
mcht_app2/
├── src/
│   ├── assets/
│   │   └── images/
│   │       └── CoreHyponoselogo.png
│   ├── config.ts                  ← Configure BASE_URL here
│   ├── constants/
│   │   └── theme.ts
│   ├── navigation/
│   │   └── AppNavigator.tsx       ← Navigation stack
│   ├── screens/
│   │   ├── OnboardingScreen.tsx   ← Onboarding flow
│   │   ├── OnboardingSlide.tsx    ← Slide component
│   │   ├── StartScreen.tsx        ← Splash screen
│   │   └── WebViewScreen.tsx      ← WebView + bridge
│   └── stores/
│       └── onboardingStore.ts     ← Onboarding persistence
├── App.tsx                        ← Entry point
├── WEBVIEW_BRIDGE.md              ← Full documentation
└── MIGRATION_SUMMARY.md           ← This file
```

---

## 🚀 Next Steps

### 1. Configure WordPress URL
Edit `src/config.ts` and set your WordPress site URL:

```typescript
export const BASE_URL = 'https://your-wordpress-site.com';
export const APP_PATH = '/app/';
```

### 2. Implement Web-Side Message Handling
In your WordPress app, add message handling (see `WEBVIEW_BRIDGE.md` for examples):

```javascript
// Listen for native messages
document.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  // Handle SAVE_OK, REFLECTIONS, etc.
});

// Send messages to native
window.ReactNativeWebView.postMessage(JSON.stringify({
  type: 'SAVE_REFLECTION',
  payload: { id: '...', sessionId: '...', text: '...', createdAt: '...' }
}));
```

### 3. Test the Build
```bash
npm run android
```

### 4. Test Onboarding Flow
1. First launch should show: Start → Onboarding → WebView
2. Kill app and relaunch: Should go directly to WebView
3. To reset onboarding for testing, clear app data or programmatically clear AsyncStorage

### 5. Test Message Bridge
Once your WordPress app is deployed:
1. Open the app
2. Try saving a reflection from the web UI
3. Verify it's stored locally
4. Kill app and relaunch
5. Verify reflections are still there

---

## ✅ Validation

- ✅ TypeScript compiles without errors
- ✅ No missing imports
- ✅ Android build successful
- ✅ Code is minimal and production-ready
- ✅ All onboarding screens/components migrated
- ✅ Assets copied
- ✅ Navigation flow implemented
- ✅ WebView bridge with full protocol
- ✅ Local storage for reflections
- ✅ Comprehensive documentation

---

## 📚 Documentation

See [`WEBVIEW_BRIDGE.md`](./WEBVIEW_BRIDGE.md) for:
- Setting BASE_URL
- WebView message protocol with examples
- Onboarding persistence details
- Example web integration code
- Troubleshooting guide

---

## 🔧 Troubleshooting

If you encounter build issues:

```bash
# Clean Android build
cd android && ./gradlew clean
cd ..

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run android
```

If messages aren't working:
- Check `BASE_URL` in `src/config.ts`
- Verify web page is using `window.ReactNativeWebView.postMessage`
- Check console logs in both native and web

---

## 🎯 Summary

You now have a fully functional React Native app that:
1. Shows a splash screen on first launch
2. Presents onboarding slides (skipped on subsequent launches)
3. Loads your WordPress app in a WebView
4. Provides a two-way message bridge for reflections
5. Stores reflections locally using AsyncStorage
6. Restricts navigation to your WordPress site only

All code is TypeScript-first, minimal, clean, and Android-ready. The existing build system remains intact.
