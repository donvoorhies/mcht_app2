/**
 * Content-Manifest Mapper
 * Maps static content (Danish text) with dynamic WordPress manifest (UIDs)
 * 
 * This allows:
 * - Static text in app (no rebuild needed for text changes)
 * - Dynamic WordPress cards (no rebuild needed for new cards)
 * - Mapping via processId slug
 */

import type { Manifest, CardIndexItem } from '../manifest/manifest.types';
import type { ProcessCardPage } from './da/process';

/**
 * Map processId to slug that WordPress uses
 * WordPress might use different slugs than our internal IDs
 */
const processIdToSlugMap: Record<string, string> = {
  start_cas: 'CAS_INTRO',
  start_socialisering: 'start-socialisering',
  train_att_basic: 'train-att-basic',
  train_att_variationer: 'train-att-variationer',
  train_dm_basic: 'train-dm-basic',
  stop_worry: 'stop-bekymring',
  stop_rumination: 'stop-grubling',
  stop_threat: 'stop-trusselsmonitorering',
  stop_coping: 'stop-coping',
  test_positive: 'test-positive',
  test_negative: 'test-negative',
  plans_metaplan: 'nye-planer-metaplan',
  maint_generalize: 'vedligeholdelse-generalisering',
  maint_relapse: 'vedligeholdelse-tilbagefald',
};

/**
 * Find WordPress card UID from manifest based on processId
 */
export function getCardUidFromManifest(
  processId: string,
  manifest: Manifest | null
): string | undefined {
  if (!manifest) return undefined;

  // Get WordPress slug for this processId
  const slug = processIdToSlugMap[processId];
  if (!slug) return undefined;

  // Find card in manifest by matching title or slug
  // WordPress cards should have a slug or title that matches
  const card = manifest.cardsIndex.find((c) => {
    // Try exact slug match first
    if ('slug' in c && c.slug === slug) return true;
    
    // Try title match (case-insensitive)
    const titleSlug = c.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[æ]/g, 'ae')
      .replace(/[ø]/g, 'o')
      .replace(/[å]/g, 'aa')
      .replace(/[^a-z0-9-]/g, '');
    
    return titleSlug === slug;
  });

  return card?.uid;
}

/**
 * Enhanced ProcessCardPage with dynamic UID from manifest
 */
export interface ProcessCardWithManifest extends ProcessCardPage {
  manifestUid?: string; // UID from WordPress manifest
}

/**
 * Merge static content with manifest data
 */
export function mergeContentWithManifest(
  processCard: ProcessCardPage,
  processId: string,
  manifest: Manifest | null
): ProcessCardWithManifest {
  const manifestUid = getCardUidFromManifest(processId, manifest);
  
  return {
    ...processCard,
    manifestUid,
  };
}

/**
 * Get final UID to use (prefer manifest, fallback to static)
 */
export function getFinalUid(
  processCard: ProcessCardPage,
  processId: string,
  manifest: Manifest | null
): string | undefined {
  // Try manifest first
  const manifestUid = getCardUidFromManifest(processId, manifest);
  if (manifestUid && !manifestUid.startsWith('TODO-UID')) {
    return manifestUid;
  }

  // Fallback to static UID (if not TODO)
  if (processCard.uid && !processCard.uid.startsWith('TODO-UID')) {
    return processCard.uid;
  }

  return undefined;
}
