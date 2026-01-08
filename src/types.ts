/**
 * Type definitions for the MCHT app
 */

// Navigation types
export type RootStackParamList = {
  Start: undefined;
  Onboarding: undefined;
  WebView: undefined;
};

// Reflection types
export interface Reflection {
  id: string;
  sessionId: string;
  text: string;
  createdAt: string; // ISO 8601 format
}

// WebView message types
export type IncomingMessage =
  | { type: 'SAVE_REFLECTION'; payload: Reflection }
  | { type: 'GET_REFLECTIONS'; payload: { sessionId?: string } }
  | { type: 'DELETE_REFLECTION'; payload: { id: string } }
  | { type: 'CLEAR_ALL'; payload?: any };

export type OutgoingMessage =
  | { type: 'SAVE_OK'; payload: { id: string } }
  | { type: 'REFLECTIONS'; payload: { items: Reflection[] } }
  | { type: 'DELETE_OK'; payload: { id: string } }
  | { type: 'CLEAR_OK'; payload?: any }
  | { type: 'ERROR'; payload: { code: string; message: string } };

// Error codes
export type ErrorCode =
  | 'SAVE_ERROR'
  | 'GET_ERROR'
  | 'DELETE_ERROR'
  | 'CLEAR_ERROR'
  | 'PARSE_ERROR';
