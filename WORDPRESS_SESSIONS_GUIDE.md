# WordPress Sessions Integration Guide

## 📋 Oversigt

Dette dokument forklarer hvordan du integrerer alle 10 sessions-sider i WordPress med MCHT app'en.

---

## 🎯 A. HTML/JavaScript Kode-Snippets

### Generisk Template

Brug `WORDPRESS_SESSION_TEMPLATE.html` som base for alle sessions-sider.

### Trin-for-trin Implementation:

1. **Åbn din WordPress session-side i editor**
2. **Kopier template fra `WORDPRESS_SESSION_TEMPLATE.html`**
3. **Erstat følgende placeholdre:**

| Placeholder | Eksempel værdi | Beskrivelse |
|-------------|----------------|-------------|
| `SESSION_ID` | `'1'` | Unikt ID for sessionen |
| `SESSION_TITLE` | `'Velegnethed og Identitet'` | Session titel |
| `CATEGORY` | `'Identitet'` | Kategori |
| `DURATION` | `15` | Varighed i minutter (tal) |
| `INTRO_TEXT` | Din intro tekst | Fra WORDPRESS_TEKSTER.md |
| `SCRIPT_TEXT_HERE` | Dit session script | Fra WORDPRESS_TEKSTER.md |
| `QUESTION_1_TEXT` | Spørgsmålstekst | Refleksionsspørgsmål |
| `AUDIO_URL` | URL eller tom | Valgfri audio fil |

---

## 🔧 B. Funktionalitet Forklaring

### 1. **Start Session Knap**

```javascript
function startSession() {
  // Logger session start
  // Viser session indhold
  // Starter progress bar
  // Notificerer app om session start
  // Sætter timer til at vise refleksionsspørgsmål
}
```

**Hvad sker der:**
- Session indhold vises (script tekst)
- Progress bar begynder at fylde op
- App'en får besked om at sessionen er startet
- Efter den angivne varighed vises refleksionsspørgsmålene automatisk

### 2. **Gem Refleksion Knap**

```javascript
function saveReflection() {
  // Indsamler svar fra dropdown menuer
  // Indsamler fri tekst refleksion
  // Sender data til app via WebView bridge
  // Viser success besked
}
```

**Data struktur sendt til app:**
```javascript
{
  id: 'reflection-1-1736618400000',
  sessionId: '1',
  sessionTitle: 'Velegnethed og Identitet',
  answers: {
    'r1': {
      question: 'Hvordan føler du efter denne session?',
      answer: 'Meget positivt'
    },
    'r2': {
      question: 'Var indholdet relevant for dig?',
      answer: 'Meget relevant'
    }
  },
  text: 'Mine personlige refleksioner...',
  createdAt: '2026-01-11T12:00:00.000Z',
  sessionDuration: 900  // sekunder
}
```

### 3. **Se Tidligere Refleksioner**

```javascript
function viewPreviousReflections() {
  // Navigerer til Refleksions-skærmen i app'en
  // Filtrerer refleksioner for denne session
}
```

### 4. **Progress Bar**

Viser visuelt fremskridt gennem sessionen:
- Starter ved 0% når session startes
- Fylder gradvist op over den angivne varighed
- Når 100% når sessionen er færdig

### 5. **Auto-start (valgfrit)**

Tilføj `?autostart=true` til URL'en for at starte sessionen automatisk:
```
https://mcht.voorhies.dk/velegnethed-og-identitet/?autostart=true
```

---

## 📚 C. Komplet Guide til Alle 10 Sessioner

### Session 1: Velegnethed og Identitet

**WordPress Page URL:** `/velegnethed-og-identitet/`

**Konfiguration:**
```javascript
const SESSION_CONFIG = {
  id: '1',
  title: 'Velegnethed og Identitet',
  category: 'Identitet',
  duration: 15,
  audioUri: '',  // Tilføj URL hvis du har audio
  reflectionQuestions: [
    {
      id: 'r1',
      question: 'Hvordan føler du efter denne session?',
      options: ['Meget positivt', 'Positivt', 'Neutralt', 'Lidt negativt', 'Negativt']
    },
    {
      id: 'r2',
      question: 'Var indholdet relevant for dig?',
      options: ['Meget relevant', 'Relevant', 'Neutralt', 'Lidt irrelevant', 'Irrelevant']
    }
  ]
};
```

**Script tekst:**
```
Velkommen til denne refleksionssession. Find et stille sted hvor du kan være uforstyrret i cirka 15 minutter.

Lad os starte med at trække vejret dybt... Tag 3 dybe vejrtagninger.

Nu vil vi reflektere over følgende spørgsmål:
1. Hvad betyder det for dig at være velegnet?
2. Hvilke værdier er vigtige for dig i din professionelle rolle?
3. Hvordan balancerer du dit personlige og professionelle jeg?

Tag dig tid til at tænke over hvert spørgsmål. Der er ingen rigtige eller forkerte svar.
```

---

### Session 2: Selvbevidsthed i Praksis

**WordPress Page URL:** `/selvbevidsthed-i-praksis/`

**Konfiguration:**
```javascript
const SESSION_CONFIG = {
  id: '2',
  title: 'Selvbevidsthed i Praksis',
  category: 'Selvbevidsthed',
  duration: 20,
  audioUri: '',
  reflectionQuestions: [
    {
      id: 'r3',
      question: 'Hvor let var det at observere dine egne tanker?',
      options: ['Meget let', 'Let', 'Moderat', 'Svært', 'Meget svært']
    }
  ]
};
```

**Script tekst:**
```
I denne session vil vi arbejde med selvbevidsthed i praksis.

Start med at observere dine tanker i dette øjeblik. Hvad tænker du på? Hvordan påvirker disse tanker dit humør?

Reflekter over en situation fra denne uge hvor du bemærkede dine egne reaktioner. Hvad triggede dig? Hvordan reagerede du?

Selvbevidsthed handler om at observere sig selv uden dom. Prøv at bevare en nysgerrig, ikke-dømmende holdning til dine egne erfaringer.
```

---

### Session 3: Stresshåndtering

**WordPress Page URL:** `/stresshaandtering/`

**Konfiguration:**
```javascript
const SESSION_CONFIG = {
  id: '3',
  title: 'Stresshåndtering',
  category: 'Træning',
  duration: 15,
  audioUri: '',
  reflectionQuestions: [
    {
      id: 'r4',
      question: 'Hvilken stress-teknik var mest nyttig?',
      options: ['Grounding', 'Åndedræt', 'Refleksion', 'Andet']
    }
  ]
};
```

**Script tekst:**
```
Stress er en naturlig del af livet, men vi kan lære at håndtere det bedre.

Først, identificer dine stress-tegn. Hvordan påvirker stress din krop? Din sindstilstand?

Prøv nu denne teknik: 5-4-3-2-1 grounding.
- 5 ting du kan se
- 4 ting du kan røre
- 3 ting du kan høre
- 2 ting du kan lugte
- 1 ting du kan smage

Denne teknik hjælper med at bringe dig tilbage til nutiden når stress truer med at overvælde dig.
```

---

### Session 4: Empatisk Kommunikation

**WordPress Page URL:** `/empatisk-kommunikation/`

**Konfiguration:**
```javascript
const SESSION_CONFIG = {
  id: '4',
  title: 'Empatisk Kommunikation',
  category: 'Kommunikation',
  duration: 20,
  audioUri: '',
  reflectionQuestions: [
    {
      id: 'r5',
      question: 'Hvor nemt var det at identificere behov i samtalen?',
      options: ['Meget nemt', 'Nemt', 'Moderat', 'Svært', 'Meget svært']
    }
  ]
};
```

**Script tekst:**
```
Empatisk kommunikation handler om at forstå og anerkende andres perspektiver.

Tænk på en samtale hvor du følte dig misforstået. Hvad manglede der?

Empati består af fire elementer:
1. Observation uden dom
2. Følelsesmæssig erkendelse
3. Anerkendelse af behov
4. Anmodning om handling

Prøv at anvende disse elementer i din næste vigtige samtale.
```

---

### Session 5: Grænsesætning

**WordPress Page URL:** `/graensesoetning/`

**Konfiguration:**
```javascript
const SESSION_CONFIG = {
  id: '5',
  title: 'Grænsesætning',
  category: 'Træning',
  duration: 15,
  audioUri: '',
  reflectionQuestions: [
    {
      id: 'r6',
      question: 'Hvor tryg er du ved at sætte grænser?',
      options: ['Meget tryg', 'Tryg', 'Moderat', 'Usikker', 'Meget usikker']
    }
  ]
};
```

**Script tekst:**
```
Sunde grænser er essentielle for velvære.

Tænk over: Hvor har du svært ved at sætte grænser? Hvad holder dig tilbage?

En sund grænse er:
- Klart kommunikeret
- Konsistent
- Respekteret af begge parter
- Fleksibel når nødvendigt

Husk: Det er okay at sige nej. At sige nej til noget er at sige ja til noget andet - ofte dig selv.
```

---

### Session 6: Selvmedlidenhed

**WordPress Page URL:** `/selvmedlidenhed/`

**Konfiguration:**
```javascript
const SESSION_CONFIG = {
  id: '6',
  title: 'Selvmedlidenhed',
  category: 'Selvbevidsthed',
  duration: 18,
  audioUri: '',
  reflectionQuestions: [
    {
      id: 'r7',
      question: 'Hvor venlig var du mod dig selv i dag?',
      options: ['Meget venlig', 'Venlig', 'Neutralt', 'Lidt hård', 'Meget hård']
    }
  ]
};
```

**Script tekst:**
```
Selvmedlidenhed handler om at behandle dig selv med samme omsorg du ville vise en god ven.

Tænk på en situation hvor du var hård ved dig selv. Hvad ville du sige til en ven i samme situation?

Selvmedlidenhed består af:
- Mindfulness: Erkend din smerte
- Fællesskab: Forstå at alle fejler
- Venlighed: Vær blid mod dig selv

Prøv at skrive en venlig besked til dig selv om din seneste udfordring.
```

---

### Session 7: Konflikthåndtering

**WordPress Page URL:** `/konflikthaandtering/`

**Konfiguration:**
```javascript
const SESSION_CONFIG = {
  id: '7',
  title: 'Konflikthåndtering',
  category: 'Kommunikation',
  duration: 20,
  audioUri: '',
  reflectionQuestions: [
    {
      id: 'r8',
      question: 'Hvor effektiv var din konflikthåndtering?',
      options: ['Meget effektiv', 'Effektiv', 'Moderat', 'Ineffektiv', 'Meget ineffektiv']
    }
  ]
};
```

**Script tekst:**
```
Konflikter er uundgåelige, men vi kan håndtere dem konstruktivt.

Reflekter over en nylig konflikt. Hvad var dine reaktioner? Hvad var de andres?

Konstruktiv konflikthåndtering kræver:
- Aktiv lytning
- Forståelse af perspektiver
- Fokus på løsninger frem for problemer
- Respekt for forskelle

Husk: Konflikter kan være muligheder for vækst hvis de håndteres rigtigt.
```

---

### Session 8: Værdibaseret Liv

**WordPress Page URL:** `/vaerdibaseret-liv/`

**Konfiguration:**
```javascript
const SESSION_CONFIG = {
  id: '8',
  title: 'Værdibaseret Liv',
  category: 'Identitet',
  duration: 18,
  audioUri: '',
  reflectionQuestions: [
    {
      id: 'r9',
      question: 'Hvor meget lever du i overensstemmelse med dine værdier?',
      options: ['Fuldstændigt', 'Meget', 'Moderat', 'Lidt', 'Slet ikke']
    }
  ]
};
```

**Script tekst:**
```
Værdier styrer vores valg og handlinger, ofte uden at vi er bevidste om det.

Tænk på: Hvad er de 3 vigtigste værdier i dit liv? Hvordan viser de sig i din hverdag?

Reflekter over om dine handlinger er i overensstemmelse med dine værdier. Hvor er der afstand?

Værdibaseret liv handler om at tage valg der reflekterer hvem du vil være, ikke kun hvad du vil opnå.
```

---

### Session 9: Aktiveringsstyring

**WordPress Page URL:** `/aktiveringsstyring/`

**Konfiguration:**
```javascript
const SESSION_CONFIG = {
  id: '9',
  title: 'Aktiveringsstyring',
  category: 'Træning',
  duration: 15,
  audioUri: '',
  reflectionQuestions: [
    {
      id: 'r10',
      question: 'Hvor god er du til at registrere dit aktivationsniveau?',
      options: ['Meget god', 'God', 'Moderat', 'Dårlig', 'Meget dårlig']
    }
  ]
};
```

**Script tekst:**
```
Aktiveringsstyring handler om at balancere dit energiniveau.

Følg med i din krop lige nu. Hvordan føles det? Er du for aktiv eller for passiv?

Teknikker til at regulere:
- Høj aktivitet: Dybe vejrtagninger, progressive muskelafslapning
- Lav aktivitet: Fysisk aktivitet, musik, social interaktion

Identificer hvor du er lige nu, og vælg en passende teknik.
```

---

### Session 10: Accept og Forandring

**WordPress Page URL:** `/accept-og-forandring/`

**Konfiguration:**
```javascript
const SESSION_CONFIG = {
  id: '10',
  title: 'Accept og Forandring',
  category: 'Selvbevidsthed',
  duration: 20,
  audioUri: '',
  reflectionQuestions: [
    {
      id: 'r11',
      question: 'Hvor let var det at skelne mellem accept og forandring?',
      options: ['Meget let', 'Let', 'Moderat', 'Svært', 'Meget svært']
    }
  ]
};
```

**Script tekst:**
```
Der er ting vi kan forandre og ting vi må acceptere. Visdommen ligger i at skelne mellem dem.

Tænk på noget der generer dig. Kan du forandre det? Skal du acceptere det?

Accept betyder ikke opgivelse. Det betyder at anerkende virkeligheden som den er, så du kan tage bevidste valg om handling.

Husk: Du behøver ikke at elske det du accepterer. Du skal bare anerkende det.
```

---

## 🚀 D. Ekstra Funktionalitet & Tips

### 1. **Sessionsoversigt Side**

Opret en `/sessioner/` side med links til alle 10 sessioner:

```html
<div class="sessions-overview">
  <h1>Alle Sessioner</h1>
  
  <!-- Filter buttons -->
  <div class="filter-buttons">
    <button onclick="filterSessions('all')">Alle</button>
    <button onclick="filterSessions('Identitet')">Identitet</button>
    <button onclick="filterSessions('Selvbevidsthed')">Selvbevidsthed</button>
    <button onclick="filterSessions('Træning')">Træning</button>
    <button onclick="filterSessions('Kommunikation')">Kommunikation</button>
  </div>

  <!-- Session cards -->
  <div class="session-grid">
    
    <div class="session-card" data-category="Identitet">
      <h3>Velegnethed og Identitet</h3>
      <p class="category">Identitet • 15 minutter</p>
      <p>Reflekter over din velegnethed og identitet.</p>
      <a href="/velegnethed-og-identitet/" class="btn">Start session</a>
    </div>

    <div class="session-card" data-category="Selvbevidsthed">
      <h3>Selvbevidsthed i Praksis</h3>
      <p class="category">Selvbevidsthed • 20 minutter</p>
      <p>Udvikl din selvbevidsthed gennem struktureret refleksion.</p>
      <a href="/selvbevidsthed-i-praksis/" class="btn">Start session</a>
    </div>

    <!-- Add all 10 sessions here -->
    
  </div>
</div>

<script>
function filterSessions(category) {
  const cards = document.querySelectorAll('.session-card');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}
</script>
```

### 2. **Audio Integration**

Hvis du vil tilføje audio guidet meditation:

```javascript
// I din SESSION_CONFIG
audioUri: 'https://mcht.voorhies.dk/wp-content/uploads/audio/session-1.mp3',

// Opdater toggleAudio funktionen:
let audioPlayer = null;

function toggleAudio() {
  const btn = document.getElementById('audio-btn');
  
  if (!audioPlayer) {
    // Create audio player
    audioPlayer = new Audio(SESSION_CONFIG.audioUri);
    audioPlayer.play();
    btn.textContent = '⏸️ Pause Audio';
  } else {
    if (audioPlayer.paused) {
      audioPlayer.play();
      btn.textContent = '⏸️ Pause Audio';
    } else {
      audioPlayer.pause();
      btn.textContent = '▶️ Afspil Audio';
    }
  }
  
  // When audio ends
  audioPlayer.addEventListener('ended', () => {
    btn.textContent = '🔊 Afspil igen';
  });
}
```

### 3. **Session Progress Tracking**

Track hvilke sessioner brugeren har fuldført:

```javascript
// Send til app når session er fuldført
function completeSession() {
  notifyApp('SESSION_COMPLETED', {
    sessionId: SESSION_CONFIG.id,
    title: SESSION_CONFIG.title,
    category: SESSION_CONFIG.category,
    completedAt: new Date().toISOString()
  });
  
  // Show reflection section
  document.getElementById('reflection-section').style.display = 'block';
  populateReflectionQuestions();
}
```

### 4. **Deep Linking fra App**

App'en kan linke direkte til sessions-sider:

```javascript
// I app'en, når bruger klikker "Start session"
const sessionUrl = `https://mcht.voorhies.dk/velegnethed-og-identitet/?autostart=true`;
// WebView loader denne URL og starter automatisk sessionen
```

### 5. **Offline Support (fremtidig)**

For at understøtte offline brug kan du:
- Cache sessions-indhold i app'en
- Gem refleksioner lokalt og sync senere
- Pre-download audio filer

### 6. **Analytics Integration**

Track session engagement:

```javascript
function trackSessionEvent(eventName, data) {
  // Google Analytics
  if (window.gtag) {
    gtag('event', eventName, data);
  }
  
  // Eller send til app
  notifyApp('ANALYTICS', {
    event: eventName,
    ...data
  });
}

// Brug det:
trackSessionEvent('session_started', {
  session_id: SESSION_CONFIG.id,
  session_title: SESSION_CONFIG.title
});

trackSessionEvent('session_completed', {
  session_id: SESSION_CONFIG.id,
  duration_seconds: sessionDuration
});
```

### 7. **WordPress Shortcodes**

Opret en WordPress shortcode for nemt at indsætte sessioner:

```php
// I dit theme's functions.php
function mcht_session_shortcode($atts) {
  $atts = shortcode_atts([
    'id' => '1',
    'title' => 'Session',
  ], $atts);
  
  return '<button class="mcht-start-session" 
                  onclick="window.MCHT.navigateToSession(\'' . 
                  esc_js($atts['id']) . '\', \'' . 
                  esc_js($atts['title']) . '\')">
            Start ' . esc_html($atts['title']) . '
          </button>';
}
add_shortcode('mcht_session', 'mcht_session_shortcode');

// Brug i WordPress:
// [mcht_session id="1" title="Velegnethed og Identitet"]
```

---

## ✅ Implementation Checklist

- [ ] Kopier `WORDPRESS_SESSION_TEMPLATE.html` til hver session-side
- [ ] Opdater SESSION_CONFIG for hver session
- [ ] Tilføj intro og script tekster fra `WORDPRESS_TEKSTER.md`
- [ ] Test hver session i WordPress
- [ ] Test i app'en (WebView)
- [ ] Verificer at refleksioner gemmes korrekt
- [ ] Opret sessionsoversigt side
- [ ] Test navigation mellem sider
- [ ] Test på mobil enhed
- [ ] Upload audio filer (hvis applicable)

---

## 🐛 Troubleshooting

### Refleksioner gemmes ikke
- Tjek at `window.ReactNativeWebView` er tilgængelig
- Åbn DevTools console og se efter fejl
- Verificer at SESSION_CONFIG.id er korrekt

### Session starter ikke automatisk
- Tjek at URL indeholder `?autostart=true`
- Verificer at JavaScript er loaded korrekt

### Progress bar vises ikke
- Tjek at session duration er sat som et tal (ikke string)
- Verificer CSS er loaded

### Audio afspilles ikke
- Tjek at audioUri er en gyldig URL
- Verificer at audio filen findes
- Test i browser først

---

## 📱 Test i App'en

1. **Build og kør app'en:**
   ```bash
   cd /home/don/Projects/mcht_app2
   npm run android
   ```

2. **Test funktionalitet:**
   - Start en session
   - Gennemfør sessionen
   - Besvar refleksionsspørgsmål
   - Gem refleksion
   - Naviger til Refleksions-skærmen
   - Verificer at refleksion er gemt

3. **Test navigation:**
   - Link fra hjem til sessioner
   - Link mellem sessioner
   - Tilbage-knapper
   - Deep links

---

## 📞 Support

Hvis du støder på problemer:
1. Tjek console for JavaScript fejl
2. Verificer SESSION_CONFIG konfiguration
3. Test i browser først (uden app)
4. Test derefter i app'en
5. Tjek WEBVIEW_BRIDGE.md for API dokumentation
