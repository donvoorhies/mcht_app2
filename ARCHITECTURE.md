# MCHT App - Architecture Documentation

## Project Overview

This is a **React Native** mobile application for delivering **Metacognitive Therapy (MCT)** content. The app combines static Danish UI text with dynamic therapeutic content from WordPress, allowing therapists to update exercises and materials without requiring app rebuilds.

---

## Key Design Principles

### 1. **Hybrid Content Model**
- **Static Content** (Requires rebuild): Hub navigation, intro text, UI strings
- **Dynamic Content** (No rebuild): Therapeutic exercises, audio, videos from WordPress
- **Why**: Therapists can update therapy content independently of developers

### 2. **Offline-First**
- Progress stored in AsyncStorage (survives app restarts)
- WordPress manifest cached locally
- App works without internet for visited content

### 3. **Progress Tracking**
- Automatic tracking of visited hubs and cards
- No manual "mark complete" buttons
- Used for recommendations and completion visualization

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.83.1 | Mobile framework |
| TypeScript | 5.8.3 | Type safety |
| React Navigation | v6 | App navigation |
| AsyncStorage | - | Data persistence |
| react-native-youtube-iframe | - | Native YouTube player |
| WordPress REST API | - | Dynamic content source |

---

## Project Structure

```
mcht_app2/
├── App.tsx                      # Main app component
├── index.js                     # React Native entry point
├── android/                     # Android-specific code
├── ios/                         # iOS-specific code (currently unused)
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── ContactBox.tsx       # Therapist contact info
│   │   ├── Footer.tsx           # Copyright footer
│   │   ├── TextWithLinks.tsx    # Auto-clickable links/phones
│   │   └── YouTubeEmbed.tsx     # Native YouTube player
│   │
│   ├── content/                 # Static content layer
│   │   ├── da/                  # Danish content
│   │   │   ├── hubs.ts          # Hub page text (5 hubs)
│   │   │   ├── process.ts       # Process card intro text (14 cards)
│   │   │   └── appPages.ts      # Special pages (overview, info)
│   │   ├── index.ts             # Central export
│   │   └── contentManifestMapper.ts  # Maps processId → WordPress UID
│   │
│   ├── manifest/                # WordPress manifest system
│   │   ├── manifest.types.ts    # TypeScript types
│   │   ├── manifest.service.ts  # Fetch & cache manifest
│   │   ├── developmentManifest.ts  # Fallback data
│   │   └── useManifest.ts       # React hook
│   │
│   ├── navigation/
│   │   └── AppNavigator.tsx     # Main navigation container
│   │
│   ├── screens/                 # All app screens
│   │   ├── OnboardingScreen.tsx       # First-time intro (4 slides)
│   │   ├── HubScreen.tsx              # Main menu
│   │   ├── HubDetailScreen.tsx        # Hub content + links
│   │   ├── ProcessCardScreen.tsx      # Intro + WordPress content
│   │   ├── AppPageScreen.tsx          # Routes to special pages
│   │   ├── OverviewScreen.tsx         # Progress tracking display
│   │   └── ...
│   │
│   ├── stores/                  # Data persistence
│   │   ├── progressStore.ts     # Track visited items
│   │   └── onboardingStore.ts   # Onboarding flag
│   │
│   ├── i18n/                    # Internationalization
│   │   ├── index.ts             # Language system
│   │   └── strings.da.ts        # Danish UI strings
│   │
│   ├── config.ts                # WordPress URL config
│   └── types.ts                 # Shared TypeScript types
│
├── WORDPRESS_SLUG_REFERENCE.md  # Guide for WordPress admin
├── YOUTUBE_GUIDE.md             # YouTube embedding guide
└── ARCHITECTURE.md              # This file
```

---

## Navigation Flow

```
App Startup
    ↓
Check Onboarding Status (AsyncStorage)
    ↓
    ├─→ Not Seen → OnboardingScreen (4 slides)
    │                   ↓
    │               Set flag in AsyncStorage
    │                   ↓
    └─→ Already Seen → HubScreen (Main Menu)
                            ↓
                    ┌───────┴───────┐
                    ↓               ↓
            HubDetail (5 hubs)   AppPage (2 pages)
                    ↓               ↓
            ProcessCard         OverviewScreen or InfoPage
         (Intro + WordPress)
```

### Screen Responsibilities

| Screen | Purpose | Data Source |
|--------|---------|-------------|
| `OnboardingScreen` | First-time introduction | Static (4 slides) |
| `HubScreen` | Main menu | content/da/hubs.ts |
| `HubDetailScreen` | Hub content + navigation | content/da/hubs.ts |
| `ProcessCardScreen` | Therapeutic content | content/da/process.ts + WordPress |
| `OverviewScreen` | Progress tracking | progressStore |
| `AppPageScreen` | Router for special pages | content/da/appPages.ts |

---

## Content Layer Explained

### Three Content Types

#### 1. **Hubs** (`src/content/da/hubs.ts`)
- Top-level navigation structure
- 5 therapy phases: START, TRÆN, STOP CAS, TEST, VEDLIGEHOLDELSE
- Contains title, paragraphs, bullets, nextLinks
- Rendered by `HubDetailScreen`

#### 2. **Process Cards** (`src/content/da/process.ts`)
- 14 therapeutic process cards
- Each has:
  - Danish intro text (static)
  - WordPress UID (dynamic content link)
- Rendered by `ProcessCardScreen`

#### 3. **App Pages** (`src/content/da/appPages.ts`)
- Special pages: overview, info
- info: Disclaimer, privacy, contact
- overview: Handled specially by `OverviewScreen`

### Content Update Workflow

**Static Content (Requires App Rebuild):**
1. Edit `src/content/da/*.ts` files
2. Rebuild app: `npm run android`
3. Reinstall on devices

**Dynamic Content (No Rebuild):**
1. Log into WordPress admin
2. Create/edit MCT card
3. Publish
4. App fetches automatically

---

## WordPress Integration

### REST API Endpoints

| Endpoint | Method | Purpose | Returns |
|----------|--------|---------|---------|
| `/wp-json/mct/v1/manifest` | GET | List all cards | `{ version, cardsIndex[] }` |
| `/wp-json/mct/v1/cards/{uid}` | GET | Get card content | `{ uid, title, content, ... }` |

### UID Resolution Flow

```
1. User taps process card button
       ↓
2. Navigate to ProcessCardScreen with processId
       ↓
3. ProcessCardScreen loads manifest
       ↓
4. contentManifestMapper.ts:
   - Maps processId → slug
   - Finds slug in manifest
   - Returns UID
       ↓
5. Fetch WordPress card by UID
       ↓
6. Display content
```

### Manifest Caching

- **Key**: `@mcht_manifest_v1` in AsyncStorage
- **Strategy**: Fetch fresh, fall back to cache on error
- **Expiry**: Never (cache always better than nothing)
- **Validation**: Schema validation on every load

---

## Progress Tracking System

### Data Model

```typescript
{
  visitedHubs: string[],           // ['start', 'train', ...]
  visitedProcessCards: string[],   // ['start_cas', 'train_att_basic', ...]
  completedHubs: string[],         // (Future use)
  lastVisited: string,             // Last item ID
  lastVisitedAt: number            // Timestamp
}
```

### Automatic Tracking

- `HubDetailScreen` → Calls `progressStore.markHubVisited(hubId)` on load
- `ProcessCardScreen` → Calls `progressStore.markProcessCardVisited(processId)` on load
- No manual user action required

### Used By

- **OverviewScreen**: Calculates completion percentages
- **Recommendations**: Suggests next steps based on progress
- **Future**: Could unlock content based on completion

---

## YouTube Video Handling

### The Problem

React Native WebView **cannot** play YouTube iframes due to Error 153 (configuration error).

### The Solution

1. **Extract YouTube URLs** from WordPress HTML using regex
2. **Remove iframes** from HTML
3. **Render native player** using `react-native-youtube-iframe`
4. **Render cleaned HTML** in WebView below videos

### Implementation

**ProcessCardScreen.tsx:**
```typescript
// Extract all YouTube iframe URLs
const youtubeUrls = extractYouTubeUrls(card.content);

// Remove iframes from HTML
const cleanedHtml = removeYouTubeIframes(card.content);

// Render native players
{youtubeUrls.map(url => (
  <YouTubeEmbed url={url} height={200} />
))}

// Render cleaned HTML
<WebView html={cleanedHtml} />
```

**YouTubeEmbed.tsx:**
- Extracts video ID from URL
- Supports multiple URL formats
- Uses `YoutubePlayer` component

---

## Component Patterns

### Footer Positioning

**❌ WRONG** (Footer jumps with scroll):
```tsx
<ScrollView>
  <Content />
  <Footer />
</ScrollView>
```

**✅ CORRECT** (Footer fixed at bottom):
```tsx
<ScrollView>
  <Content />
</ScrollView>
<Footer />
```

### TextWithLinks Usage

Automatically makes URLs and phone numbers clickable, **except 112**:

```tsx
<TextWithLinks>
  Ring til Livslinjen: 70 201 201
  Besøg www.livslinjen.dk
  I akutte tilfælde: 112
</TextWithLinks>
```
- `70 201 201` → Clickable (opens dialer)
- `www.livslinjen.dk` → Clickable (opens browser)
- `112` → NOT clickable (prevents accidental emergency calls)

---

## Key Files to Know

### Entry Points
- `index.js` - React Native bootstrap
- `App.tsx` - Main component
- `src/navigation/AppNavigator.tsx` - Navigation setup

### Core Logic
- `src/screens/ProcessCardScreen.tsx` - WordPress integration
- `src/content/contentManifestMapper.ts` - UID mapping
- `src/manifest/manifest.service.ts` - Manifest fetching
- `src/stores/progressStore.ts` - Progress tracking

### UI Components
- `src/components/YouTubeEmbed.tsx` - Video player
- `src/components/TextWithLinks.tsx` - Link detection
- `src/components/ContactBox.tsx` - Therapist contact
- `src/components/Footer.tsx` - Copyright footer

### Content
- `src/content/da/hubs.ts` - Hub pages (5 hubs)
- `src/content/da/process.ts` - Process cards (14 cards)
- `src/content/da/appPages.ts` - Special pages (2 pages)

---

## Development Commands

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android (debug)
npm run android

# Build release APK
cd android && ./gradlew assembleRelease

# Build release AAB (Google Play)
cd android && ./gradlew bundleRelease

# Clear cache
npx react-native start --reset-cache
```

---

## Firebase Distribution

Release files are uploaded to Firebase App Distribution:

```bash
firebase appdistribution:distribute \
  android/app/build/outputs/apk/release/app-release.apk \
  --app 1:279719713452:android:9ee8e0e172e2c5d1645d09 \
  --release-notes "Version notes here"
```

**Project Info:**
- Project ID: `mcht-prototype`
- Package: `com.mchtapp`
- Firebase config: `android/app/google-services.json`

---

## Debugging Tips

### Common Issues

**1. "Manifest empty" / "UID not found"**
- Check WordPress REST API is accessible
- Verify `/wp-json/mct/v1/manifest` returns data
- Check contentManifestMapper processIdToSlugMap

**2. "YouTube Error 153"**
- This is expected if using WebView iframes
- Solution: Use YouTubeEmbed component (already implemented)

**3. "Footer jumping around"**
- Ensure Footer is OUTSIDE ScrollView
- See "Component Patterns" section above

**4. Progress not saving**
- Check AsyncStorage permissions
- Verify progressStore methods are being called
- Use `adb logcat` to see console.log output

### Useful Commands

```bash
# View React Native logs
npx react-native log-android

# Clear AsyncStorage (reset progress)
adb shell run-as com.mchtapp rm -rf /data/data/com.mchtapp/shared_prefs

# Inspect manifest cache
# Use React Native Debugger or console.log in manifest.service.ts
```

---

## Future Enhancements

### Potential Features
- [ ] iOS support (currently Android-only)
- [ ] Audio playback for ATT exercises
- [ ] Push notifications for reminders
- [ ] Export progress to PDF
- [ ] Multi-language support (currently Danish only)
- [ ] Dark mode
- [ ] Accessibility improvements

### Technical Improvements
- [ ] Unit tests for core logic
- [ ] E2E tests with Detox
- [ ] CI/CD pipeline
- [ ] Automated Firebase uploads
- [ ] Error tracking (Sentry)
- [ ] Analytics (Firebase Analytics)

---

## WordPress Setup Requirements

### Required WordPress Plugins
- MCT Custom Plugin (provides REST API endpoints)
- Must support endpoints:
  - `/wp-json/mct/v1/manifest`
  - `/wp-json/mct/v1/cards/{uid}`

### Card Structure
Each WordPress MCT card should have:
- **Title**: Display name
- **Content**: HTML content (text, images, YouTube iframes)
- **Status**: `publish` (only published cards shown in manifest)
- **UID**: Unique identifier (auto-generated)
- **Slug**: URL-friendly identifier (optional but recommended)

### Content Guidelines
- Use WordPress blocks for formatting
- Embed YouTube via YouTube block or iframe
- Images should be optimized for mobile
- Avoid complex JavaScript (app uses WebView)

---

## Contact & Support

**Developer:**
- Repository: github.com/donvoorhies/mcht_app2

**Therapist/Content Manager:**
- Lars Nissen Corell
- Email: kontakt@corehypnose.dk
- Phone: 27 20 46 71
- Website: www.corehypnose.dk

**Documentation:**
- WORDPRESS_SLUG_REFERENCE.md - WordPress admin guide
- YOUTUBE_GUIDE.md - Video embedding guide
- ARCHITECTURE.md - This file

---

## License & Disclaimer

This app is a therapeutic tool. See INFO page in app for full disclaimer.

**Important:**
- Not a replacement for professional therapy
- Users must accept disclaimer before use
- Contains crisis resource information
- Data privacy considerations apply

---

*Last Updated: January 2026*
*App Version: 1.0*
*React Native: 0.83.1*
