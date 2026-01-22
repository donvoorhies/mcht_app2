/**
 * i18n accessor - exports Danish strings as `t`
 * No full i18n framework - just Danish strings
 */

import { danishStrings } from './strings.da';

// Export Danish strings as `t` (translation accessor)
export const t = danishStrings;

// Type export for convenience
export type { DanishStrings } from './strings.da';
