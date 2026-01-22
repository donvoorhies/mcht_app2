/**
 * Process Card Pages Content - Danish
 * All process card pages with their textual content and WordPress UIDs
 */

import type { ContentPage } from './hubs';

export type ProcessCardPage = ContentPage & {
  uid?: string; // WordPress card UID for fetching therapeutic content
};

export const processCards: Record<string, ProcessCardPage> = {
  start_cas: {
    title: 'START – Hvad er CAS?',
    paragraphs: [
      'CAS står for Cognitive Attentional Syndrome.',
      'CAS opstår, når du reagerer på tanker ved at:',
    ],
    bullets: [
      'bekymre dig',
      'gruble',
      'overvåge trusler',
      'forsøge at kontrollere eller undgå tanker',
    ],
    uid: 'CAS_INTRO',
  },

  start_socialisering: {
    title: 'START – Socialisering i MCT',
    paragraphs: [
      'I MCT arbejder vi ikke med at ændre tankers indhold.',
      'Det skyldes, at:',
    ],
    bullets: [
      'tanker opstår automatisk',
      'forsøg på kontrol ofte øger CAS',
      'vedligeholdelse sker via reaktion – ikke indhold',
    ],
    uid: 'TODO-UID-start-social',
  },

  train_att_basic: {
    title: 'TRÆN – ATT Basic',
    paragraphs: [
      'I denne øvelse træner du din opmærksomhed.',
      'Du vil øve dig i at:',
    ],
    bullets: [
      'rette fokus mod ét stimulus',
      'skifte fokus bevidst',
      'fordele opmærksomheden',
    ],
    uid: 'TODO-UID-att-basic',
  },

  train_att_variationer: {
    title: 'TRÆN – ATT Variationer',
    paragraphs: [
      'Variationer i ATT udfordrer opmærksomheden på nye måder.',
      'Formålet er at:',
    ],
    bullets: [
      'øge fleksibilitet',
      'mindske automatisk trusselsfokus',
      'styrke mental kontrol',
    ],
    uid: 'TODO-UID-att-var',
  },

  train_dm_basic: {
    title: 'TRÆN – DM Basic: tanker som events',
    paragraphs: [
      'Tanker er mentale hændelser – ikke kommandoer.',
      'I denne øvelse øver du dig i at:',
    ],
    bullets: [
      'registrere tanker',
      'lade dem passere',
      'undlade at engagere dig',
    ],
    uid: 'TODO-UID-dm-basic',
  },

  stop_worry: {
    title: 'STOP CAS – Bekymring',
    paragraphs: [
      'Bekymring er en gentagende mental proces om fremtiden.',
      'Når bekymring starter:',
    ],
    bullets: [
      'registrér den',
      'anvend opmærksomhed eller afkobling',
      'vend tilbage til det, du var i gang med',
    ],
    uid: 'TODO-UID-stop-worry',
  },

  stop_rumination: {
    title: 'STOP CAS – Grubling',
    paragraphs: [
      'Grubling handler om fortiden og "hvorfor".',
      'Grubling skaber ikke løsninger – men vedligeholder CAS.',
      'Øv dig i at:',
    ],
    bullets: [
      'opdage grubling',
      'stoppe processen',
      'skifte fokus',
    ],
    uid: 'TODO-UID-stop-rumination',
  },

  stop_threat: {
    title: 'STOP CAS – Trusselsmonitorering',
    paragraphs: [
      'Trusselsmonitorering er konstant scanning efter fare.',
      'Jo mere du scanner, desto mere finder du.',
      'Træn i at:',
    ],
    bullets: [
      'lade opmærksomheden være neutral',
      'undlade mental scanning',
    ],
    uid: 'TODO-UID-stop-threat',
  },

  stop_coping: {
    title: 'STOP CAS – Coping / Safety behaviors',
    paragraphs: [
      'Coping-strategier kan give kortvarig lettelse, men fastholde CAS.',
      'Eksempler:',
    ],
    bullets: [
      'reassurance seeking',
      'undgåelse',
      'overforberedelse',
    ],
    uid: 'TODO-UID-stop-coping',
  },

  test_positive: {
    title: 'TEST – Positive metakognitive antagelser',
    paragraphs: [
      'Positive antagelser handler om, hvorfor CAS føles nyttigt.',
      'Eksempel:',
    ],
    bullets: [
      '"Hvis jeg bekymrer mig, er jeg forberedt"',
    ],
    uid: 'TODO-UID-test-pos',
  },

  test_negative: {
    title: 'TEST – Negative metakognitive antagelser',
    paragraphs: [
      'Negative antagelser handler om frygt for manglende kontrol.',
      'Eksempel:',
    ],
    bullets: [
      '"Hvis jeg stopper bekymring, mister jeg overblikket"',
    ],
    uid: 'TODO-UID-test-neg',
  },

  plans_metaplan: {
    title: 'NYE PLANER – Personlig metaplan',
    paragraphs: [
      'Her samler du dine færdigheder i en personlig plan.',
      'Planen beskriver:',
    ],
    bullets: [
      'hvordan du opdager CAS',
      'hvad du gør, når det opstår',
      'hvordan du vender tilbage til aktivitet',
    ],
    uid: 'TODO-UID-nye-metaplan',
  },

  maint_generalize: {
    title: 'VEDLIGEHOLDELSE – Generalisering',
    paragraphs: [
      'Færdigheder virker kun, hvis de bruges bredt.',
      'Øv dig i at:',
    ],
    bullets: [
      'anvende dem i nye situationer',
      'reagere fleksibelt',
      'justere uden analyse',
    ],
    uid: 'TODO-UID-vedl-general',
  },

  maint_relapse: {
    title: 'VEDLIGEHOLDELSE – Tilbagefaldsforebyggelse',
    paragraphs: [
      'CAS kan vende tilbage – det er normalt.',
      'Tilbagefald forebygges ved:',
    ],
    bullets: [
      'tidlig opmærksomhed',
      'konsekvent brug af færdigheder',
      'undgåelse af overanalyse',
    ],
    uid: 'TODO-UID-vedl-relapse',
  },
};
