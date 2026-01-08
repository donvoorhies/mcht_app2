# MCHT App - WebView Bridge & Configuration

This document describes how to configure the app, use the WebView message protocol, and understand onboarding persistence.

---

## Setting BASE_URL

The app loads a WordPress site in a WebView. Configure the URL in [`src/config.ts`](src/config.ts):

```typescript
export const BASE_URL = 'https://your-wordpress-site.com';
export const APP_PATH = '/app/';
```

- **BASE_URL**: Your WordPress installation domain (e.g., `https://mcht.example.com`)
- **APP_PATH**: The path to your app page (default: `/app/`)

The WebView will load `${BASE_URL}${APP_PATH}` and restrict navigation to URLs starting with `BASE_URL`.

---

## WebView Message Protocol

The app communicates with the WordPress web app using `postMessage`. All messages are JSON objects with `type` and `payload` fields.

### From Web → Native (incoming)

Send messages from your WordPress/web app using:

```javascript
window.ReactNativeWebView.postMessage(JSON.stringify({
  type: 'MESSAGE_TYPE',
  payload: { /* data */ }
}));
```

#### Supported message types:

**1. SAVE_REFLECTION**  
Save or update a reflection.

```javascript
window.ReactNativeWebView.postMessage(JSON.stringify({
  type: 'SAVE_REFLECTION',
  payload: {
    id: 'unique-id-123',
    sessionId: 'session-456',
    text: 'This is my reflection...',
    createdAt: '2026-01-03T12:00:00.000Z'
  }
}));
```

- If a reflection with the same `id` exists, it will be updated.
- Reflections are stored newest-first.

**2. GET_REFLECTIONS**  
Retrieve all reflections, or filter by `sessionId`.

```javascript
// Get all reflections
window.ReactNativeWebView.postMessage(JSON.stringify({
  type: 'GET_REFLECTIONS',
  payload: {}
}));

// Get reflections for a specific session
window.ReactNativeWebView.postMessage(JSON.stringify({
  type: 'GET_REFLECTIONS',
  payload: { sessionId: 'session-456' }
}));
```

**3. DELETE_REFLECTION**  
Delete a reflection by `id`.

```javascript
window.ReactNativeWebView.postMessage(JSON.stringify({
  type: 'DELETE_REFLECTION',
  payload: { id: 'unique-id-123' }
}));
```

**4. CLEAR_ALL**  
Clear all reflections from storage.

```javascript
window.ReactNativeWebView.postMessage(JSON.stringify({
  type: 'CLEAR_ALL'
}));
```

---

### From Native → Web (outgoing)

Listen for messages in your web app:

```javascript
document.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  console.log('Received from native:', message);
});

// For iOS
window.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  console.log('Received from native:', message);
});
```

#### Response message types:

**1. SAVE_OK**  
Confirmation that a reflection was saved.

```javascript
{ type: 'SAVE_OK', payload: { id: 'unique-id-123' } }
```

**2. REFLECTIONS**  
Array of reflections (response to `GET_REFLECTIONS`).

```javascript
{
  type: 'REFLECTIONS',
  payload: {
    items: [
      {
        id: 'unique-id-123',
        sessionId: 'session-456',
        text: 'My reflection text...',
        createdAt: '2026-01-03T12:00:00.000Z'
      },
      // ... more reflections
    ]
  }
}
```

**3. DELETE_OK**  
Confirmation that a reflection was deleted.

```javascript
{ type: 'DELETE_OK', payload: { id: 'unique-id-123' } }
```

**4. CLEAR_OK**  
Confirmation that all reflections were cleared.

```javascript
{ type: 'CLEAR_OK' }
```

**5. ERROR**  
Error occurred during processing.

```javascript
{
  type: 'ERROR',
  payload: {
    code: 'SAVE_ERROR',
    message: 'Failed to save reflection'
  }
}
```

Error codes: `SAVE_ERROR`, `GET_ERROR`, `DELETE_ERROR`, `CLEAR_ERROR`, `PARSE_ERROR`

---

## Onboarding Persistence

The app shows onboarding slides on first launch. Once completed, the user is taken directly to the WebView on subsequent launches.

### How it works:

1. **First launch**: `Start` screen → `Onboarding` screen → `WebView` screen
2. **Subsequent launches**: `WebView` screen (onboarding skipped)

### Storage key:

The onboarding state is stored in `AsyncStorage` with key:
```
@mcht_app:onboarding_done
```

Value: `"1"` (seen) or `"0"` (not seen)

### Resetting onboarding (for testing):

You can clear onboarding state programmatically:

```typescript
import { onboardingStore } from './src/stores/onboardingStore';

// Clear onboarding state
await onboardingStore.clear();
```

Or manually delete the AsyncStorage key using React Native Debugger or similar tools.

---

## Local Storage Schema

### Reflections storage key:
```
mcht_reflections_v1
```

### Data structure:
```typescript
interface Reflection {
  id: string;           // Unique identifier
  sessionId: string;    // Session/program identifier
  text: string;         // Reflection content
  createdAt: string;    // ISO 8601 timestamp
}

// Stored as JSON array:
Reflection[]
```

Reflections are stored as a JSON-serialized array in `AsyncStorage`. The array is sorted with newest reflections first.

---

## Example Web Integration

Here's a complete example for your WordPress/web app:

```html
<!DOCTYPE html>
<html>
<head>
  <title>MCHT Web App</title>
</head>
<body>
  <h1>Reflection Entry</h1>
  <textarea id="reflectionText" rows="5" cols="50"></textarea><br>
  <button onclick="saveReflection()">Save Reflection</button>
  <button onclick="loadReflections()">Load Reflections</button>
  <div id="reflections"></div>

  <script>
    // Listen for messages from native app
    document.addEventListener('message', handleNativeMessage);
    window.addEventListener('message', handleNativeMessage);

    function handleNativeMessage(event) {
      const message = JSON.parse(event.data);
      console.log('Native message:', message);

      if (message.type === 'SAVE_OK') {
        alert('Reflection saved!');
        loadReflections();
      } else if (message.type === 'REFLECTIONS') {
        displayReflections(message.payload.items);
      } else if (message.type === 'ERROR') {
        alert('Error: ' + message.payload.message);
      }
    }

    function saveReflection() {
      const text = document.getElementById('reflectionText').value;
      const reflection = {
        id: 'ref-' + Date.now(),
        sessionId: 'session-123',
        text: text,
        createdAt: new Date().toISOString()
      };

      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'SAVE_REFLECTION',
        payload: reflection
      }));
    }

    function loadReflections() {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'GET_REFLECTIONS',
        payload: {}
      }));
    }

    function displayReflections(items) {
      const container = document.getElementById('reflections');
      container.innerHTML = '<h2>Your Reflections:</h2>';
      items.forEach(item => {
        container.innerHTML += `
          <div>
            <strong>${item.createdAt}</strong>: ${item.text}
          </div>
        `;
      });
    }

    // Load reflections on page load
    window.onload = () => {
      if (window.ReactNativeWebView) {
        loadReflections();
      }
    };
  </script>
</body>
</html>
```

---

## Building & Running

### Android:

```bash
npm run android
```

Or:

```bash
cd android && ./gradlew clean
cd ..
npm run android
```

### iOS (if needed later):

```bash
cd ios && pod install
cd ..
npm run ios
```

---

## Project Structure

```
src/
  assets/
    images/
      CoreHyponoselogo.png
  config.ts                 # BASE_URL configuration
  constants/
    theme.ts                # Colors and theme
  navigation/
    AppNavigator.tsx        # Navigation stack
  screens/
    OnboardingScreen.tsx    # Onboarding flow
    OnboardingSlide.tsx     # Individual slide component
    StartScreen.tsx         # Splash/start screen
    WebViewScreen.tsx       # WebView with message bridge
  stores/
    onboardingStore.ts      # Onboarding persistence
```

---

## Troubleshooting

### WebView not loading:
- Check that `BASE_URL` in `src/config.ts` is correct
- Ensure the URL is accessible from the device/emulator
- Check that the web page doesn't have CSP or X-Frame-Options blocking the WebView

### Messages not working:
- Ensure you're using `window.ReactNativeWebView.postMessage` (not `window.postMessage`)
- Check that messages are valid JSON
- Listen for both `message` and `document.message` events in web app

### Onboarding shows every time:
- Check AsyncStorage permissions
- Verify that `onboardingStore.setHasSeenOnboarding(true)` is being called
- Clear app data and try again

---

## License

This project is private and confidential.
