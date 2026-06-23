import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Aura, GlowOrb } from './Aura';
import { Display } from './GlyphText';
import { Gradients, Palette, Spacing } from '../theme';

interface ScreenCanvasProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  edges?: readonly Edge[];
  contentStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
}

// Shared screen frame: gradient field + atmospheric glow orbs + safe area.
// Optional Cinzel header. Keeps every screen visually consistent.
export const ScreenCanvas: React.FC<ScreenCanvasProps> = ({
  children,
  title,
  subtitle,
  headerRight,
  edges = ['top'],
  contentStyle,
}) => {
  return (
    <View style={styles.root}>
      <Aura colors={Gradients.field} angle={125} style={StyleSheet.absoluteFill}>
        <View style={styles.overlay}>
          <GlowOrb
            color={Palette.emberGlow}
            size={320}
            opacity={0.5}
            style={styles.orbTop}
          />
          <GlowOrb
            color="rgba(143,180,255,0.35)"
            size={360}
            opacity={0.5}
            style={styles.orbBottom}
          />
        </View>
      </Aura>

      <SafeAreaView style={styles.safe} edges={edges}>
        {title ? (
          <Animated.View
            entering={FadeIn.duration(420)}
            style={styles.header}>
            <View style={styles.headerText}>
              <Display variant="title">{title}</Display>
              {subtitle ? (
                <Display
                  variant="eyebrow"
                  color={Palette.inkMuted}
                  style={styles.subtitle}>
                  {subtitle}
                </Display>
              ) : null}
            </View>
            {headerRight}
          </Animated.View>
        ) : null}
        <View style={[styles.content, contentStyle]}>{children}</View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.abyss },
  overlay: { flex: 1 },
  orbTop: { position: 'absolute', top: -120, right: -90 },
  orbBottom: { position: 'absolute', bottom: -120, left: -120 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerText: { flex: 1 },
  subtitle: { marginTop: 6 },
  content: { flex: 1 },
});
