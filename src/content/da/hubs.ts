/**
 * Hub Pages Content - Danish
 * All hub pages with their textual content, links, and navigation targets
 */

export type ContentPage = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  paragraphsAfterBullets?: string[];
  nextLinks?: { label: string; target: string }[];
};

export const hubs: Record<string, ContentPage> = {
  start: {
    title: 'START – Forstå CAS og metamodel',
    paragraphs: [
      'Dette forløb tager udgangspunkt i metakognitiv terapi (MCT).',
      'Her arbejder vi ikke med indholdet af dine tanker, men med den måde du reagerer på dem.',
      'Mange psykiske belastninger vedligeholdes af et mønster kaldet CAS – Cognitive Attentional Syndrome.',
    ],
    bullets: [
      'bekymring og grubling',
      'konstant overvågning af trusler',
      'strategier, der umiddelbart hjælper – men fastholder problemet',
    ],
    nextLinks: [
      { label: 'Hvad er CAS?', target: 'start_cas' },
      { label: 'Socialisering i MCT', target: 'start_socialisering' },
    ],
  },

  train: {
    title: 'TRÆN – Opmærksomhed og afkobling',
    paragraphs: [
      'I MCT er træning central.',
      'Du opbygger færdigheder, der giver dig kontrol over opmærksomhed og mentale reaktioner.',
      'Træningen har to hovedspor:',
    ],
    bullets: [
      'Opmærksomhedstræning (ATT)',
      'Afkobling (Detached Mindfulness)',
    ],
    nextLinks: [
      { label: 'TRÆN – Opmærksomhed (ATT)', target: 'train_att' },
      { label: 'TRÆN – Afkobling (DM)', target: 'train_dm' },
    ],
  },

  train_att: {
    title: 'TRÆN – Opmærksomhed (ATT)',
    paragraphs: [
      'Opmærksomhedstræning (ATT) styrker din evne til bevidst at styre, hvor dit fokus er.',
      'Formålet er ikke afslapning – men mental fleksibilitet og kontrol.',
      'ATT hjælper dig med at:',
    ],
    bullets: [
      'bryde fastlåst opmærksomhed',
      'reducere trusselsfokus',
      'skabe afstand til CAS-reaktioner',
    ],
    nextLinks: [
      { label: 'ATT Basic', target: 'train_att_basic' },
      { label: 'ATT Variationer', target: 'train_att_variationer' },
    ],
  },

  train_dm: {
    title: 'TRÆN – Afkobling (DM)',
    paragraphs: [
      'Afkobling handler om at lade tanker være mentale hændelser – uden at engagere sig i dem.',
      'Du lærer at:',
    ],
    bullets: [
      'lade tanker komme og gå',
      'undlade at analysere eller reagere',
      'blive i rollen som observatør',
    ],
    nextLinks: [
      { label: 'DM Basic: tanker som events', target: 'train_dm_basic' },
    ],
  },

  stopcas: {
    title: 'STOP CAS – bryd vedligeholdelsen',
    paragraphs: [
      'CAS består af forskellige mentale reaktionsmønstre.',
      'I denne del lærer du at identificere og stoppe dem – mens de foregår.',
      'Du arbejder med:',
    ],
    bullets: [
      'bekymring',
      'grubling',
      'trusselsmonitorering',
      'coping- og safety behaviors',
    ],
    nextLinks: [
      { label: 'Bekymring', target: 'stop_worry' },
      { label: 'Grubling', target: 'stop_rumination' },
      { label: 'Trusselsmonitorering', target: 'stop_threat' },
      { label: 'Coping / Safety behaviors', target: 'stop_coping' },
    ],
  },

  test: {
    title: 'TEST ANTAGELSER – metakognitive overbevisninger',
    paragraphs: [
      'Mange CAS-reaktioner styres af metakognitive antagelser, fx:',
    ],
    bullets: [
      '"Bekymring hjælper mig"',
      '"Hvis jeg ikke analyserer, mister jeg kontrollen"',
    ],
    nextLinks: [
      { label: 'Positive metakognitive antagelser', target: 'test_positive' },
      { label: 'Negative metakognitive antagelser', target: 'test_negative' },
    ],
  },

  maintenance: {
    title: 'VEDLIGEHOLDELSE – fasthold forandring',
    paragraphs: [
      'Når CAS reduceres, handler næste fase om at fastholde og generalisere færdighederne.',
      'Du lærer at:',
    ],
    bullets: [
      'bruge MCT-færdigheder på tværs af situationer',
      'forebygge tilbagefald',
      'reagere fleksibelt, når CAS forsøger at vende tilbage',
    ],
    nextLinks: [
      { label: 'Generalisering', target: 'maint_generalize' },
      { label: 'Tilbagefaldsforebyggelse', target: 'maint_relapse' },
    ],
  },
};
