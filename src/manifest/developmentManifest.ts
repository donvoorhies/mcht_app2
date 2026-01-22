/**
 * Development fallback manifest
 * Used when WordPress endpoint is not available
 */

import type { Manifest } from './manifest.types';

export const developmentManifest: Manifest = {
  schemaVersion: '1.0',
  appConfig: {
    baseWebUrl: 'https://mcht.voorhies.dk',
  },
  content: {
    revision: new Date().toISOString(),
  },
  hub: [
    {
      id: 'sessions',
      title: 'Sessioner',
      type: 'native',
      screen: 'Sessions',
    },
    {
      id: 'about',
      title: 'Om MCHT',
      type: 'web',
      path: '/om-os',
    },
    {
      id: 'contact',
      title: 'Kontakt',
      type: 'web',
      path: '/kontakt',
    },
  ],
  cardsIndex: [
    {
      uid: 'session-1',
      title: 'Introduktion til mindfulness',
      phase: 'Fase 1',
      durationMin: 15,
    },
    {
      uid: 'session-2',
      title: 'Kropsscanning',
      phase: 'Fase 1',
      durationMin: 20,
    },
    {
      uid: 'session-3',
      title: 'Vejrtrækning og nærvær',
      phase: 'Fase 2',
      durationMin: 12,
    },
  ],
};
