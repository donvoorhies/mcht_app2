# MCHT App - Quick Start Guide

## 🚀 Getting Started

### 1. Configure Your WordPress URL

Edit [`src/config.ts`](src/config.ts):

```typescript
export const BASE_URL = 'https://your-wordpress-site.com';
export const APP_PATH = '/app/';
```

Replace `https://your-wordpress-site.com` with your actual WordPress domain.

---

### 2. Run the App

```bash
# Start Metro bundler
npm start

# In another terminal, run Android
npm run android
```

---

### 3. Test the Flow

**First Launch:**
1. Splash screen appears (2 seconds)
2. Onboarding slides appear
3. Click "Næste" to advance or "Spring over" to skip
4. After last slide, click "Kom i gang"
5. WebView loads your WordPress app

**Subsequent Launches:**
- App opens directly to WebView (onboarding skipped)

---

### 4. Test the Message Bridge

In your WordPress app, add this code to test the bridge:

```javascript
// Test saving a reflection
function testSave() {
  window.ReactNativeWebView.postMessage(JSON.stringify({
    type: 'SAVE_REFLECTION',
    payload: {
      id: 'test-' + Date.now(),
      sessionId: 'session-123',
      text: 'This is a test reflection',
      createdAt: new Date().toISOString()
    }
  }));
}

// Test retrieving reflections
function testLoad() {
  window.ReactNativeWebView.postMessage(JSON.stringify({
    type: 'GET_REFLECTIONS',
    payload: {}
  }));
}

// Listen for responses
document.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  console.log('Native response:', message);
});

// For iOS compatibility
window.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  console.log('Native response:', message);
});
```

---

### 5. Reset Onboarding (For Testing)

To see onboarding again:

**Option A: Clear app data**
```bash
adb shell pm clear com.mchtapp
```

**Option B: Programmatically (add temporary button in WebView)**
```javascript
import { onboardingStore } from './src/stores/onboardingStore';
await onboardingStore.clear();
// Then restart the app
```

---

## 📖 Full Documentation

- **[WEBVIEW_BRIDGE.md](./WEBVIEW_BRIDGE.md)** - Complete message protocol, examples, and integration guide
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - What was migrated and how everything works

---

## 🔧 Common Issues

### "Unable to resolve module"
```bash
rm -rf node_modules
npm install
```

### Build fails
```bash
cd android && ./gradlew clean
cd ..
npm run android
```

### WebView shows blank page
- Check that `BASE_URL` is correct in `src/config.ts`
- Verify the URL is accessible from your device/emulator
- Check Chrome DevTools for web errors: `chrome://inspect`

### Messages not working
- Ensure you're using `window.ReactNativeWebView.postMessage` (not `window.postMessage`)
- Listen for both `message` and `document.message` events
- Check that messages are valid JSON

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/config.ts` | **← Edit this to set your WordPress URL** |
| `src/screens/WebViewScreen.tsx` | WebView and message handling |
| `src/navigation/AppNavigator.tsx` | Navigation logic |
| `src/screens/OnboardingScreen.tsx` | Onboarding flow |
| `src/stores/onboardingStore.ts` | Onboarding persistence |

---

## 🎯 App Flow

```
First Launch:
┌─────────────┐     ┌──────────────┐     ┌──────────┐
│ StartScreen │ ──> │  Onboarding  │ ──> │ WebView  │
│  (2 sec)    │     │   (slides)   │     │(WordPress)│
└─────────────┘     └──────────────┘     └──────────┘

Subsequent Launches:
┌──────────┐
│ WebView  │
│(WordPress)│
└──────────┘
```

---

## ✅ What's Included

- ✅ Start/Splash screen with logo
- ✅ Multi-slide onboarding (Danish language)
- ✅ Onboarding persistence (shows once)
- ✅ WebView with WordPress integration
- ✅ Message bridge for reflections
- ✅ Local storage (AsyncStorage)
- ✅ Navigation security (locked to BASE_URL)
- ✅ TypeScript support
- ✅ Android-ready

---

Happy coding! 🎉
