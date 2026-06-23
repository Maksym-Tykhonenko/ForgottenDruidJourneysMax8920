import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { readJSON, VaultKeys, writeJSON } from './storage';

export interface Settings {
  music: boolean;
  vibration: boolean;
}

export interface ArchiveEntry {
  id: string;
  note: string;
  imageUri: string;
  createdAt: number;
}

interface VaultValue {
  hydrated: boolean;
  // settings
  settings: Settings;
  setMusic: (on: boolean) => void;
  setVibration: (on: boolean) => void;
  // onboarding
  onboardingDone: boolean;
  completeOnboarding: () => void;
  // favorites
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
  clearFavorites: () => void;
  // archive (evidence gallery)
  archive: ArchiveEntry[];
  addEntry: (note: string, imageUri: string) => void;
  updateEntry: (id: string, note: string, imageUri: string) => void;
  removeEntry: (id: string) => void;
  clearArchive: () => void;
}

const DEFAULT_SETTINGS: Settings = { music: true, vibration: true };

const VaultContext = createContext<VaultValue | null>(null);

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hydrated, setHydrated] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [archive, setArchive] = useState<ArchiveEntry[]>([]);
  const [onboardingDone, setOnboardingDone] = useState(false);

  // Hydrate everything once on mount.
  useEffect(() => {
    let alive = true;
    (async () => {
      const [s, f, a, o] = await Promise.all([
        readJSON<Settings>(VaultKeys.settings, DEFAULT_SETTINGS),
        readJSON<number[]>(VaultKeys.favorites, []),
        readJSON<ArchiveEntry[]>(VaultKeys.archive, []),
        readJSON<boolean>(VaultKeys.onboarding, false),
      ]);
      if (!alive) return;
      setSettings({ ...DEFAULT_SETTINGS, ...s });
      setFavorites(f);
      setArchive(a);
      setOnboardingDone(o);
      setHydrated(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Persist on change (skip until hydration finished to avoid clobbering).
  const ready = useRef(false);
  useEffect(() => {
    if (hydrated) ready.current = true;
  }, [hydrated]);

  useEffect(() => {
    if (ready.current) writeJSON(VaultKeys.settings, settings);
  }, [settings]);
  useEffect(() => {
    if (ready.current) writeJSON(VaultKeys.favorites, favorites);
  }, [favorites]);
  useEffect(() => {
    if (ready.current) writeJSON(VaultKeys.archive, archive);
  }, [archive]);
  useEffect(() => {
    if (ready.current) writeJSON(VaultKeys.onboarding, onboardingDone);
  }, [onboardingDone]);

  const setMusic = useCallback(
    (on: boolean) => setSettings(s => ({ ...s, music: on })),
    [],
  );
  const setVibration = useCallback(
    (on: boolean) => setSettings(s => ({ ...s, vibration: on })),
    [],
  );
  const completeOnboarding = useCallback(() => setOnboardingDone(true), []);

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites],
  );
  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [id, ...prev],
    );
  }, []);
  const clearFavorites = useCallback(() => setFavorites([]), []);

  const addEntry = useCallback((note: string, imageUri: string) => {
    const entry: ArchiveEntry = {
      id: `e_${Date.now()}_${Math.round(Math.random() * 1e5)}`,
      note,
      imageUri,
      createdAt: Date.now(),
    };
    setArchive(prev => [entry, ...prev]);
  }, []);
  const updateEntry = useCallback(
    (id: string, note: string, imageUri: string) => {
      setArchive(prev =>
        prev.map(e => (e.id === id ? { ...e, note, imageUri } : e)),
      );
    },
    [],
  );
  const removeEntry = useCallback((id: string) => {
    setArchive(prev => prev.filter(e => e.id !== id));
  }, []);
  const clearArchive = useCallback(() => setArchive([]), []);

  const value = useMemo<VaultValue>(
    () => ({
      hydrated,
      settings,
      setMusic,
      setVibration,
      onboardingDone,
      completeOnboarding,
      favorites,
      isFavorite,
      toggleFavorite,
      clearFavorites,
      archive,
      addEntry,
      updateEntry,
      removeEntry,
      clearArchive,
    }),
    [
      hydrated,
      settings,
      setMusic,
      setVibration,
      onboardingDone,
      completeOnboarding,
      favorites,
      isFavorite,
      toggleFavorite,
      clearFavorites,
      archive,
      addEntry,
      updateEntry,
      removeEntry,
      clearArchive,
    ],
  );

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
};

export function useVault(): VaultValue {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error('useVault must be used within VaultProvider');
  return ctx;
}
