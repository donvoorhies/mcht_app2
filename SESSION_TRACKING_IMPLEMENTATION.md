# Session Tracking Implementation - Oversigt

## Hvad er implementeret?

### 1. WebView Bridge til Session Tracking ✅
App'en gemmer automatisk session data når WordPress sender `SESSION_STARTED` beskeder:
- Session ID, titel, URL og timestamp gemmes i AsyncStorage
- WordPress kan HENTE disse data via `GET_LAST_SESSION` besked
- WordPress kan selv vise "Fortsæt seneste session" på forsiden

### 2. Navigation Flow ✅
- **Start Screen** → **Onboarding** → **WebView** (WordPress)
- Ingen native home screen - alt indhold styres af WordPress
- Simpel og konsistent brugeroplevelse

### 3. WebView Forbedringer ✅
- Support for `tel:`, `mailto:`, `sms:`, `whatsapp:`, `maps:`, `geo:` links
- Åbner automatisk i native apps via `Linking` API
- Deep linking support via `initialUrl` parameter

### 4. Dokumentation ✅
- `WORDPRESS_SESSION_TRACKING.md` - Komplet guide til WordPress integration
- Eksempler på både at SENDE og HENTE session data
- PHP/JavaScript kode eksempler

## Hvordan virker det?

### Flow:
1. Bruger gennemfører onboarding første gang
2. Kommer direkte til WordPress WebView
3. WordPress kan anmode om seneste session via `GET_LAST_SESSION`
4. WordPress viser "Fortsæt seneste session" hvis data findes
5. Når bruger starter en session, sender WordPress `SESSION_STARTED`
6. App gemmer session info automatisk
7. Næste gang WordPress loader, kan den hente og vise seneste session

### WordPress Integration:

**Send session data:**
```javascript
window.ReactNativeWebView.postMessage(JSON.stringify({
  type: 'SESSION_STARTED',
  payload: { id: '123', title: 'Session navn', url: '/session/123' }
}));
```

**Hent session data:**
```javascript
// Anmod om data
window.ReactNativeWebView.postMessage(JSON.stringify({
  type: 'GET_LAST_SESSION'
}));

// Lyt efter svar
document.addEventListener('message', function(event) {
  const message = JSON.parse(event.data);
  if (message.type === 'LAST_SESSION') {
    // message.payload indeholder session data (eller null)
    showContinueSession(message.payload);
  }
});
```

## Næste skridt

For at få det til at virke skal WordPress:
1. Tilføje JavaScript til forsiden for at hente seneste session (se dokumentation)
2. Tilføje JavaScript til session sider for at sende SESSION_STARTED
3. Vise "Fortsæt seneste session" på forsiden hvis data findes
4. Vise "Dagens anbefaling" som standard indhold

## Test

1. Kør app: `npm run android`
2. Gennemfør onboarding
3. WordPress loader i WebView
4. WordPress anmoder om seneste session (første gang = null)
5. Start en session i WordPress
6. WordPress sender SESSION_STARTED
7. Reload WordPress (swipe down eller genåbn app)
8. WordPress modtager session data og viser "Fortsæt seneste session"

## Fordele ved denne løsning

✅ **Ingen REST API behov** - Alt via WebView bridge  
✅ **Offline-venligt** - Data gemmes lokalt  
✅ **Simpelt** - Minimal native kode  
✅ **Fleksibelt** - WordPress har fuld kontrol over UI  
✅ **Ingen redundans** - Alt indhold styres ét sted (WordPress)  
✅ **Konsistent** - Bruger ser kun WordPress UI  

## Tekniske detaljer

**Filer ændret:**
- `src/screens/WebViewScreen.tsx` - SESSION_STARTED + GET_LAST_SESSION handlers
- `src/navigation/AppNavigator.tsx` - WebView direkte efter onboarding
- `src/screens/OnboardingScreen.tsx` - Navigate til WebView
- `WORDPRESS_SESSION_TRACKING.md` - Komplet integration guide
- `README.md` - Opdateret med features

**Bridge Messages:**

*App → WordPress:*
- `LAST_SESSION` - Sendes som svar på GET_LAST_SESSION (payload: SessionInfo | null)
- `SESSION_SAVED` - Bekræftelse på SESSION_STARTED blev gemt
- `ERROR` - Fejlbesked hvis noget går galt

*WordPress → App:*
- `SESSION_STARTED` - Gem session info (payload: { id, title, url })
- `GET_LAST_SESSION` - Anmod om seneste session (ingen payload)

**Storage:**
- `mcht_last_session` - Gemmer seneste session info (SessionInfo object)
- `mcht_reflections_v1` - Eksisterende refleksions storage (uændret)
