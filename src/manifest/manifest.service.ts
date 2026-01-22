/**
 * Manifest service with cache-first strategy
 * Fetches from /wp-json/mct/v1/manifest
 * Uses AsyncStorage for caching
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import type { Manifest } from './manifest.types';
import { validateManifest } from './manifest.types';
import { developmentManifest } from './developmentManifest';

const MANIFEST_CACHE_KEY = 'mcht_manifest_v1';
const MANIFEST_URL = `${BASE_URL}wp-json/mct/v1/manifest`;
const FETCH_TIMEOUT_MS = 10000; // 10 seconds
const APP_BUILD_NUMBER = 1; // TODO: Get from app.json or config
const USE_DEV_FALLBACK = true; // Always use fallback for now

export interface ManifestServiceResult {
  manifest: Manifest | null;
  fromCache: boolean;
  error: string | null;
  incompatibleVersion: boolean;
}

/**
 * Fetch manifest with timeout
 */
async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

/**
 * Fetch manifest from remote endpoint
 */
async function fetchManifest(): Promise<Manifest> {
  try {
    const response = await fetchWithTimeout(MANIFEST_URL, FETCH_TIMEOUT_MS);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate manifest structure
    const validation = validateManifest(data);
    if (!validation.valid) {
      console.error('Manifest validation errors:', validation.errors);
      throw new Error(`Invalid manifest: ${validation.errors.join(', ')}`);
    }

    return data as Manifest;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
    throw new Error('Unknown error fetching manifest');
  }
}

/**
 * Get cached manifest from AsyncStorage
 */
async function getCachedManifest(): Promise<Manifest | null> {
  try {
    const cached = await AsyncStorage.getItem(MANIFEST_CACHE_KEY);
    if (!cached) {
      return null;
    }

    const data = JSON.parse(cached);
    
    // Validate cached data
    const validation = validateManifest(data);
    if (!validation.valid) {
      console.warn('Cached manifest is invalid, clearing cache');
      await AsyncStorage.removeItem(MANIFEST_CACHE_KEY);
      return null;
    }

    return data as Manifest;
  } catch (error) {
    console.error('Error reading cached manifest:', error);
    return null;
  }
}

/**
 * Save manifest to cache
 */
async function saveManifestToCache(manifest: Manifest): Promise<void> {
  try {
    await AsyncStorage.setItem(MANIFEST_CACHE_KEY, JSON.stringify(manifest));
  } catch (error) {
    console.error('Error saving manifest to cache:', error);
  }
}

/**
 * Check if remote manifest is newer than cached version
 */
function isNewerManifest(remote: Manifest, cached: Manifest): boolean {
  try {
    const remoteDate = new Date(remote.content.revision);
    const cachedDate = new Date(cached.content.revision);
    return remoteDate > cachedDate;
  } catch {
    // If dates are invalid, assume remote is newer
    return true;
  }
}

/**
 * Check if app version meets minimum requirement
 */
function checkAppCompatibility(manifest: Manifest): boolean {
  if (!manifest.appConfig.minAppBuild) {
    return true; // No minimum version required
  }
  return APP_BUILD_NUMBER >= manifest.appConfig.minAppBuild;
}

/**
 * Get manifest with cache-first strategy
 * 
 * Behavior:
 * 1. Return cached manifest immediately if available
 * 2. Fetch remote manifest in background
 * 3. Update cache if remote is newer
 * 4. Does NOT block UI while refreshing
 */
export async function getManifest(): Promise<ManifestServiceResult> {
  let fromCache = false;
  let manifest: Manifest | null = null;
  let error: string | null = null;

  // Try to get cached manifest first
  try {
    const cached = await getCachedManifest();
    if (cached) {
      manifest = cached;
      fromCache = true;
    }
  } catch (err) {
    console.error('Error loading cached manifest:', err);
  }

  // Try to fetch remote manifest
  try {
    const remote = await fetchManifest();
    
    // If we have a cached version, only update if remote is newer
    if (manifest && !isNewerManifest(remote, manifest)) {
      // Cached version is up-to-date
      return {
        manifest,
        fromCache: true,
        error: null,
        incompatibleVersion: !checkAppCompatibility(manifest),
      };
    }

    // Save remote manifest to cache
    await saveManifestToCache(remote);
    
    return {
      manifest: remote,
      fromCache: false,
      error: null,
      incompatibleVersion: !checkAppCompatibility(remote),
    };
  } catch (err) {
    // Remote fetch failed
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    
    if (manifest) {
      // We have cached manifest, return it with error
      return {
        manifest,
        fromCache: true,
        error: errorMessage,
        incompatibleVersion: !checkAppCompatibility(manifest),
      };
    }

    // No cached manifest and fetch failed - use development fallback in dev mode
    if (USE_DEV_FALLBACK) {
      console.log('[MCHT] Using development fallback manifest');
      return {
        manifest: developmentManifest,
        fromCache: false,
        error: null, // Don't show error when using fallback
        incompatibleVersion: false,
      };
    }

    // Production: No cached manifest and fetch failed
    return {
      manifest: null,
      fromCache: false,
      error: errorMessage,
      incompatibleVersion: false,
    };
  }
}

/**
 * Refresh manifest in background
 * Used by the hook to update cache without blocking UI
 */
export async function refreshManifestInBackground(): Promise<void> {
  try {
    const remote = await fetchManifest();
    await saveManifestToCache(remote);
  } catch (error) {
    console.error('Background refresh failed:', error);
  }
}

/**
 * Clear manifest cache
 * Useful for debugging or force-refresh
 */
export async function clearManifestCache(): Promise<void> {
  await AsyncStorage.removeItem(MANIFEST_CACHE_KEY);
}
