import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Palette } from '../theme';
import { TabKey, useNav } from './NavContext';
import { RuneTabBar } from './RuneTabBar';
import { MysteriesScreen } from '../screens/MysteriesScreen';
import { MapScreen } from '../screens/MapScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { ArchiveScreen } from '../screens/ArchiveScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { MysteryDetail } from '../screens/MysteryDetail';
import { findMystery } from '../data/catalogue';

const SCREENS: Record<TabKey, React.ComponentType> = {
  mysteries: MysteriesScreen,
  map: MapScreen,
  quiz: QuizScreen,
  archive: ArchiveScreen,
  favorites: FavoritesScreen,
  settings: SettingsScreen,
};

export const TabHost: React.FC = () => {
  const { tab, setTab, openMysteryId, closeMystery } = useNav();
  const Active = SCREENS[tab];
  const detail = openMysteryId != null ? findMystery(openMysteryId) : undefined;

  return (
    <View style={styles.root}>
      <Animated.View key={tab} entering={FadeIn.duration(240)} style={styles.fill}>
        <Active />
      </Animated.View>

      <RuneTabBar active={tab} onChange={setTab} />

      {detail ? (
        <MysteryDetail place={detail} onClose={closeMystery} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.abyss },
  fill: { flex: 1 },
});
