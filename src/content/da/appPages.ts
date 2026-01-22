/**
 * App Pages Content - Danish
 * Static app pages (overview, info) with their textual content
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
