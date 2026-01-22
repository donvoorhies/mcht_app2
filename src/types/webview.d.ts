/**
 * TypeScript definitions for MCHT WebView Bridge
 * Ensures type safety across WordPress integration
 */

declare global {
  interface Window {
    /**
     * MCHT API exposed to WordPress
     * Allows WordPress to interact with React Native app
     */
    MCHT: {
      /**
       * Navigate to a specific session
       * @param sessionId - Unique session identifier
       * @param sessionTitle - Display title for the session
       */
      navigateToSession(sessionId: string, sessionTitle: string): void;

      /**
       * Navigate to reflections view
       * @param sessionId - Optional session ID to filter reflections
       */
      navigateToReflections(sessionId?: string): void;

      /**
       * Save a reflection to persistent storage
       * @param reflection - Reflection object to save
       */
      saveReflection(reflection: Reflection): void;

      /**
       * Retrieve reflections from storage
       * @param sessionId - Optional session ID to filter results
       */
      getReflections(sessionId?: string): void;

      /**
       * Track session start
       * @param id - Session identifier
       * @param title - Session title
       * @param url - Optional current URL
       */
      startSession(id: string, title: string, url?: string): void;

      /**
       * Get last active session
       */
      getLastSession(): void;
    };
  }
}

/**
 * Reflection data structure
 */
export interface Reflection {
  /** Unique identifier for the reflection */
  id: string;
  /** Associated session ID */
  sessionId: string;
  /** Reflection content */
  text: string;
  /** ISO timestamp of creation */
  createdAt: string;
}

/**
 * Session information structure
 */
export interface SessionInfo {
  /** Unique session identifier */
  id: string;
  /** Display title */
  title: string;
  /** Associated URL */
  url: string;
  /** ISO timestamp */
  timestamp: string;
}

/**
 * Message types sent from WordPress to App
 */
export type IncomingMessage =
  | { type: 'SAVE_REFLECTION'; payload: Reflection }
  | { type: 'GET_REFLECTIONS'; payload: { sessionId?: string } }
  | { type: 'DELETE_REFLECTION'; payload: { id: string } }
  | { type: 'CLEAR_ALL'; payload?: never }
  | { type: 'SESSION_STARTED'; payload: { id: string; title: string; url?: string } }
  | { type: 'GET_LAST_SESSION'; payload?: never }
  | { type: 'OPEN_CARD'; payload: { uid: string } };

/**
 * Message types sent from App to WordPress
 */
export type OutgoingMessage =
  | { type: 'SAVE_OK'; payload: { id: string } }
  | { type: 'REFLECTIONS'; payload: { items: Reflection[] } }
  | { type: 'DELETE_OK'; payload: { id: string } }
  | { type: 'CLEAR_OK'; payload?: never }
  | { type: 'SESSION_SAVED'; payload?: never }
  | { type: 'LAST_SESSION'; payload: SessionInfo | null }
  | { type: 'ERROR'; payload: { code: string; message: string } };

export {};
