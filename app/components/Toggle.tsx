import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Palette } from '../theme';

interface ToggleProps {
  value: boolean;
  onChange: (next: boolean) => void;
}

// Animated glowing switch used for settings preferences.
export const Toggle: React.FC<ToggleProps> = ({ value, onChange }) => {
  const p = useDerivedValue(() =>
    withSpring(value ? 1 : 0, { damping: 16, stiffness: 220 }),
  );

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      p.value,
      [0, 1],
      ['rgba(143,180,255,0.18)', Palette.ember],
    ),
  }));
  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: 2 + p.value * 22 }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(value ? 0.6 : 0, { duration: 200 }),
  }));

  return (
    <Pressable onPress={() => onChange(!value)} hitSlop={8}>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.glow, glowStyle]} />
        <Animated.View style={[styles.knob, knobStyle]} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    shadowColor: Palette.ember,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Palette.pure,
  },
});
