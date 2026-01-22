/**
 * Static Pages Content - Danish
 * All hub pages, process card pages, and app pages with their textual content
 * 
 * Source: MCT færdige hub og proceskort tekster.pdf
 */

export type PageLink = {
  title: string;
  slug: string;
};

export type StaticPage = {
  type: 'hub' | 'process' | 'app';
  slug: string;
  title: string;
  body: string[];
  links?: PageLink[];
};

/**
 * All static pages indexed by slug
 */
export const staticPages: Record<string, StaticPage> = {
  // HUB PAGES
  '/start': {
    type: 'hub',
    slug: '/start',
    title: 'START – Forstå forløbet',
    body: [
      'Denne sektion giver et overblik over forløbets begyndelse og samler de første trin.',
      'Vælg et trin herunder for at åbne det tilhørende materiale.',
    ],
    links: [
      { title: 'Hvad er CAS?', slug: '/start/cas' },
      { title: 'Socialisering i MCT', slug: '/start/socialisering' },
    ],
  },

  '/train': {
    type: 'hub',
    slug: '/train',
    title: 'TRÆN – Vælg træningsspor',
    body: [
      'Denne sektion samler de træningsspor, der anvendes i forløbet.',
      'Vælg et spor for at se de tilhørende trin.',
    ],
    links: [
      { title: 'Opmærksomhed (ATT)', slug: '/train/att' },
      { title: 'Afkobling (DM)', slug: '/train/dm' },
    ],
  },

  '/train/att': {
    type: 'hub',
    slug: '/train/att',
    title: 'TRÆN – Opmærksomhed (ATT)',
    body: [
      'Denne side samler trin relateret til opmærksomhedstræning.',
      'Vælg et trin for at åbne det tilhørende materiale.',
    ],
    links: [
      { title: 'ATT Basic', slug: '/train/att/basic' },
      { title: 'ATT Variationer', slug: '/train/att/variationer' },
    ],
  },

  '/train/dm': {
    type: 'hub',
    slug: '/train/dm',
    title: 'TRÆN – Afkobling (DM)',
    body: [
      'Denne side samler trin relateret til afkobling.',
      'Vælg et trin for at åbne det tilhørende materiale.',
    ],
    links: [
      { title: 'DM Basic: tanker som events', slug: '/train/dm/basic' },
    ],
  },

  '/stop-cas': {
    type: 'hub',
    slug: '/stop-cas',
    title: 'STOP CAS – Trinoversigt',
    body: [
      'Denne sektion samler trin i STOP CAS-delen af forløbet.',
      'Vælg et trin herunder for at åbne det tilhørende materiale.',
    ],
    links: [
      { title: 'Bekymring', slug: '/stop-cas/bekymring' },
      { title: 'Grubling', slug: '/stop-cas/grubling' },
      { title: 'Trusselsmonitorering', slug: '/stop-cas/trusselsmonitorering' },
      { title: 'Coping / Safety behaviors', slug: '/stop-cas/coping' },
    ],
  },

  '/test-antagelser': {
    type: 'hub',
    slug: '/test-antagelser',
    title: 'TEST ANTAGELSER – Trinoversigt',
    body: [
      'Denne sektion samler trin, der anvendes i arbejdet med antagelser.',
      'Vælg et trin herunder for at åbne det tilhørende materiale.',
    ],
    links: [
      { title: 'Positive metakognitive antagelser', slug: '/test-antagelser/positive' },
      { title: 'Negative metakognitive antagelser', slug: '/test-antagelser/negative' },
    ],
  },

  '/vedligeholdelse': {
    type: 'hub',
    slug: '/vedligeholdelse',
    title: 'VEDLIGEHOLDELSE – Trinoversigt',
    body: [
      'Denne sektion samler trin, der anvendes i vedligeholdelsesdelen af forløbet.',
      'Vælg et trin herunder for at åbne det tilhørende materiale.',
    ],
    links: [
      { title: 'Generalisering', slug: '/vedligeholdelse/generalisering' },
      { title: 'Tilbagefaldsforebyggelse', slug: '/vedligeholdelse/tilbagefald' },
    ],
  },

  // APP PAGES
  '/overblik': {
    type: 'app',
    slug: '/overblik',
    title: 'OVERBLIK – Status og næste skridt',
    body: [
      'Denne side viser din aktuelle status i forløbet.',
      'Her vises også et anbefalet næste skridt.',
    ],
  },

  '/info': {
    type: 'app',
    slug: '/info',
    title: 'INFO – Ansvar og data',
    body: [
      'Denne side indeholder information om brug af appen, ansvar og data.',
      'Ved akut behov for hjælp skal relevante lokale hjælpetilbud og alarmtjenester benyttes.',
    ],
  },

  // PROCESS CARD PAGES
  '/start/cas': {
    type: 'process',
    slug: '/start/cas',
    title: 'START – Hvad er CAS?',
    body: [
      'Dette er et trin i forløbet.',
      'På denne side vises det materiale, der hører til dette trin.',
      'Når materialet er gennemført, kan du fortsætte til næste trin.',
    ],
  },

  '/start/socialisering': {
    type: 'process',
    slug: '/start/socialisering',
    title: 'START – Socialisering i MCT',
    body: [
      'Dette er et trin i forløbet.',
      'På denne side vises det materiale, der hører til dette trin.',
      'Når materialet er gennemført, kan du fortsætte til næste trin.',
    ],
  },

  '/train/att/basic': {
    type: 'process',
    slug: '/train/att/basic',
    title: 'TRÆN – ATT Basic',
    body: [
      'Dette er et trin i forløbet.',
      'På denne side vises det materiale, der hører til dette trin.',
      'Når materialet er gennemført, kan du fortsætte til næste trin.',
    ],
  },

  '/train/att/variationer': {
    type: 'process',
    slug: '/train/att/variationer',
    title: 'TRÆN – ATT Variationer',
    body: [
      'Dette er et trin i forløbet.',
      'På denne side vises det materiale, der hører til dette trin.',
      'Når materialet er gennemført, kan du fortsætte til næste trin.',
    ],
  },

  '/train/dm/basic': {
    type: 'process',
    slug: '/train/dm/basic',
    title: 'TRÆN – DM Basic: tanker som events',
    body: [
      'Dette er et trin i forløbet.',
      'På denne side vises det materiale, der hører til dette trin.',
      'Når materialet er gennemført, kan du fortsætte til næste trin.',
    ],
  },

  '/stop-cas/bekymring': {
    type: 'process',
    slug: '/stop-cas/bekymring',
    title: 'STOP CAS – Bekymring',
    body: [
      'Dette er et trin i forløbet.',
      'På denne side vises det materiale, der hører til dette trin.',
      'Når materialet er gennemført, kan du fortsætte til næste trin.',
    ],
  },

  '/stop-cas/grubling': {
    type: 'process',
    slug: '/stop-cas/grubling',
    title: 'STOP CAS – Grubling',
    body: [
      'Dette er et trin i forløbet.',
      'På denne side vises det materiale, der hører til dette trin.',
      'Når materialet er gennemført, kan du fortsætte til næste trin.',
    ],
  },

  '/stop-cas/trusselsmonitorering': {
    type: 'process',
    slug: '/stop-cas/trusselsmonitorering',
    title: 'STOP CAS – Trusselsmonitorering',
    body: [
      'Dette er et trin i forløbet.',
      'På denne side vises det materiale, der hører til dette trin.',
      'Når materialet er gennemført, kan du fortsætte til næste trin.',
    ],
  },

  '/stop-cas/coping': {
    type: 'process',
    slug: '/stop-cas/coping',
    title: 'STOP CAS – Coping / Safety behaviors',
    body: [
      'Dette er et trin i forløbet.',
      'På denne side vises det materiale, der hører til dette trin.',
      'Når materialet er gennemført, kan du fortsætte til næste trin.',
    ],
  },

  '/test-antagelser/positive': {
    type: 'process',
    slug: '/test-antagelser/positive',
    title: 'TEST – Positive metakognitive antagelser',
    body: [
      'Dette er et trin i forløbet.',
      'På denne side vises det materiale, der hører til dette trin.',
      'Når materialet er gennemført, kan du fortsætte til næste trin.',
    ],
  },

  '/test-antagelser/negative': {
    type: 'process',
    slug: '/test-antagelser/negative',
    title: 'TEST – Negative metakognitive antagelser',
    body: [
      'Dette er et trin i forløbet.',
      'På denne side vises det materiale, der hører til dette trin.',
      'Når materialet er gennemført, kan du fortsætte til næste trin.',
    ],
  },

  '/nye-planer/metaplan': {
    type: 'process',
    slug: '/nye-planer/metaplan',
    title: 'NYE PLANER – Personlig metaplan',
    body: [
      'Dette er et trin i forløbet.',
      'På denne side vises det materiale, der hører til dette trin.',
      'Når materialet er gennemført, kan du fortsætte til næste trin.',
    ],
  },

  '/vedligeholdelse/generalisering': {
    type: 'process',
    slug: '/vedligeholdelse/generalisering',
    title: 'VEDLIGEHOLDELSE – Generalisering',
    body: [
      'Dette er et trin i forløbet.',
      'På denne side vises det materiale, der hører til dette trin.',
      'Når materialet er gennemført, kan du fortsætte til næste trin.',
    ],
  },

  '/vedligeholdelse/tilbagefald': {
    type: 'process',
    slug: '/vedligeholdelse/tilbagefald',
    title: 'VEDLIGEHOLDELSE – Tilbagefaldsforebyggelse',
    body: [
      'Dette er et trin i forløbet.',
      'På denne side vises det materiale, der hører til dette trin.',
      'Når materialet er gennemført, kan du fortsætte til næste trin.',
    ],
  },
};

/**
 * Top-level hub slugs (for main menu)
 */
export const topLevelHubs = [
  '/start',
  '/train',
  '/stop-cas',
  '/test-antagelser',
  '/vedligeholdelse',
  '/overblik',
  '/info',
];

/**
 * Get a page by slug
 */
export function getPageBySlug(slug: string): StaticPage | undefined {
  return staticPages[slug];
}
