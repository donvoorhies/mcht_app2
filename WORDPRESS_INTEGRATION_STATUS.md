# WordPress Integration - Implementeret ✓

## Hvad er implementeret

### 1. ✅ Navigation fra WordPress til App-Sessioner

**App-links i WordPress:**
```html
<!-- Start session -->
<a href="app://session/start?id=SESSION_ID&title=SESSION_TITLE">Start Session</a>

<!-- Resume session -->
<a href="app://session/resume?id=SESSION_ID">Fortsæt Session</a>

<!-- Vis refleksioner -->
<a href="app://reflections?sessionId=SESSION_ID">Se Refleksioner</a>
```

**JavaScript API i WordPress:**
```javascript
// Naviger til session
window.MCHT.navigateToSession('session-id', 'Session Titel');

// Naviger til refleksioner
window.MCHT.navigateToReflections('session-id');
```

### 2. ✅ Lokale Assets Setup

**Struktur oprettet:**
```
android/app/src/main/assets/
├── images/
│   └── MCHT-logo.png (eksempel)
├── fonts/
└── styles/
```

**Sådan mapper du WordPress assets:**

Åbn: `src/utils/webViewInjection.ts`

Tilføj dine mappings:
```javascript
const assetMap = {
  // WordPress URL -> Lokal fil
  'https://www.corehypnose.dk/wp-content/uploads/hero.jpg': 'images/hero.jpg',
  'https://www.corehypnose.dk/wp-content/themes/your-theme/style.css': 'styles/main.css',
  // Tilføj flere...
};
```

### 3. ✅ Session & Refleksions API (allerede fungerer)

WordPress kan nu:
- Gemme refleksioner persistent i app'en
- Hente refleksioner
- Tracke sessions
- Hente sidste aktive session

## Næste Skridt (dit arbejde)

### A. Download og placer WordPress assets lokalt

1. **Identificer assets fra WordPress:**
   - Åbn din WordPress-site i browser
   - Højreklik → "Inspicér" → Network tab
   - Se hvilke billeder, CSS, fonts der loades

2. **Download dem:**
   ```bash
   cd /home/don/Projects/mcht_app2/android/app/src/main/assets/images
   curl -O https://www.corehypnose.dk/wp-content/uploads/hero.jpg
   ```

3. **Opdater mapping:**
   Rediger `src/utils/webViewInjection.ts` og tilføj mappings

### B. WordPress Integration

1. **Tilføj navigation links:**
   I WordPress theme/pages, tilføj links med `app://` protocol

2. **Implementer refleksionsknapper:**
   Se eksempler i `WORDPRESS_EXAMPLES.html`

3. **Test:**
   ```bash
   npm run android
   ```

## Dokumentation

- **`WORDPRESS_ASSETS.md`** - Detaljeret guide til asset-integration
- **`WORDPRESS_EXAMPLES.html`** - Konkrete kode-eksempler til WordPress
- **`WEBVIEW_BRIDGE.md`** - Teknisk dokumentation af bridge API

## Status

✅ **Klar til brug:**
- App navigation fra WordPress links
- Lokal asset serving (når mappings er tilføjet)
- Refleksions API
- Session tracking

🔄 **Afventer indhold:**
- Specifikke WordPress assets skal downloades og mappes
- WordPress templates skal opdateres med app-links
- Refleksionsknapper skal implementeres i WordPress

## Test

Start app'en og besøg WordPress-sitet. Åbn Chrome DevTools:
```bash
chrome://inspect
```

I konsollen skulle du se:
```
MCHT WebView bridge initialized
```

Prøv at kalde fra konsollen:
```javascript
window.MCHT.navigateToSession('test', 'Test Session');
```
