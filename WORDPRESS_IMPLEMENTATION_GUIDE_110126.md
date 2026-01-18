# MCHT WordPress Integration - Implementeringsvejledning
**Dato:** 11. januar 2026

## 📋 Oversigt

Denne vejledning dækker implementering af MCHT app-integration i WordPress ved hjælp af custom PHP shortcodes. Systemet understøtter:

- ✅ Session sider med refleksionsspørgsmål
- ✅ Gemning af refleksioner til app (via WebView bridge)
- ✅ Visning af gemte refleksioner
- ✅ Homepage overblik med anbefalinger og session tracking
- ✅ Fuld WebView bridge integration

---

## 🔧 Trin 1: Installation af PHP Shortcodes

### Kopier functions.php kode

1. Åbn dit WordPress theme's `functions.php` fil
2. Kopier **hele indholdet** fra `wordpress-mcht-functions.php` 
3. Indsæt i bunden af `functions.php`
4. Gem filen

**Eller brug child theme:**
- Hvis du bruger et child theme, indsæt koden i child theme's `functions.php`

---

## 📝 Trin 2: Shortcode Reference

### 1. Session Shortcode - `[mcht_session]`

**Bruges på:** Hver session side (Session 1-10)

**Syntaks:**
```php
[mcht_session 
  id="1" 
  title="Velegnethed og Identitet" 
  category="Identitet" 
  duration="15"
  intro="Din intro tekst her..."
  script="Din session script her..."]
```

**Parametre:**

| Parameter | Påkrævet | Beskrivelse | Eksempel |
|-----------|----------|-------------|----------|
| `id` | Ja | Unikt session nummer | `"1"`, `"2"`, etc. |
| `title` | Ja | Session titel | `"Velegnethed og Identitet"` |
| `category` | Nej | Session kategori | `"Identitet"`, `"Motivation"` |
| `duration` | Nej | Varighed i minutter | `"15"`, `"20"` |
| `intro` | Nej | Introduktionstekst | `"Velkommen til session 1..."` |
| `script` | Nej | Fuld session script | `"Luk dine øjne..."` |

**Eksempel Session 1:**
```php
[mcht_session 
  id="1" 
  title="Velegnethed og Identitet" 
  category="Identitet" 
  duration="15"
  intro="Velkommen til første session om velegnethed og identitet. I denne session vil vi udforske..."
  script="Luk dine øjne og træk vejret dybt..."]
```

---

### 2. Refleksioner Shortcode - `[mcht_reflections]`

**Bruges på:** Refleksionssiden (én side i alt)

**Syntaks:**
```php
[mcht_reflections]
```

**Ingen parametre nødvendige** - henter automatisk alle gemte refleksioner fra app'en.

**Funktionalitet:**
- Viser alle gemte refleksioner sorteret efter dato (nyeste først)
- Automatisk formatering med session titel, dato, svar og fritekst refleksion
- Viser loading state mens data hentes
- Viser "ingen refleksioner" hvis tom
- Tilbage-knap inkluderet

---

### 3. Overblik Shortcode - `[mcht_overblik]`

**Bruges på:** Forsiden/homepage (én side i alt)

**Syntaks:**
```php
[mcht_overblik 
  recommended_id="1" 
  recommended_title="Velegnethed og Identitet" 
  recommended_url="/session-1/"]
```

**Parametre:**

| Parameter | Påkrævet | Beskrivelse | Eksempel |
|-----------|----------|-------------|----------|
| `recommended_id` | Ja | ID på anbefalet session | `"1"` |
| `recommended_title` | Ja | Titel på anbefalet session | `"Velegnethed og Identitet"` |
| `recommended_url` | Ja | WordPress URL til session | `"/session-1/"` |

**Funktionalitet:**
- Viser "Dagens anbefaling" kort (gradient purple) med konfigurerbar session
- Viser "Fortsæt seneste session" kort dynamisk fra app data
- Automatisk session tracking via WebView bridge
- Loading states og empty states

---

## 🎯 Trin 3: Session Tracking JavaScript

**VIGTIGT:** Hver session side skal have tracking JavaScript for at "Fortsæt seneste session" kan fungere.

### Tilføj til HVER session side

Indsæt dette JavaScript **under** shortcoden på hver session side:

```javascript
<script>
(function(){
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'SESSION_STARTED',
      payload: {
        id: 'session-1',  // ← SKIFT TIL session-2, session-3, etc.
        title: 'Velegnethed og Identitet',  // ← SKIFT TIL korrekt titel
        url: window.location.pathname
      }
    }));
  }
})();
</script>
```

### For hver session, ændr:

**Session 1:**
```javascript
id: 'session-1',
title: 'Velegnethed og Identitet',
```

**Session 2:**
```javascript
id: 'session-2',
title: 'Næste session titel',
```

**Session 3:**
```javascript
id: 'session-3',
title: 'Tredje session titel',
```

...og så videre for alle 10 sessioner.

---

## 📄 Trin 4: Opret WordPress Sider

### Opret følgende sider i WordPress:

#### A. Homepage / Overblik
- **Titel:** "Overblik" eller "Forside"
- **URL:** `/` eller `/overblik/`
- **Shortcode:** 
  ```php
  [mcht_overblik 
    recommended_id="1" 
    recommended_title="Velegnethed og Identitet" 
    recommended_url="/session-1/"]
  ```

#### B. Session 1
- **Titel:** "Session 1: Velegnethed og Identitet"
- **URL:** `/session-1/`
- **Shortcode:** 
  ```php
  [mcht_session 
    id="1" 
    title="Velegnethed og Identitet" 
    category="Identitet" 
    duration="15"
    intro="[hent fra WORDPRESS_TEKSTER.md]"
    script="[hent fra WORDPRESS_TEKSTER.md]"]
  
  <script>
  (function(){
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'SESSION_STARTED',
        payload: {
          id: 'session-1',
          title: 'Velegnethed og Identitet',
          url: window.location.pathname
        }
      }));
    }
  })();
  </script>
  ```

#### C. Session 2-10
- Gentag som Session 1, men skift:
  - `id="2"` til `id="10"`
  - Titel til korrekt session titel
  - URL til `/session-2/` gennem `/session-10/`
  - Tracking script `id: 'session-X'`

#### D. Refleksionsside
- **Titel:** "Dine Refleksioner"
- **URL:** `/refleksioner/`
- **Shortcode:** 
  ```php
  [mcht_reflections]
  ```

---

## 📖 Trin 5: Udfyld Session Content

Hent intro og script tekst fra `WORDPRESS_TEKSTER.md` filen:

1. Åbn `WORDPRESS_TEKSTER.md`
2. Find den relevante session
3. Kopier **Intro** tekst → indsæt i `intro="..."` parameter
4. Kopier **Script** tekst → indsæt i `script="..."` parameter

**Tip:** Brug multiline strings i WordPress editor:
```php
[mcht_session 
  id="1" 
  title="Velegnethed og Identitet"
  intro="Dette er første linje.
Dette er anden linje.
Dette er tredje linje."
  script="Luk dine øjne.
Træk vejret dybt.
Fortsæt..."]
```

---

## 🔗 Trin 6: WebView Bridge - Message Types

Systemet bruger følgende message types mellem WordPress og React Native app:

### Fra WordPress til App:

| Type | Beskrivelse | Payload |
|------|-------------|---------|
| `SAVE_REFLECTION` | Gem en refleksion | `{id, sessionId, text, createdAt}` |
| `GET_REFLECTIONS` | Anmod om alle refleksioner | `{}` |
| `DELETE_REFLECTION` | Slet en refleksion | `{id}` |
| `SESSION_STARTED` | Session besøgt | `{id, title, url}` |
| `GET_LAST_SESSION` | Anmod om seneste session | `{}` |

### Fra App til WordPress:

| Type | Beskrivelse | Payload |
|------|-------------|---------|
| `REFLECTIONS` | Returnerer alle refleksioner | `{items: [...]}` |
| `LAST_SESSION` | Returnerer seneste session | `{id, title, url, timestamp}` |

---

## ✅ Trin 7: Test Flow

### Test i rækkefølge:

1. **Åbn app** → Naviger til WordPress content via WebView
2. **Besøg Session 1** → Verificer tracking virker (check app logs)
3. **Udfyld refleksionsspørgsmål** → Vælg svar + skriv fritekst
4. **Gem refleksion** → Se grøn success besked
5. **Gå til Refleksionsside** → Verificer refleksion vises
6. **Gå til Overblik** → Verificer "Fortsæt seneste session" viser Session 1
7. **Besøg Session 2** → Verificer tracking opdaterer
8. **Gå til Overblik igen** → Verificer "Fortsæt seneste session" viser Session 2

---

## 🚨 Troubleshooting

### Refleksioner vises ikke
- ✅ Tjek at `window.ReactNativeWebView` findes
- ✅ Verificer message handlers i React Native app
- ✅ Åbn browser console og tjek for JavaScript errors

### Session tracking virker ikke
- ✅ Verificer tracking JavaScript er tilføjet til session siden
- ✅ Tjek `id` matcher format: `session-1`, `session-2`, etc.
- ✅ Verificer WebViewScreen.tsx håndterer SESSION_STARTED messages

### Shortcodes vises som tekst
- ✅ Tjek at functions.php kode er korrekt indsat
- ✅ Verificer ingen syntax errors i PHP
- ✅ Test shortcode i WordPress editor's preview

### WordPress theme overrider styles
- ✅ Koden bruger inline styles for at undgå theme conflicts
- ✅ Hvis problemer, tilføj `!important` i style attributter
- ✅ Verificer theme ikke har aggressive CSS resets

---

## 📊 Session Liste (Quick Reference)

| ID | Titel | Kategori |
|----|-------|----------|
| 1 | Velegnethed og Identitet | Identitet |
| 2 | Håb og Optimisme | Motivation |
| 3 | Mestring og Kontrol | Kontrol |
| 4 | Selvværd og Værdi | Selvværd |
| 5 | Relationel Forbundethed | Relationer |
| 6 | Engagement og Formål | Formål |
| 7 | Resiliens og Styrke | Resiliens |
| 8 | Nuværende Bevidsthed | Mindfulness |
| 9 | Growth Mindset | Udvikling |
| 10 | Accept og Forandring | Accept |

---

## 🎉 Færdig!

Når alle trin er gennemført har du:

- ✅ 10 session sider med refleksionsspørgsmål
- ✅ 1 refleksionsside med alle gemte refleksioner
- ✅ 1 overbliksside med anbefalinger og session tracking
- ✅ Fuld WebView bridge integration
- ✅ Automatisk data persistence i React Native app

**Godt arbejde! 🚀**

---

## 📞 Support

Ved spørgsmål eller problemer:
- Tjek `wordpress-mcht-functions.php` for shortcode kode
- Tjek `src/screens/WebViewScreen.tsx` for app-side message handling
- Tjek `WORDPRESS_TEKSTER.md` for session content
- Tjek browser console for JavaScript errors
- Tjek React Native logs for WebView bridge messages

---

**Sidste opdatering:** 11. januar 2026
