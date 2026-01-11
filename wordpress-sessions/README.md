# WordPress Sessioner - Upload Klar

Denne mappe indeholder alle 10 sessioner som komplette, selvstændige HTML-filer klar til direkte upload i WordPress.

## 📁 Filstruktur

```
wordpress-sessions/
├── Session-1-Velegnethed-og-Identitet.html
├── Session-2-Selvbevidsthed-i-Praksis.html
├── Session-3-Stresshaandtering.html
├── Session-4-Empatisk-Kommunikation.html
├── Session-5-Graensesoetning.html
├── Session-6-Selvmedlidenhed.html
├── Session-7-Konflikthaandtering.html
├── Session-8-Vaerdibaseret-Liv.html
├── Session-9-Aktiveringsstyring.html
└── Session-10-Accept-og-Forandring.html
```

## 📋 Sessions Oversigt

| Session | Titel | Kategori | Varighed |
|---------|-------|----------|----------|
| 1 | Velegnethed og Identitet | Identitet | 15 min |
| 2 | Selvbevidsthed i Praksis | Selvbevidsthed | 20 min |
| 3 | Stresshåndtering | Træning | 15 min |
| 4 | Empatisk Kommunikation | Kommunikation | 20 min |
| 5 | Grænsesætning | Træning | 15 min |
| 6 | Selvmedlidenhed | Selvbevidsthed | 18 min |
| 7 | Konflikthåndtering | Kommunikation | 20 min |
| 8 | Værdibaseret Liv | Identitet | 18 min |
| 9 | Aktiveringsstyring | Træning | 15 min |
| 10 | Accept og Forandring | Selvbevidsthed | 20 min |

## 🚀 WordPress Upload Instruktioner

### Metode 1: Direkte HTML Upload (Anbefalet)

1. **Log ind på WordPress**: https://mcht.voorhies.dk/wp-admin/
2. **Opret ny side**:
   - Gå til `Sider` → `Tilføj ny`
   - Klik på de tre prikker (⋮) → `Kode-editor`
3. **Kopier HTML indhold**:
   - Åbn en sessionsfil (f.eks. Session-1-Velegnethed-og-Identitet.html)
   - Kopier **ALT** indhold fra filen
   - Indsæt i WordPress kode-editoren
4. **Indstillinger**:
   - **Titel**: Velegnethed og Identitet (session 1)
   - **URL slug**: `/session-1/` eller `/sessioner/velegnethed-og-identitet/`
   - **Forælder**: Vælg "Sessioner" som forælder-side (hvis den findes)
5. **Publicer**: Klik "Publicer"
6. **Gentag**: For alle 10 sessioner

### Metode 2: Via FTP/File Manager

1. Upload alle HTML filer til: `/wp-content/uploads/sessions/`
2. Opret WordPress sider der linker til disse filer
3. Brug shortcode eller iframe til at vise indholdet

### Metode 3: Custom Post Type (Avanceret)

Hvis du har adgang til at oprette Custom Post Types:
- Type: `mcht_session`
- Taxonomy: `session_category` (Identitet, Selvbevidsthed, Træning, Kommunikation)
- Template: Single-session template der loader HTML

## ✅ Hvad er inkluderet i hver fil?

Hver sessionsfil er **komplet og selvstændig** med:

- ✅ Komplet HTML struktur
- ✅ Alle CSS styles (inline)
- ✅ Al JavaScript funktionalitet (inline)
- ✅ Refleksionsspørgsmål med knap-baseret UI
- ✅ WebView bridge integration (SAVE_REFLECTION)
- ✅ Mobil-responsive design
- ✅ Link til refleksionsoversigten (`/refleksioner/`)
- ✅ Link tilbage til sessionsoversigten (`/sessioner/`)

**Ingen eksterne filer nødvendige!** Hver fil kan uploades og fungere umiddelbart.

## 🔗 Navigation Struktur

Anbefalet WordPress sidestruktur:

```
Hjem
├── Sessioner (oversigtsside)
│   ├── Session 1: Velegnethed og Identitet
│   ├── Session 2: Selvbevidsthed i Praksis
│   ├── Session 3: Stresshåndtering
│   ├── Session 4: Empatisk Kommunikation
│   ├── Session 5: Grænsesætning
│   ├── Session 6: Selvmedlidenhed
│   ├── Session 7: Konflikthåndtering
│   ├── Session 8: Værdibaseret Liv
│   ├── Session 9: Aktiveringsstyring
│   └── Session 10: Accept og Forandring
└── Refleksioner (visningsside for gemte refleksioner)
```

## 🎨 Styling

Alle filer bruger:
- **Primær farve**: #007AFF (iOS blå)
- **Success farve**: #28a745 (grøn)
- **Tekst farve**: #333
- **Baggrund**: #f5f5f5, #f9f9f9
- **Font**: System fonts (inherit from WordPress theme)

Styling er inline for at fungere uafhængigt af WordPress theme.

## 📱 App Integration

Hver sessionsfil kommunikerer med React Native appen via:

```javascript
window.ReactNativeWebView.postMessage(JSON.stringify({
  type: 'SAVE_REFLECTION',
  payload: {
    id: 'reflection-1-1234567890',
    sessionId: '1',
    sessionTitle: 'Velegnethed og Identitet',
    answers: { r1: {question: '...', answer: '...'} },
    text: 'Fri tekst refleksion...',
    createdAt: '2024-01-15T10:30:00.000Z'
  }
}));
```

Appen lytter efter disse beskeder og gemmer refleksionerne lokalt.

## 🔧 Fremtidig Optimering

Hvis du senere vil optimere:

1. **Ekstern CSS**: Flyt styles til `wordpress-mcht-styles.css` (findes i roden af projektet)
2. **Ekstern JS**: Konsolider JavaScript til en fælles fil
3. **WordPress Shortcodes**: Opret shortcodes for gentagende elementer
4. **Custom Fields**: Brug Advanced Custom Fields (ACF) til session metadata

Men for prototypen fungerer inline-versionen perfekt! ✨

## 📞 Support

Se disse filer for yderligere dokumentation:
- `WORDPRESS_SESSIONS_GUIDE.md` - Komplet implementeringsguide
- `SESSIONS_QUICK_REFERENCE.md` - Session konfigurationer
- `WORDPRESS_TEKSTER.md` - Alle session tekster
- `WORDPRESS_REFLECTIONS_PAGE.html` - Refleksionsoversigtsside

## ✨ Færdig!

Alle 10 sessioner er klar til upload. Du kan uploade dem én ad gangen eller alle på én gang.

**God fornøjelse med WordPress integrationen! 🎉**
