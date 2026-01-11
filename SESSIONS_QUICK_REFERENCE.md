# WordPress Session Integration - Simpel Guide

## 📋 Hurtig Reference

For hver session skal du kun udfylde disse felter:

### Session 1: Velegnethed og Identitet

```javascript
const SESSION_CONFIG = {
  id: '1',
  title: 'Velegnethed og Identitet',
  category: 'Identitet',
  duration: 15,
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

**Intro tekst:**
```
Denne session hjælper dig med at reflektere over din velegnethed og identitet.
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

```javascript
const SESSION_CONFIG = {
  id: '2',
  title: 'Selvbevidsthed i Praksis',
  category: 'Selvbevidsthed',
  duration: 20,
  reflectionQuestions: [
    {
      id: 'r3',
      question: 'Hvor let var det at observere dine egne tanker?',
      options: ['Meget let', 'Let', 'Moderat', 'Svært', 'Meget svært']
    }
  ]
};
```

**Intro tekst:**
```
Udvikl din selvbevidsthed gennem struktureret refleksion.
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

```javascript
const SESSION_CONFIG = {
  id: '3',
  title: 'Stresshåndtering',
  category: 'Træning',
  duration: 15,
  reflectionQuestions: [
    {
      id: 'r4',
      question: 'Hvilken stress-teknik var mest nyttig?',
      options: ['Grounding', 'Åndedræt', 'Refleksion', 'Andet']
    }
  ]
};
```

**Intro tekst:**
```
Lær teknikker til at håndtere stress i din hverdag.
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

```javascript
const SESSION_CONFIG = {
  id: '4',
  title: 'Empatisk Kommunikation',
  category: 'Kommunikation',
  duration: 20,
  reflectionQuestions: [
    {
      id: 'r5',
      question: 'Hvor nemt var det at identificere behov i samtalen?',
      options: ['Meget nemt', 'Nemt', 'Moderat', 'Svært', 'Meget svært']
    }
  ]
};
```

**Intro tekst:**
```
Forbedre din evne til empatisk kommunikation.
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

```javascript
const SESSION_CONFIG = {
  id: '5',
  title: 'Grænsesætning',
  category: 'Træning',
  duration: 15,
  reflectionQuestions: [
    {
      id: 'r6',
      question: 'Hvor tryg er du ved at sætte grænser?',
      options: ['Meget tryg', 'Tryg', 'Moderat', 'Usikker', 'Meget usikker']
    }
  ]
};
```

**Intro tekst:**
```
Lær at sætte sunde grænser i dit liv.
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

```javascript
const SESSION_CONFIG = {
  id: '6',
  title: 'Selvmedlidenhed',
  category: 'Selvbevidsthed',
  duration: 18,
  reflectionQuestions: [
    {
      id: 'r7',
      question: 'Hvor venlig var du mod dig selv i dag?',
      options: ['Meget venlig', 'Venlig', 'Neutralt', 'Lidt hård', 'Meget hård']
    }
  ]
};
```

**Intro tekst:**
```
Udvikl selvmedlidenhed i stedet for selvkritik.
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

```javascript
const SESSION_CONFIG = {
  id: '7',
  title: 'Konflikthåndtering',
  category: 'Kommunikation',
  duration: 20,
  reflectionQuestions: [
    {
      id: 'r8',
      question: 'Hvor effektiv var din konflikthåndtering?',
      options: ['Meget effektiv', 'Effektiv', 'Moderat', 'Ineffektiv', 'Meget ineffektiv']
    }
  ]
};
```

**Intro tekst:**
```
Lær konstruktiv konflikthåndtering.
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

```javascript
const SESSION_CONFIG = {
  id: '8',
  title: 'Værdibaseret Liv',
  category: 'Identitet',
  duration: 18,
  reflectionQuestions: [
    {
      id: 'r9',
      question: 'Hvor meget lever du i overensstemmelse med dine værdier?',
      options: ['Fuldstændigt', 'Meget', 'Moderat', 'Lidt', 'Slet ikke']
    }
  ]
};
```

**Intro tekst:**
```
Forbind dig med dine kernesværdier.
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

```javascript
const SESSION_CONFIG = {
  id: '9',
  title: 'Aktiveringsstyring',
  category: 'Træning',
  duration: 15,
  reflectionQuestions: [
    {
      id: 'r10',
      question: 'Hvor god er du til at registrere dit aktivationsniveau?',
      options: ['Meget god', 'God', 'Moderat', 'Dårlig', 'Meget dårlig']
    }
  ]
};
```

**Intro tekst:**
```
Lær at regulere din aktivationsniveau.
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

```javascript
const SESSION_CONFIG = {
  id: '10',
  title: 'Accept og Forandring',
  category: 'Selvbevidsthed',
  duration: 20,
  reflectionQuestions: [
    {
      id: 'r11',
      question: 'Hvor let var det at skelne mellem accept og forandring?',
      options: ['Meget let', 'Let', 'Moderat', 'Svært', 'Meget svært']
    }
  ]
};
```

**Intro tekst:**
```
Balancer accept med muligheden for forandring.
```

**Script tekst:**
```
Der er ting vi kan forandre og ting vi må acceptere. Visdommen ligger i at skelne mellem dem.

Tænk på noget der generer dig. Kan du forandre det? Skal du acceptere det?

Accept betyder ikke opgivelse. Det betyder at anerkende virkeligheden som den er, så du kan tage bevidste valg om handling.

Husk: Du behøver ikke at elske det du accepterer. Du skal bare anerkende det.
```

---

## 🚀 Sådan Bruger Du Det

### Trin 1: Åbn WORDPRESS_SESSION_TEMPLATE.html

### Trin 2: Find SESSION_CONFIG sektionen (linje ~46)

### Trin 3: Erstat med konfiguration fra ovenstående

### Trin 4: Find "INTRO_TEXT" i HTML (linje ~23)
Erstat med intro tekst fra ovenstående

### Trin 5: Find "SCRIPT_TEXT_HERE" i HTML (linje ~40)
Erstat med script tekst fra ovenstående

### Trin 6: Gem og upload til WordPress

---

## 💡 Eksempel - Session 1

I `WORDPRESS_SESSION_TEMPLATE.html`, erstat:

**Linje ~23:**
```html
<p>INTRO_TEXT</p>
```
Med:
```html
<p>Denne session hjælper dig med at reflektere over din velegnethed og identitet.</p>
```

**Linje ~40:**
```html
SCRIPT_TEXT_HERE
```
Med:
```
Velkommen til denne refleksionssession. Find et stille sted hvor du kan være uforstyrret i cirka 15 minutter.

Lad os starte med at trække vejret dybt... Tag 3 dybe vejrtagninger.

Nu vil vi reflektere over følgende spørgsmål:
1. Hvad betyder det for dig at være velegnet?
2. Hvilke værdier er vigtige for dig i din professionelle rolle?
3. Hvordan balancerer du dit personlige og professionelle jeg?

Tag dig tid til at tænke over hvert spørgsmål. Der er ingen rigtige eller forkerte svar.
```

**Linje ~52-64 (JavaScript SESSION_CONFIG):**
```javascript
const SESSION_CONFIG = {
  id: '1',
  title: 'Velegnethed og Identitet',
  category: 'Identitet',
  duration: 15,
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

Færdig! Gentag for de andre 9 sessioner.

---

## ✅ Hvad Sker Der Når Brugeren Gemmer Refleksion?

App'en modtager dette data:

```json
{
  "id": "reflection-1-1736618400000",
  "sessionId": "1",
  "sessionTitle": "Velegnethed og Identitet",
  "answers": {
    "r1": {
      "question": "Hvordan føler du efter denne session?",
      "answer": "Meget positivt"
    },
    "r2": {
      "question": "Var indholdet relevant for dig?",
      "answer": "Meget relevant"
    }
  },
  "text": "Mine personlige noter...",
  "createdAt": "2026-01-11T12:00:00.000Z",
  "sessionDuration": 900
}
```

Dette gemmes permanent i app'en og kan ses i "Refleksioner" skærmen.
