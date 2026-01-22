# YouTube Video Guide til MCT App

## Sådan indsætter du YouTube videoer i MCT-kort

Når du opretter eller redigerer MCT-kort i WordPress, kan du nemt tilføje YouTube videoer. Appen håndterer automatisk visningen af videoerne direkte i appen med fuld afspilningsfunktionalitet.

---

## Fremgangsmåde

### 1. Find YouTube videoen
- Gå til YouTube og find den video du vil indsætte
- Klik på "Del" knappen under videoen
- Vælg "Integrer" (eller "Embed")

### 2. Kopiér embed-koden
YouTube giver dig en kode der ligner dette:
```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>
```

### 3. Indsæt i WordPress
Du har to muligheder:

#### Option A: YouTube Block (anbefalet)
1. I WordPress editor: Klik "+" for at tilføje en ny block
2. Søg efter "YouTube" og vælg YouTube block
3. Indsæt video URL'en (f.eks. `https://www.youtube.com/watch?v=VIDEO_ID`)

#### Option B: Custom HTML Block
1. I WordPress editor: Klik "+" for at tilføje en ny block
2. Søg efter "Custom HTML" og vælg denne block
3. Indsæt den kopierede iframe embed-kode direkte

### 4. Gem kortet
- Gem eller publicer dit MCT-kort
- Videoen vil automatisk vises i appen som en native afspiller

---

## Understøttede formater

Appen understøtter automatisk følgende YouTube URL formater:

✅ `https://www.youtube.com/embed/VIDEO_ID`  
✅ `https://www.youtube-nocookie.com/embed/VIDEO_ID`  
✅ `https://www.youtube.com/watch?v=VIDEO_ID`  
✅ `https://youtu.be/VIDEO_ID`

---

## Sådan virker det i appen

Når brugeren åbner et MCT-kort med en YouTube video:

1. **Automatisk detektion**: Appen finder alle YouTube iframes i kortets indhold
2. **Native afspiller**: YouTube iframe'en erstattes med en native YouTube afspiller
3. **Direkte afspilning**: Brugeren kan afspille videoen direkte i appen uden fejl
4. **Optimeret visning**: Videoen vises i 16:9 format tilpasset skærmstørrelsen

---

## Tips & Best Practices

### ✅ Gør dette:
- Brug standard YouTube embed-kode fra YouTube's "Del" funktion
- Placer videoen hvor den giver mening i kortets indhold
- Test videoens visning i appen efter upload

### ❌ Undgå dette:
- Indsæt ikke flere versioner af samme video (kun én iframe per video)
- Undgå at modificere iframe embed-koden manuelt
- Brug ikke private eller geo-blokkerede videoer

---

## Fejlfinding

**Problem**: Videoen vises ikke i appen  
**Løsning**: 
- Tjek at YouTube URL'en er korrekt
- Kontrollér at videoen ikke er privat eller slettet
- Genindlæs kortet i appen

**Problem**: Videoen vises to gange  
**Løsning**: 
- Fjern duplikerede YouTube iframes i WordPress editoren

---

## Teknisk information (for udviklere)

- Appen bruger `react-native-youtube-iframe` pakke til native afspilning
- YouTube iframes detekteres automatisk via regex pattern matching
- Video ID ekstraheres fra iframe src attribut
- Original iframe fjernes fra HTML for at undgå duplikering
- Resten af kortets indhold vises normalt i WebView

---

## Support

Ved spørgsmål eller problemer, kontakt:

**Lars Nissen Corell**  
Email: kontakt@corehypnose.dk  
Telefon: 27 20 46 71
