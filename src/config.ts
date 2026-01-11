/**
 * Configuration for the MCHT app.
 * Change BASE_URL to point to your WordPress installation.
 */

export const BASE_URL = 'https://mcht.voorhies.dk/';
export const APP_PATH = '/';

/**
 * Full URL loaded by WebView.
 */
export const WEB_APP_URL = `${BASE_URL}${APP_PATH}`;

/**
 * Domains that should stay in WebView (internal navigation)
 * All other domains will open in external browser
 */
export const ALLOWED_DOMAINS = [
  'mcht.voorhies.dk',
  'www.corehypnose.dk',
  // Add more allowed domains here
];
