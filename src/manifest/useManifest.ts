/**
 * React hook for accessing manifest in screens
 * Provides fast first render with cached data
 */

import { useEffect, useState } from 'react';
import type { Manifest } from './manifest.types';
import { getManifest, refreshManifestInBackground } from './manifest.service';

export interface UseManifestResult {
  manifest: Manifest | null;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
  incompatibleVersion: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook to access manifest data
 * 
 * Features:
 * - Fast first render using cached data
 * - Background refresh
 * - Distinguishes between error states:
 *   - No cache + fetch failed
 *   - Cache present + refresh failed
 */
export function useManifest(): UseManifestResult {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [incompatibleVersion, setIncompatibleVersion] = useState(false);

  const loadManifest = async () => {
    try {
      setLoading(true);
      const result = await getManifest();
      
      setManifest(result.manifest);
      setFromCache(result.fromCache);
      setError(result.error);
      setIncompatibleVersion(result.incompatibleVersion);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await loadManifest();
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const result = await getManifest();
      
      if (!mounted) return;

      setManifest(result.manifest);
      setFromCache(result.fromCache);
      setError(result.error);
      setIncompatibleVersion(result.incompatibleVersion);
      setLoading(false);

      // If we got cached data, refresh in background
      if (result.fromCache && result.manifest) {
        refreshManifestInBackground().catch(err => {
          console.error('Background refresh failed:', err);
        });
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    manifest,
    loading,
    error,
    fromCache,
    incompatibleVersion,
    refresh,
  };
}
