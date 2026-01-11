/**
 * JavaScript code injected into WebView to:
 * 1. Intercept and redirect asset requests to local files
 * 2. Provide bridge API for WordPress to communicate with app
 * 
 * Cross-platform compatible for iOS and Android
 */

import { base64Images, getDataUrl } from './imageAssets';

/**
 * Asset mapping configuration
 * Maps WordPress URLs to local asset paths (platform-independent)
 */
interface AssetMapping {
  [wordpressUrl: string]: string;
}

/**
 * Get platform-specific asset URL
 * @param assetPath - Relative path to asset (e.g., 'images/logo.png')
 * @param platform - 'ios' or 'android'
 */
export const getAssetUrl = (assetPath: string, platform: 'ios' | 'android'): string => {
  if (platform === 'android') {
    return `file:///android_asset/${assetPath}`;
  } else {
    // iOS uses app bundle path
    return `file://${assetPath}`;
  }
};

/**
 * Generate injected JavaScript for WebView
 * Platform-aware asset loading
 */
export const getInjectedJavaScript = (platform: 'ios' | 'android'): string => {
  // Get base64 data URLs for local images
  const larsDataUrl = getDataUrl('lars.png') || '';
  const logoDataUrl = getDataUrl('MCHT-logo.png') || '';
  const chatgptDataUrl = getDataUrl('chatgpt-image.png') || '';
  const mand1DataUrl = getDataUrl('mand1-225x300.png') || '';
  const mand2DataUrl = getDataUrl('mand2-225x300.png') || '';
  const kvinde1DataUrl = getDataUrl('kvinde1-224x300.png') || '';
  const kvinde2DataUrl = getDataUrl('kvinde2-226x300.png') || '';
  
  return `
(function() {
  'use strict';
  
  // Base64-encoded images (embedded at build time)
  // This is the ONLY reliable way to serve local images to WebView from HTTPS pages
  const base64Images = {
    'lars.png': '${larsDataUrl}',
    'MCHT-logo.png': '${logoDataUrl}',
    'chatgpt-image.png': '${chatgptDataUrl}',
    'mand1-225x300.png': '${mand1DataUrl}',
    'mand2-225x300.png': '${mand2DataUrl}',
    'kvinde1-224x300.png': '${kvinde1DataUrl}',
    'kvinde2-226x300.png': '${kvinde2DataUrl}',
    'https://mcht.voorhies.dk/wp-content/uploads/2026/01/ChatGPT-Image-Jan-9-2026-01_06_04-PM-200x300.png': '${chatgptDataUrl}',
    'https://mcht.voorhies.dk/wp-content/uploads/2026/01/mand1-225x300.png': '${mand1DataUrl}',
    'https://mcht.voorhies.dk/wp-content/uploads/2026/01/mand2-225x300.png': '${mand2DataUrl}',
    'https://mcht.voorhies.dk/wp-content/uploads/2026/01/kvinde1-224x300.png': '${kvinde1DataUrl}',
    'https://mcht.voorhies.dk/wp-content/uploads/2026/01/kvinde2-226x300.png': '${kvinde2DataUrl}',
  };
  
  // Asset mapping: WordPress URL -> Local asset identifier
  const assetMap = {
    // Lars portrait image  
    'lars.png': 'lars.png',
    // MCHT logo
    'MCHT-logo.png': 'MCHT-logo.png',
    // ChatGPT image (both short name and full URL)
    'chatgpt-image.png': 'chatgpt-image.png',
    'https://mcht.voorhies.dk/wp-content/uploads/2026/01/ChatGPT-Image-Jan-9-2026-01_06_04-PM-200x300.png': 'https://mcht.voorhies.dk/wp-content/uploads/2026/01/ChatGPT-Image-Jan-9-2026-01_06_04-PM-200x300.png',
    // Person images
    'mand1-225x300.png': 'mand1-225x300.png',
    'mand2-225x300.png': 'mand2-225x300.png',
    'kvinde1-224x300.png': 'kvinde1-224x300.png',
    'kvinde2-226x300.png': 'kvinde2-226x300.png',
    'https://mcht.voorhies.dk/wp-content/uploads/2026/01/mand1-225x300.png': 'https://mcht.voorhies.dk/wp-content/uploads/2026/01/mand1-225x300.png',
    'https://mcht.voorhies.dk/wp-content/uploads/2026/01/mand2-225x300.png': 'https://mcht.voorhies.dk/wp-content/uploads/2026/01/mand2-225x300.png',
    'https://mcht.voorhies.dk/wp-content/uploads/2026/01/kvinde1-224x300.png': 'https://mcht.voorhies.dk/wp-content/uploads/2026/01/kvinde1-224x300.png',
    'https://mcht.voorhies.dk/wp-content/uploads/2026/01/kvinde2-226x300.png': 'https://mcht.voorhies.dk/wp-content/uploads/2026/01/kvinde2-226x300.png',
  };

  // Get local asset URL (returns data: URL with base64)
  const getLocalAssetUrl = function(assetKey) {
    // Check if we have base64 data for this asset
    if (base64Images[assetKey]) {
      return base64Images[assetKey];
    }
    
    // Fallback: use original URL (load from web)
    console.warn('[MCHT] No local asset data for:', assetKey);
    return assetKey;
  };

  // Replace existing images with local assets when page loads
  const replaceExistingImages = function() {
    console.log('[MCHT] replaceExistingImages called, readyState:', document.readyState);
    const images = document.querySelectorAll('img');
    console.log('[MCHT] Found', images.length, 'images');
    
    images.forEach(function(img) {
      const src = img.getAttribute('src');
      console.log('[MCHT] Image src:', src);
      
      if (src && assetMap[src]) {
        const localPath = getLocalAssetUrl(assetMap[src]);
        console.log('[MCHT] Replacing:', src, '->', localPath);
        img.src = localPath;
        
        // Add load/error handlers for debugging
        img.onload = function() {
          console.log('[MCHT] ✓ Image loaded successfully:', localPath);
        };
        img.onerror = function(e) {
          console.error('[MCHT] ✗ Failed to load image:', localPath, e);
        };
      }
    });
  };

  // Run on DOM ready and after new content loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', replaceExistingImages);
  } else {
    replaceExistingImages();
  }

  // Watch for new images added dynamically
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.tagName === 'IMG') {
          const src = node.getAttribute('src');
          if (src && assetMap[src]) {
            const localPath = getLocalAssetUrl(assetMap[src]);
            console.log('[MCHT] Replacing dynamically added image:', src, '->', localPath);
            node.src = localPath;
          }
        }
      });
    });
  });
  
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Override Image loading to use local assets when available
  const originalCreateElement = document.createElement.bind(document);
  document.createElement = function(tagName) {
    const element = originalCreateElement(tagName);
    
    if (tagName.toLowerCase() === 'img') {
      const originalSetAttribute = element.setAttribute.bind(element);
      element.setAttribute = function(name, value) {
        if (name === 'src' && assetMap[value]) {
          // Use local asset instead
          const localPath = getLocalAssetUrl(assetMap[value]);
          console.log('[MCHT] Redirecting image to local asset:', localPath);
          return originalSetAttribute('src', localPath);
        }
        return originalSetAttribute(name, value);
      };
    }
    
    return element;
  };

  // Provide window.MCHT API for WordPress integration
  // Safe check for ReactNativeWebView availability
  if (typeof window.ReactNativeWebView !== 'undefined') {
    window.MCHT = {
      // Navigation helpers
      navigateToSession: function(sessionId, sessionTitle) {
        if (!sessionId || !sessionTitle) {
          console.error('[MCHT] navigateToSession requires sessionId and sessionTitle');
          return;
        }
        // WordPress can call this to navigate to a session in the app
        window.location.href = 'app://session/start?id=' + encodeURIComponent(sessionId) + 
                               '&title=' + encodeURIComponent(sessionTitle);
      },
      
      navigateToReflections: function(sessionId) {
        if (!sessionId) {
          console.error('[MCHT] navigateToReflections requires sessionId');
          return;
        }
        window.location.href = 'app://reflections?sessionId=' + encodeURIComponent(sessionId);
      },
      
      // Session management (already implemented via WebView bridge)
      saveReflection: function(reflection) {
        if (!reflection || !reflection.id || !reflection.sessionId) {
          console.error('[MCHT] saveReflection requires valid reflection object');
          return;
        }
        try {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'SAVE_REFLECTION',
            payload: reflection
          }));
        } catch (e) {
          console.error('[MCHT] Error saving reflection:', e);
        }
      },
      
      getReflections: function(sessionId) {
        try {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'GET_REFLECTIONS',
            payload: { sessionId: sessionId || null }
          }));
        } catch (e) {
          console.error('[MCHT] Error getting reflections:', e);
        }
      },
      
      startSession: function(id, title, url) {
        if (!id || !title) {
          console.error('[MCHT] startSession requires id and title');
          return;
        }
        try {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'SESSION_STARTED',
            payload: { id: id, title: title, url: url || '' }
          }));
        } catch (e) {
          console.error('[MCHT] Error starting session:', e);
        }
      },
      
      getLastSession: function() {
        try {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'GET_LAST_SESSION'
          }));
        } catch (e) {
          console.error('[MCHT] Error getting last session:', e);
        }
      }
    };

    console.log('[MCHT] WebView bridge initialized successfully');
  } else {
    console.warn('[MCHT] ReactNativeWebView not available - running in browser mode');
    // Provide mock API for testing in browser
    window.MCHT = {
      navigateToSession: function(id, title) { console.log('[MCHT Mock] Navigate to session:', id, title); },
      navigateToReflections: function(id) { console.log('[MCHT Mock] Navigate to reflections:', id); },
      saveReflection: function(r) { console.log('[MCHT Mock] Save reflection:', r); },
      getReflections: function(id) { console.log('[MCHT Mock] Get reflections:', id); },
      startSession: function(id, title, url) { console.log('[MCHT Mock] Start session:', id, title, url); },
      getLastSession: function() { console.log('[MCHT Mock] Get last session'); }
    };
  }
})();

true; // Required for injectedJavaScript
`;
};

/**
 * Backward compatibility export
 * @deprecated Use getInjectedJavaScript(platform) instead
 */
export const INJECTED_JAVASCRIPT = getInjectedJavaScript('android');
