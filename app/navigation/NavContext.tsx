import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type TabKey =
  | 'mysteries'
  | 'map'
  | 'quiz'
  | 'archive'
  | 'favorites'
  | 'settings';

interface NavValue {
  tab: TabKey;
  setTab: (t: TabKey) => void;
  openMysteryId: number | null;
  openMystery: (id: number) => void;
  closeMystery: () => void;
}

const NavContext = createContext<NavValue | null>(null);

export const NavProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tab, setTab] = useState<TabKey>('mysteries');
  const [openMysteryId, setOpenMysteryId] = useState<number | null>(null);

  const openMystery = useCallback((id: number) => setOpenMysteryId(id), []);
  const closeMystery = useCallback(() => setOpenMysteryId(null), []);

  const value = useMemo<NavValue>(
    () => ({ tab, setTab, openMysteryId, openMystery, closeMystery }),
    [tab, openMysteryId, openMystery, closeMystery],
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
};

export function useNav(): NavValue {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
