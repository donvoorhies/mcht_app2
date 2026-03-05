/**
 * Progress Store - Track user's progress through the MCT program
 * 
 * ARCHITECTURE:
 *   - Uses AsyncStorage for persistence (survives app restarts)
 *   - Stores all progress as JSON string
 *   - Provides simple async API for tracking visits/completion
 * 
 * DATA MODEL:
 *   - visitedHubs: Array of hub IDs user has visited
 *   - visitedProcessCards: Array of process card IDs user has viewed
 *   - completedHubs: Array of hub IDs user has marked complete
 *   - lastVisited: ID of most recently visited item
 *   - lastVisitedAt: Timestamp of last visit
 * 
 * AUTOMATIC TRACKING:
 *   - HubDetailScreen automatically calls markHubVisited() on load
 *   - ProcessCardScreen automatically calls markProcessCardVisited() on load
 *   - No manual tracking needed
 * 
 * USED BY:
 *   - OverviewScreen: Calculates completion percentages
 *   - Shows which hubs/cards user has seen
 *   - Provides recommendations for next steps
 *   - Displays overall progress through program
 * 
 * PERSISTENCE KEY:
 *   - '@mcht_app:progress' in AsyncStorage
 *   - Can be cleared to reset progress
 *   - Survives app updates (unless app data cleared)
 * 
 * ERROR HANDLING:
 *   - All methods have try/catch blocks
 *   - Errors logged but don't crash app
 *   - Returns default empty data on read errors
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = '@mcht_app:progress';

export type ProgressData = {
  visitedHubs: string[]; // Hub IDs visited
  visitedProcessCards: string[]; // Process card IDs visited
  completedHubs: string[]; // Hubs marked as complete
  lastVisited?: string; // Last visited item ID
  lastVisitedAt?: number; // Timestamp
};

const defaultProgress: ProgressData = {
  visitedHubs: [],
  visitedProcessCards: [],
  completedHubs: [],
};

export const progressStore = {
  async getProgress(): Promise<ProgressData> {
    try {
      const raw = await AsyncStorage.getItem(PROGRESS_KEY);
      if (!raw) return { ...defaultProgress };
      return JSON.parse(raw);
    } catch (error) {
      console.error('Error reading progress', error);
      return { ...defaultProgress };
    }
  },

  async markHubVisited(hubId: string): Promise<void> {
    try {
      const progress = await this.getProgress();
      if (!progress.visitedHubs.includes(hubId)) {
        progress.visitedHubs.push(hubId);
      }
      progress.lastVisited = hubId;
      progress.lastVisitedAt = Date.now();
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error marking hub visited', error);
    }
  },

  async markProcessCardVisited(processId: string): Promise<void> {
    try {
      const progress = await this.getProgress();
      if (!progress.visitedProcessCards.includes(processId)) {
        progress.visitedProcessCards.push(processId);
      }
      progress.lastVisited = processId;
      progress.lastVisitedAt = Date.now();
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error marking process card visited', error);
    }
  },

  async markHubComplete(hubId: string): Promise<void> {
    try {
      const progress = await this.getProgress();
      if (!progress.completedHubs.includes(hubId)) {
        progress.completedHubs.push(hubId);
      }
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error marking hub complete', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PROGRESS_KEY);
    } catch (error) {
      console.error('Error clearing progress', error);
    }
  },
};
