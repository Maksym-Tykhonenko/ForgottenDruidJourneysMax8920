import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  BookOpen,
  Compass,
  Heart,
  Images,
  MapPinned,
  Settings as SettingsIcon,
} from 'lucide-react-native';
import { Aura } from '../components/Aura';
import { Palette, Radii, Spacing, TAB_BAR_HEIGHT } from '../theme';
import { TabKey } from './NavContext';

const TABS: { key: TabKey; Icon: typeof BookOpen }[] = [
  { key: 'mysteries', Icon: BookOpen },
  { key: 'map', Icon: MapPinned },
  { key: 'quiz', Icon: Compass },
  { key: 'archive', Icon: Images },
  { key: 'favorites', Icon: Heart },
  { key: 'settings', Icon: SettingsIcon },
];

interface RuneTabBarProps {
  active: TabKey;
  onChange: (t: TabKey) => void;
}

const TabSlot: React.FC<{
  Icon: typeof BookOpen;
  isActive: boolean;
  onPress: () => void;
}> = ({ Icon, isActive, onPress }) => {
  const progress = useDerivedValue(() =>
    withSpring(isActive ? 1 : 0, { damping: 15, stiffness: 220 }),
  );

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -progress.value * 3 }, { scale: 1 + progress.value * 0.1 }],
  }));
  const dotStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scaleX: 0.4 + progress.value * 0.6 }],
  }));

  return (
    <Pressable onPress={onPress} style={styles.slot} hitSlop={6}>
      <Animated.View style={iconStyle}>
        <Icon
          size={22}
          color={isActive ? Palette.ember : Palette.inkMuted}
          strokeWidth={isActive ? 2.4 : 1.9}
        />
      </Animated.View>
      <Animated.View style={[styles.dot, dotStyle]} />
    </Pressable>
  );
};

// Floating, animated, glass bottom bar. The only navigation chrome.
export const RuneTabBar: React.FC<RuneTabBarProps> = ({ active, onChange }) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}
      pointerEvents="box-none">
      <Aura
        colors={['rgba(27,44,92,0.96)', 'rgba(12,20,48,0.97)']}
        angle={90}
        radius={Radii.xl}
        style={styles.bar}>
        {TABS.map(t => (
          <TabSlot
            key={t.key}
            Icon={t.Icon}
            isActive={active === t.key}
            onPress={() => onChange(t.key)}
          />
        ))}
      </Aura>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    width: '100%',
    height: TAB_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Palette.glassLine,
    shadowColor: Palette.shadow,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
  },
  slot: {
    flex: 1,
    height: TAB_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: Palette.ember,
  },
});
