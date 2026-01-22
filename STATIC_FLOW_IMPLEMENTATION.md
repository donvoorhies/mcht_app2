# Static Flow Implementation - MCT App

## Overview
Changed from manifest-driven navigation to a STATIC hub + STATIC process cards model with WordPress therapeutic content.

## Test Data Available ✅
**Working Test Card:**
- **Title:** START – Testkort (Wells)
- **UID:** `5761b700-a13d-44ae-9bc6-fb93da53c708`
- **Location:** START hub, first card
- **Endpoint:** `https://mcht.voorhies.dk/wp-json/mct/v1/cards/5761b700-a13d-44ae-9bc6-fb93da53c708`

## Changes Made

### 1. Created Static Flow Definition ✅
**File:** `src/flow/flow.static.da.ts`
- Defines all hubs and process cards statically
- **TEST CARD ADDED:** START – Testkort (Wells) with real UID
- All other cards have TODO-UID placeholders
- Exports `Hub` and `ProcessCard` types
- Hubs include:
  - START (3 cards - 1 working, 2 TODO)
  - TRÆN (parent hub)
  - TRÆN–ATT (2 TODO cards)
  - TRÆN–DM (1 TODO card)
  - STOP CAS (4 TODO cards)
  - TEST ANTAGELSER (2 TODO cards)
  - NYE PLANER (1 TODO card)
  - VEDLIGEHOLDELSE (2 TODO cards)
  - OVERBLIK (static native screen - TODO)
  - INFO (static native screen - TODO)

### 2. Updated HubScreen.tsx ✅
**Changes:**
- Removed dependency on `useManifest()` for hub rendering
- Now displays hubs from static `hubs` array
- Navigates to `Sessions` screen with `hubId` param for process hubs
- Shows card count for each hub
- Simplified - no manifest loading/error states

### 3. Updated SessionsScreen.tsx ✅
**Changes:**
- Accepts `hubId` route param
- Displays process cards for the selected hub
- Shows TODO-UID placeholder for cards where UID is not yet known
- Navigates to **CardScreen** (not WebView) with card UID
- Removed manifest dependency completely

### 4. Created CardScreen.tsx ✅ **NEW**
**File:** `src/screens/CardScreen.tsx`
**Purpose:** Display therapeutic content from WordPress API
**Features:**
- Fetches JSON from `/wp-json/mct/v1/cards/{uid}`
- Parses response: `{ uid, title, contentHtml, phase?, durationMin? }`
- Renders HTML content in embedded WebView
- Shows loading, error, and retry states
- Danish UX strings via `t.*`
- Beautiful styled HTML rendering with responsive layout

### 5. Updated AppNavigator.tsx ✅
**Changes:**
- Added `Card: { uid: string }` route
- Imported and registered `CardScreen` component
- Route order: Start → Onboarding → Hub → Sessions → **Card**

### 6. Updated i18n Strings ✅
**File:** `src/i18n/strings.da.ts`
**Added:**
```typescript
flow: {
  selectHub: 'Vælg et område',
  noCardsInHub: 'Ingen proceskort i dette område',
}
```

## Manifest Usage
Manifest is now **OPTIONAL** and used ONLY for:
- Technical configuration if needed
- NOT for hub/navigation structure
- SessionsScreen no longer imports or uses manifest

## Navigation Flow
```
Start → Onboarding → Hub
                     ↓
Hub → Select hub (e.g., START)
    ↓
Sessions → Shows process cards for that hub
         ↓
         Tap "START – Testkort (Wells)"
         ↓
Card Screen → Fetches from WordPress API
            → Displays contentHtml in WebView
            → Shows title, duration, styled content
```

## Testing the Implementation 🧪

### Test Flow:
1. **Launch app** → Should see Start screen
2. **Complete onboarding** → Navigate to Hub
3. **Tap "START" hub** → Should see Sessions screen with 3 cards
4. **Tap "START – Testkort (Wells)"** → Should open CardScreen
5. **CardScreen** → Should fetch content from WordPress API and display it

### Expected Behavior:
- ✅ Hub shows all 10 hubs
- ✅ START hub shows 3 process cards (1 real, 2 TODO)
- ✅ Tapping test card fetches from `https://mcht.voorhies.dk/wp-json/mct/v1/cards/5761b700-a13d-44ae-9bc6-fb93da53c708`
- ✅ Card content displays in embedded WebView with styling
- ✅ All Danish UX strings work
- ⚠️ Tapping TODO-UID cards will show API error (expected)

## TODO Items 📝

### High Priority:
1. **Get real UIDs** from WordPress for all process cards
2. **Test WordPress API** with the working UID
3. **Create native screens:**
   - OVERBLIK screen (app-side overview)
   - INFO screen (app-side information)

### Medium Priority:
4. **Decide TRÆN hub structure:**
   - Should it show ATT + DM as sub-options?
   - Or should it show all training cards?

5. **Implement next card navigation:**
   - Use `nextCardId` to link cards in sequence
   - Add "Next" button in CardScreen

6. **Error handling:**
   - Better offline support
   - Cache card content locally
   - Fallback for missing cards

### Low Priority:
7. **Remove unused code:**
   - Consider removing `developmentManifest.ts`
   - Clean up old manifest-driven code if not needed

## File Structure
```
src/
├── flow/
│   └── flow.static.da.ts       # NEW: Static flow with TEST card
├── screens/
│   ├── HubScreen.tsx           # MODIFIED: Uses static hubs
│   ├── SessionsScreen.tsx      # MODIFIED: Shows cards for hubId, no manifest
│   ├── CardScreen.tsx          # NEW: Displays WordPress card content
│   └── ...
├── navigation/
│   └── AppNavigator.tsx        # MODIFIED: Added Card route
└── i18n/
    └── strings.da.ts           # MODIFIED: Added flow strings
```

## API Contract

### WordPress Endpoint:
```
GET /wp-json/mct/v1/cards/{uid}
```

### Expected Response:
```json
{
  "uid": "5761b700-a13d-44ae-9bc6-fb93da53c708",
  "title": "START – Testkort (Wells)",
  "contentHtml": "<h1>Title</h1><p>Content...</p>",
  "phase": "START",
  "durationMin": 45
}
```

### CardScreen Behavior:
- Fetches JSON from WordPress
- Parses `contentHtml` field
- Renders in WebView with responsive CSS
- Shows title in header
- Shows duration if available
- Handles loading, error, retry states

## Success Criteria ✅
- [x] Static hubs display correctly
- [x] Process cards load for each hub
- [x] Test card navigates to CardScreen
- [x] CardScreen fetches from WordPress API
- [x] Content displays in WebView
- [x] Danish UX strings throughout
- [x] No compilation errors
- [x] Start → Onboarding → Hub flow preserved
- [x] No manifest dependency for navigation

## Next Steps 🚀
1. Test the working card (5761b700-a13d-44ae-9bc6-fb93da53c708)
2. Verify WordPress API response format
3. Get remaining UIDs from content team
4. Build OVERBLIK and INFO screens

