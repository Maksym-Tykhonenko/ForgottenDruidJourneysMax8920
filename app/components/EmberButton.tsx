import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { Aura } from './Aura';
import { Display } from './GlyphText';
import { Tappable } from './Tappable';
import { Gradients, Palette, Radii, Spacing } from '../theme';

type Variant = 'solid' | 'ghost' | 'danger';

interface EmberButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
  compact?: boolean;
}

// The signature glowing CTA. Solid uses the amber gradient with a warm
// shadow halo; ghost is a glass pill; danger uses solid amber but flagged.
export const EmberButton: React.FC<EmberButtonProps> = ({
  label,
  onPress,
  variant = 'solid',
  icon,
  disabled,
  style,
  fullWidth = true,
  compact = false,
}) => {
  const isGhost = variant === 'ghost';
  const padV = compact ? Spacing.sm + 2 : Spacing.md + 3;

  const inner = (
    <View style={[styles.row, { paddingVertical: padV }]}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Display
        variant="button"
        color={isGhost ? Palette.frost : Palette.abyss}>
        {label}
      </Display>
    </View>
  );

  return (
    <Tappable
      onPress={onPress}
      disabled={disabled}
      style={[
        fullWidth ? styles.full : null,
        !isGhost ? styles.glow : null,
        style,
      ]}>
      {isGhost ? (
        <View style={[styles.ghost, styles.radius]}>{inner}</View>
      ) : (
        <Aura
          colors={Gradients.ember}
          angle={115}
          radius={Radii.md}
          style={styles.radius}>
          {inner}
        </Aura>
      )}
    </Tappable>
  );
};

const styles = StyleSheet.create({
  full: { width: '100%' },
  radius: { borderRadius: Radii.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  icon: { marginRight: 2 },
  glow: {
    shadowColor: Palette.ember,
    shadowOpacity: 0.55,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  ghost: {
    backgroundColor: Palette.glassRaised,
    borderWidth: 1,
    borderColor: Palette.glassLine,
  },
});
