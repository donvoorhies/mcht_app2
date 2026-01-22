/**
 * TypeScript types for the manifest contract
 * Based on WordPress endpoint: /wp-json/mct/v1/manifest
 */

// Base manifest structure
export interface Manifest {
  schemaVersion: string;
  appConfig: AppConfig;
  content: ContentInfo;
  hub: HubItem[];
  cardsIndex: CardIndexItem[];
}

export interface AppConfig {
  baseWebUrl: string;
  minAppBuild?: number; // Optional minimum app version requirement
}

export interface ContentInfo {
  revision: string; // ISO 8601 timestamp
}

// Hub item can be either native screen or web path
export type HubItem = NativeHubItem | WebHubItem;

export interface BaseHubItem {
  id: string;
  title: string;
  icon?: string;
}

export interface NativeHubItem extends BaseHubItem {
  type: 'native';
  screen: string; // e.g., "Sessions", "Settings"
}

export interface WebHubItem extends BaseHubItem {
  type: 'web';
  path: string; // e.g., "/om-os", "/kontakt"
}

// Card index item
export interface CardIndexItem {
  uid: string;
  title: string;
  slug?: string; // Optional slug for mapping
  phase?: string;
  durationMin?: number;
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Lightweight runtime validation for manifest shape
 * Not using Zod/Yup - just basic type checking
 */
export function validateManifest(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Manifest must be an object');
    return { valid: false, errors };
  }

  // Validate schemaVersion
  if (typeof data.schemaVersion !== 'string') {
    errors.push('schemaVersion must be a string');
  }

  // Validate appConfig
  if (!data.appConfig || typeof data.appConfig !== 'object') {
    errors.push('appConfig must be an object');
  } else {
    if (typeof data.appConfig.baseWebUrl !== 'string') {
      errors.push('appConfig.baseWebUrl must be a string');
    }
    if (data.appConfig.minAppBuild !== undefined && typeof data.appConfig.minAppBuild !== 'number') {
      errors.push('appConfig.minAppBuild must be a number if present');
    }
  }

  // Validate content
  if (!data.content || typeof data.content !== 'object') {
    errors.push('content must be an object');
  } else {
    if (typeof data.content.revision !== 'string') {
      errors.push('content.revision must be a string');
    }
  }

  // Validate hub array
  if (!Array.isArray(data.hub)) {
    errors.push('hub must be an array');
  } else {
    data.hub.forEach((item: any, index: number) => {
      if (!item || typeof item !== 'object') {
        errors.push(`hub[${index}] must be an object`);
        return;
      }
      if (typeof item.id !== 'string') {
        errors.push(`hub[${index}].id must be a string`);
      }
      if (typeof item.title !== 'string') {
        errors.push(`hub[${index}].title must be a string`);
      }
      if (item.type !== 'native' && item.type !== 'web') {
        errors.push(`hub[${index}].type must be 'native' or 'web'`);
      }
      if (item.type === 'native' && typeof item.screen !== 'string') {
        errors.push(`hub[${index}].screen must be a string for native type`);
      }
      if (item.type === 'web' && typeof item.path !== 'string') {
        errors.push(`hub[${index}].path must be a string for web type`);
      }
    });
  }

  // Validate cardsIndex array
  if (!Array.isArray(data.cardsIndex)) {
    errors.push('cardsIndex must be an array');
  } else {
    data.cardsIndex.forEach((item: any, index: number) => {
      if (!item || typeof item !== 'object') {
        errors.push(`cardsIndex[${index}] must be an object`);
        return;
      }
      if (typeof item.uid !== 'string') {
        errors.push(`cardsIndex[${index}].uid must be a string`);
      }
      if (typeof item.title !== 'string') {
        errors.push(`cardsIndex[${index}].title must be a string`);
      }
      if (item.phase !== undefined && typeof item.phase !== 'string') {
        errors.push(`cardsIndex[${index}].phase must be a string if present`);
      }
      if (item.durationMin !== undefined && typeof item.durationMin !== 'number') {
        errors.push(`cardsIndex[${index}].durationMin must be a number if present`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
