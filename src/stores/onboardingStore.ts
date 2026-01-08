import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@mcht_app:onboarding_done';

export const onboardingStore = {
  async getHasSeenOnboarding(): Promise<boolean> {
    try {
      const raw = await AsyncStorage.getItem(ONBOARDING_KEY);
      return raw === '1';
    } catch (error) {
      console.error('Error reading onboarding flag', error);
      return false;
    }
  },

  async setHasSeenOnboarding(value: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, value ? '1' : '0');
    } catch (error) {
      console.error('Error writing onboarding flag', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch (error) {
      console.error('Error clearing onboarding flag', error);
    }
  },
};
