# WordPress Slug Reference til MCT App
**Guide til terapeuter/administratorer**

## Hvordan systemet virker

Når du opretter et MCT-kort i WordPress, skal det have en **slug** der matcher app'ens forventede slug. Når slug matcher, vises dit WordPress-indhold automatisk i appen - **uden at app'en skal genbygges**.

## Slug-oversigt

Herunder er alle proces-sider i appen og deres tilhørende WordPress slugs:

### START – Forstå CAS og metamodel

| App-side | WordPress slug | Bemærkning |
|----------|----------------|------------|
| Hvad er CAS? | `CAS_INTRO` | Aktuelt eksempel |
| Socialisering i MCT | `start-socialisering` | |

### TRÆN – Opmærksomhed og afkobling

| App-side | WordPress slug | 
|----------|----------------|
| TRÆN – ATT Basic | `train-att-basic` |
| TRÆN – ATT Variationer | `train-att-variationer` |
| TRÆN – Afkobling (DM) | `train-dm-basic` |

### STOP CAS – Reducer de fire reaktioner

| App-side | WordPress slug |
|----------|----------------|
| STOP – Bekymring | `stop-bekymring` |
| STOP – Grubling | `stop-grubling` |
| STOP – Trusselsmonitorering | `stop-trusselsmonitorering` |
| STOP – Copingstrategier | `stop-coping` |

### TEST ANTAGELSER – Udforsk sammenhænge

| App-side | WordPress slug |
|----------|----------------|
| TEST – Positive antagelser | `test-positive` |
| TEST – Negative antagelser | `test-negative` |

### NYE PLANER – Alternativ til CAS

| App-side | WordPress slug |
|----------|----------------|
| Nye planer – Metaplan | `nye-planer-metaplan` |

### VEDLIGEHOLDELSE – Fasthold fremskridt

| App-side | WordPress slug |
|----------|----------------|
| Vedligeholdelse – Generalisering | `vedligeholdelse-generalisering` |
| Vedligeholdelse – Tilbagefaldsplan | `vedligeholdelse-tilbagefald` |

## Sådan opretter du et kort i WordPress

### Trin 1: Opret MCT-kort
1. Log ind i WordPress admin
2. Opret nyt MCT-kort (Custom Post Type)
3. Skriv indhold (HTML understøttes)

### Trin 2: Sæt slug
Vælg én af følgende metoder:

**Metode A: Via slug-felt**
- Find "Slug" feltet i WordPress
- Indtast slug fra tabellen ovenfor (f.eks. `train-att-basic`)

**Metode B: Via titel**
- Sæt titel til noget der automatisk sluggifies korrekt
- Eksempel: Titel "Train ATT Basic" → slug "train-att-basic"

### Trin 3: Publicer
- Publicér kortet (ikke draft)
- Kortet tilføjes automatisk til manifestet
- Appen henter opdateret manifest ved næste opstart

## Eksempel: Opret "TRÆN – ATT Basic" kort

```
Titel: ATT Basic Øvelse
Slug: train-att-basic
UID: ATT_BASIC_001 (valgfrit - genereres automatisk)
Indhold:
  <h2>Attentional Training Technique</h2>
  <p>I denne øvelse træner du din opmærksomhed gennem tre faser:</p>
  <ol>
    <li><strong>Selektiv opmærksomhed</strong> - fokus på ét stimulus</li>
    <li><strong>Skiftende opmærksomhed</strong> - bevidst skifte mellem stimuli</li>
    <li><strong>Fordelt opmærksomhed</strong> - multiple stimuli samtidig</li>
  </ol>
Status: Publiceret
```

**Resultat i appen:**
- Bruger navigerer: "TRÆN" → "TRÆN – Opmærksomhed (ATT)" → "TRÆN – ATT Basic"
- Appen viser dansk intro-tekst + dit WordPress-indhold
- Ingen app rebuild nødvendig! ✨

## Fejlsøgning

### Kortet vises ikke i appen
1. **Tjek manifestet**: `https://mcht.voorhies.dk/wp-json/mct/v1/manifest`
   - Er kortet i `cardsIndex`?
   - Har det korrekt `slug` felt?

2. **Tjek slug matcher**:
   - Find slug i tabellen ovenfor
   - Sammenlign med slug i manifestet
   - Slug skal være PRÆCIS det samme

3. **Tjek kort-status**:
   - Er kortet publiceret? (ikke draft)
   - Har det korrekt UID?

### Manifestet er tomt
- Tjek WordPress MCT plugin er aktiveret
- Tjek kort er sat til "publish" status
- Tjek manifest-generator funktion virker

## Tekniske detaljer

**Manifest endpoint**: `https://mcht.voorhies.dk/wp-json/mct/v1/manifest`

**Kort endpoint**: `https://mcht.voorhies.dk/wp-json/mct/v1/cards/{UID}`

**Kode-reference**: 
- Slug-mapping: `src/content/contentManifestMapper.ts`
- Proces-sider: `src/content/da/process.ts`
- Hub-struktur: `src/content/da/hubs.ts`

---

*Sidst opdateret: 22. januar 2026*
