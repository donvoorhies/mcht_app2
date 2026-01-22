/**
 * Danish UX strings for MCHT app
 * Centralized translation strings
 */

export const danishStrings = {
  // Common actions
  common: {
    retry: 'Prøv igen',
    close: 'Luk',
    ok: 'OK',
    cancel: 'Annuller',
    loading: 'Indlæser...',
    openInBrowser: 'Åbn i browser',
  },

  // Manifest loading states
  manifest: {
    loading: 'Henter indhold...',
    offline: 'Offline - viser cached indhold',
    errorNoCache: 'Kunne ikke hente indhold. Kontroller din internetforbindelse.',
    errorWithCache: 'Kunne ikke opdatere - viser cached indhold',
    incompatibleVersion: 'App-opdatering påkrævet',
    fetchFailed: 'Kunne ikke hente manifest',
  },

  // Hub navigation
  hub: {
    title: 'MCHT',
    loading: 'Indlæser navigation...',
    cachedIndicator: 'Offline',
  },

  // Sessions list / Process cards
  sessions: {
    title: 'Proceskort',
    loading: 'Indlæser proceskort...',
    empty: 'Ingen proceskort tilgængelige',
    duration: 'min',
  },
  
  // Process flow
  flow: {
    selectHub: 'Vælg et område',
    noCardsInHub: 'Ingen proceskort i dette område',
  },

  // Card/session loading
  card: {
    loading: 'Indlæser...',
    error: 'Kunne ikke indlæse indhold',
    notFound: 'Indhold ikke fundet',
  },

  // WebView states
  webview: {
    loading: 'Indlæser side...',
    errorTitle: 'Siden kunne ikke indlæses',
    errorMessage: 'Der opstod en fejl ved indlæsning af siden.',
    errorOffline: 'Ingen internetforbindelse',
    errorTimeout: 'Forbindelsen fik timeout',
    errorGeneric: 'Noget gik galt',
    navigationBlocked: 'Navigation blokeret - kun tilladt til {domain}',
  },
} as const;

export type DanishStrings = typeof danishStrings;
