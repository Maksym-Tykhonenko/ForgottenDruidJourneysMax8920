import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { Aura } from './Aura';
import { Gradients, Palette, Radii } from '../theme';

interface VeilCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  radius?: number;
  glow?: boolean;
}

// Frosted glass surface used for grouped content (settings rows, info cards…).
export const VeilCard: React.FC<VeilCardProps> = ({
  children,
  style,
  padded = true,
  radius = Radii.lg,
  glow = false,
}) => (
  <View style={[glow ? styles.glow : null, style]}>
    <Aura
      colors={Gradients.card}
      angle={125}
      radius={radius}
      style={[styles.border, { borderRadius: radius }]}>
      <View style={padded ? styles.pad : null}>{children}</View>
    </Aura>
  </View>
);

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderColor: Palette.glassLine,
  },
  pad: { padding: 16 },
  glow: {
    shadowColor: Palette.shadow,
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
});
