import AsyncStorage from '@react-native-async-storage/async-storage';

// Namespaced persistence keys for the whole app.
export const VaultKeys = {
  settings: 'fdj.settings.v1',
  favorites: 'fdj.favorites.v1',
  archive: 'fdj.archive.v1',
  onboarding: 'fdj.onboarding.v1',
} as const;

export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently ignore write failures — state remains correct in-memory.
  }
}
