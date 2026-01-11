# WordPress Assets Integration

## Oversigt
Dette setup gør det muligt at serve billeder, fonts, og stylesheets lokalt fra app'en i stedet for at hente dem fra WordPress-serveren. Dette reducerer loadtid og databrug.

**Cross-platform:** Koden er forberedt til både Android og iOS.

## Asset-placering

### Android
Placer dine assets i: `/android/app/src/main/assets/`

Struktur:
```
android/app/src/main/assets/
├── images/
│   ├── MCHT-logo.png
│   ├── hero-banner.jpg
│   └── ...
├── fonts/
│   ├── custom-font.ttf
│   └── ...
└── styles/
    └── wordpress-overrides.css
```

### iOS
Placer dine assets i: `/ios/mchtapp/Assets/`

Struktur:
```
ios/mchtapp/Assets/
├── images/
│   ├── MCHT-logo.png
│   ├── hero-banner.jpg
│   └── ...
├── fonts/
│   ├── custom-font.ttf
│   └── ...
└── styles/
    └── wordpress-overrides.css
```

**Vigtigt for iOS:** Du skal også tilføje assets til Xcode projektet:
1. Åbn `ios/mchtapp.xcodeproj` i Xcode
2. Højreklik på `mchtapp` → Add Files to "mchtapp"
3. Vælg `Assets` mappen
4. Vink "Create folder references" af

## Hvordan det virker

### 1. Platform-Aware Asset Loading
Systemet detekterer automatisk om app'en kører på iOS eller Android og bruger de korrekte asset paths:

- **Android:** `file:///android_asset/images/logo.png`
- **iOS:** `file://images/logo.png`

### 2. Asset Mapping
I `src/utils/webViewInjection.ts` skal du mappe WordPress URLs til lokale filer:

```javascript
const assetMap = {
  'h3. WordPress Integration
Fra WordPress kan du nu:

#### Navigere til app-sessioner:
```html
<a href="app://session/start?id=session1&title=Min%20Session">Start session</a>
```

#### Eller brug JavaScript API (type-safe):
```javascript
// Start en session
window.MCHT.navigateToSession('session1', 'Min Session');

// Navigér til refleksioner
window.MCHT.navigateToReflections('session1');

// Gem session info
window.MCHT.startSession('session1', 'Min Session', window.location.href);
```

**Type Safety:** API'et er fuldt TypeScript-typed, så du får fejl hvis du kalder med forkerte parametre.Start en session
window.MCHT.navigateToSession('session1', 'Min Session');

// Navigér til refleksioner
window.MCHT.navigateToReflections('session1');

// Gem session info
window.MCHT.startSession('session1', 'Min Session', window.location.href);
```4. Refleksioner (allerede implementeret)
```javascript
// Gem refleksion
window.MCHT.saveReflection({
  id: 'reflection-' + Date.now(),
  sessionId: 'session1',
  text: 'Min refleksion...',
  createdAt: new Date().toISOString()
});

// Hent refleksioner
window.MCHT.getReflections('session1');

// Lyt efter response
window.addEventListener('message', function(event) {
  try {
    const data = JSON.parse(event.data);
    if (data.type === 'REFLECTIONS') {
      console.log('Refleksioner:', data.payload.items);
    }
  } catch (e) {
    // Ignorer non-JSON messages
  }
});
```

## Best Practices

### Type Safety
- Brug TypeScript types defineret i `src/types/webview.d.ts`
- API'et validerer input og logger fejl ved forkert brug
- Mock API tilgængeligt for testing i browser

### Error Handling
- Alle API-kald har try-catch error handling
- Fejl logges til konsollen med `[MCHT]` prefix
- WordPress modtager ERROR messages ved fejl

### Cross-Platform Compatibility
- ✅ Automatisk platform detection
- ✅ Platform-specifikke WebView props
- ✅ Samme API på iOS og Android
- ✅ Konsistent asset struktur

### Performance
- Assets caches af OS efter første load
- Reduceret netværkstrafik
- Hurtigere sidehastighed
- Fungerer offline når assets er lokale
});
```

## Næste skridt

1. **Kopier assets til Android/iOS mapper**
   - Identificer hvilke billeder, fonts, CSS WordPress bruger
   - Download dem og placer i assets-mapperne
   - Opdater asset mapping i `webViewInjection.ts`

2. **Test lokale assets**
   - Byg app igen: `npm run android`
   - Verificer at billeder loader fra lokale filer
   - Check developer console for redirect-logs

3. **WordPress-integration**
   - Tilføj links med `app://` protocol for navigation
   - Eller brug `window.MCHT` API fra JavaScript
   - Test navigation mellem WordPress og app-sessioner

## Debugging
For at se hvad der sker, tjek React Native logs:
```bash
npx react-native log-android
```

Eller i browseren (Chrome DevTools):
1. Åbn Chrome
2. Gå til `chrome://inspect`
3. Find din WebView og klik "inspect"
