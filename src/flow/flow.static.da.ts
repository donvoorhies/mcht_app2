/**
 * Static Flow Definition - MCT Process Cards & Hubs
 * Source: MCT App – Hubs og Proceskort PDF
 * 
 * This file defines the static structure of therapeutic hubs and process cards.
 * Content is fetched from WordPress by UID.
 */

export type ProcessCard = {
  id: string;
  title: string;
  uid: string; // WordPress card UID for fetching content via /wp-json/mct/v1/cards/{uid}
  nextCardId?: string; // Optional link to next card in sequence
};

export type Hub = {
  id: string;
  title: string;
  type: 'process' | 'static'; // process = has cards, static = native app screen
  screen?: string; // For static/native screens (OVERBLIK, INFO)
  cards?: ProcessCard[]; // For process hubs
};

/**
 * All Process Cards in the MCT system
 * 
 * NOTE: Only one real UID is currently available for testing:
 * - START – Testkort (Wells): 5761b700-a13d-44ae-9bc6-fb93da53c708
 * All other cards have TODO-UID placeholders until real UIDs are provided.
 */
export const processCards: ProcessCard[] = [
  // START hub cards
  { id: 'start-test-wells', title: 'START – Testkort (Wells)', uid: '5761b700-a13d-44ae-9bc6-fb93da53c708' },
  { id: 'start-hvad-er-cas', title: 'Hvad er CAS?', uid: 'TODO-UID-start-cas' },
  { id: 'start-socialisering', title: 'Socialisering i MCT', uid: 'TODO-UID-start-social' },

  // TRÆN-ATT hub cards
  { id: 'train-att-basic', title: 'ATT Basic', uid: 'TODO-UID-att-basic' },
  { id: 'train-att-variations', title: 'ATT Variationer', uid: 'TODO-UID-att-var' },

  // TRÆN-DM hub cards
  { id: 'train-dm-basic', title: 'DM Basic', uid: 'TODO-UID-dm-basic' },

  // STOP CAS hub cards
  { id: 'stop-bekymring', title: 'Bekymring', uid: 'TODO-UID-stop-worry' },
  { id: 'stop-grubling', title: 'Grubling', uid: 'TODO-UID-stop-rumination' },
  { id: 'stop-trusselsmonitorering', title: 'Trusselsmonitorering', uid: 'TODO-UID-stop-threat' },
  { id: 'stop-coping', title: 'Coping/Safety behaviors', uid: 'TODO-UID-stop-coping' },

  // TEST ANTAGELSER hub cards
  { id: 'test-positive', title: 'Positive metakognitive antagelser', uid: 'TODO-UID-test-pos' },
  { id: 'test-negative', title: 'Negative metakognitive antagelser', uid: 'TODO-UID-test-neg' },

  // NYE PLANER hub cards (not mentioned in hubs list but in process cards)
  { id: 'nye-planer-metaplan', title: 'Personlig metaplan', uid: 'TODO-UID-nye-metaplan' },

  // VEDLIGEHOLDELSE hub cards
  { id: 'vedligeholdelse-generalisering', title: 'Generalisering', uid: 'TODO-UID-vedl-general' },
  { id: 'vedligeholdelse-tilbagefald', title: 'Tilbagefaldsforebyggelse', uid: 'TODO-UID-vedl-relapse' },
];

/**
 * All Hubs in the MCT system
 */
export const hubs: Hub[] = [
  {
    id: 'start',
    title: 'START',
    type: 'process',
    cards: processCards.filter(c => c.id.startsWith('start-')),
  },
  {
    id: 'train',
    title: 'TRÆN',
    type: 'process',
    cards: [], // Parent hub - might show sub-hubs or all training cards
  },
  {
    id: 'train-att',
    title: 'TRÆN–ATT',
    type: 'process',
    cards: processCards.filter(c => c.id.startsWith('train-att-')),
  },
  {
    id: 'train-dm',
    title: 'TRÆN–DM',
    type: 'process',
    cards: processCards.filter(c => c.id.startsWith('train-dm-')),
  },
  {
    id: 'stop-cas',
    title: 'STOP CAS',
    type: 'process',
    cards: processCards.filter(c => c.id.startsWith('stop-')),
  },
  {
    id: 'test-antagelser',
    title: 'TEST ANTAGELSER',
    type: 'process',
    cards: processCards.filter(c => c.id.startsWith('test-')),
  },
  {
    id: 'nye-planer',
    title: 'NYE PLANER',
    type: 'process',
    cards: processCards.filter(c => c.id.startsWith('nye-planer-')),
  },
  {
    id: 'vedligeholdelse',
    title: 'VEDLIGEHOLDELSE',
    type: 'process',
    cards: processCards.filter(c => c.id.startsWith('vedligeholdelse-')),
  },
  {
    id: 'overblik',
    title: 'OVERBLIK',
    type: 'static',
    screen: 'Overblik', // TODO: Create this native screen
  },
  {
    id: 'info',
    title: 'INFO',
    type: 'static',
    screen: 'Info', // TODO: Create this native screen
  },
];

/**
 * Get all cards for a specific hub
 */
export function getHubCards(hubId: string): ProcessCard[] {
  const hub = hubs.find(h => h.id === hubId);
  return hub?.cards || [];
}

/**
 * Get a card by its ID
 */
export function getCardById(cardId: string): ProcessCard | undefined {
  return processCards.find(c => c.id === cardId);
}

/**
 * Get the next card in a sequence
 */
export function getNextCard(currentCardId: string): ProcessCard | undefined {
  const currentCard = getCardById(currentCardId);
  if (!currentCard?.nextCardId) return undefined;
  return getCardById(currentCard.nextCardId);
}
