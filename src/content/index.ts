/**
 * Content Layer - Main Export
 * Provides access to all Danish content for hubs, process cards, and app pages
 */

export { hubs } from './da/hubs';
export { processCards } from './da/process';
export { appPages } from './da/appPages';
export type { ContentPage } from './da/hubs';
export type { ProcessCardPage } from './da/process';

/**
 * Helper function to get content by ID with fallback
 */
export function getContent(
  id: string,
  type: 'hub' | 'process' | 'app'
): import('./da/hubs').ContentPage | null {
  const { hubs, processCards, appPages } = require('./index');
  
  switch (type) {
    case 'hub':
      return hubs[id] || null;
    case 'process':
      return processCards[id] || null;
    case 'app':
      return appPages[id] || null;
    default:
      return null;
  }
}
