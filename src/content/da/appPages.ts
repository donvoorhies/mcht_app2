/**
 * App Pages Content - Special static pages (overview, info)
 * 
 * PURPOSE:
 *   - Content for non-therapeutic app pages
 *   - overview: Progress tracking page (handled by OverviewScreen)
 *   - info: Disclaimer, privacy, contact information
 * 
 * DIFFERENCES FROM OTHER CONTENT:
 *   - These pages don't link to WordPress
 *   - Completely static content
 *   - overview is unique: content here defines structure,
 *     but OverviewScreen generates actual progress display
 * 
 * APP PAGES:
 *   1. overview:
 *      - Shows user's progress through program
 *      - Calculates completion percentages
 *      - Provides recommendations for next steps
 *      - Uses progressStore to read visited hubs/cards
 *   
 *   2. info:
 *      - Critical disclaimer and liability text
 *      - Privacy information
 *      - Crisis resources (Livslinjen, 112)
 *      - Contact information (via ContactBox component)
 * 
 * LEGAL CONSIDERATIONS:
 *   - info page contains important legal disclaimers
 *   - Must be prominently accessible (yellow warning card on home)
 *   - Contains crisis hotline numbers
 *   - TextWithLinks component makes phones/URLs clickable
 *   - 112 specifically NOT made clickable (prevent accidental calls)
 * 
 * CONTENT UPDATES:
 *   - Changes require app rebuild
 *   - Disclaimer text should be reviewed by legal counsel
 *   - Crisis numbers should be verified for target country
 */

import type { ContentPage } from './hubs';

export const appPages: Record<string, ContentPage> = {
  overview: {
    title: 'OVERBLIK – din status og næste skridt',
    paragraphs: [
      'Her får du et overblik over:',
    ],
    bullets: [
      'hvad du har arbejdet med',
      'hvilke færdigheder du har trænet',
      'hvad der anbefales som næste skridt',
    ],
  },

  info: {
    title: 'INFO – ansvar, data og hjælp',
    paragraphs: [
      'Denne app er et selvhjælpsværktøj baseret på metakognitiv terapi.',
      '',
      'DISCLAIMER OG ANSVARSFRASKRIVELSE',
      '',
      'Denne applikation ("App") er designet som et refleksionsværktøj til metakognitiv træning og personlig udvikling. Appen er IKKE en erstatning for professionel psykologisk behandling, terapi, lægehjælp eller anden faglig rådgivning.',
      '',
      'VIGTIGT:',
    ],
    bullets: [
      'Appen er ikke designet til diagnosticering, behandling eller forebyggelse af psykiske eller medicinske tilstande',
      'Appen er ikke en erstatning for professionel behandling',
      'Hvis du oplever alvorlige psykiske problemer, selvmordstanker, eller andre krisesituationer, skal du kontakte akutte sundhedstjenester eller en kvalificeret fagperson umiddelbart',
    ],
    paragraphsAfterBullets: [
      '',
      'BRUG PÅ EGET ANSVAR: Du anvender denne app på eget ansvar. Udviklerne og ejerne af denne app påtager sig intet ansvar for følger af brugen af appen eller indholdet deri.',
      '',
      'PRIVATLIV: Selvom vi tager databeskyttelse seriøst, kan ingen app garantere 100% sikkerhed. Brug appen bevidst om hvilke data du indtaster.',
      '',
      'Hvis du er i en krisesituation:',
      '• Ring til Livslinjen: 70 201 201 eller besøg www.livslinjen.dk',
      '• Ring til 112 i akutte tilfælde',
      '• Kontakt din egen læge eller den nærmeste psykiatriske akutmodtagelse',
      '',
      'Ved at bruge denne app accepterer du disse vilkår.',
    ],
  },
};
