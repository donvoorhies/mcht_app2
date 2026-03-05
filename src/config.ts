/**
 * Configuration for the MCHT app
 * 
 * WORDPRESS INTEGRATION:
 *   - BASE_URL: WordPress site URL (trailing slash required)
 *   - Must match your WordPress installation
 *   - Used by manifest service and card fetching
 * 
 * IMPORTANT:
 *   - Change BASE_URL to point to your WordPress site
 *   - Ensure WordPress has MCT plugin installed
 *   - WordPress must have REST API enabled
 * 
 * REST API ENDPOINTS:
 *   - Manifest: {BASE_URL}wp-json/mct/v1/manifest
 *   - Cards: {BASE_URL}wp-json/mct/v1/cards/{uid}
 * 
 * WEBVIEW CONFIGURATION:
 *   - WEB_APP_URL: Currently unused (app uses native UI)
 *   - ALLOWED_DOMAINS: URLs that open in WebView vs external browser
 *   - External links automatically detect domain and open appropriately
 * 
 * SECURITY:
 *   - Add your domain to ALLOWED_DOMAINS for in-app viewing
 *   - Other domains open in device's default browser
 *   - This prevents phishing/malicious redirects
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
