import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Compass } from 'lucide-react-native';
import { Body, Display } from '../components/GlyphText';
import { Aura, GlowOrb } from '../components/Aura';
import { Gradients, Palette } from '../theme';

interface GlyphLoaderProps {
  onFinish: () => void;
}

// Animated portal/compass loader that fades the brand in, spins the
// compass within glowing rings, then signals completion.
export const GlyphLoader: React.FC<GlyphLoaderProps> = ({ onFinish }) => {
  const spin = useSharedValue(0);
  const pulse = useSharedValue(0);
  const ringSpin = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    spin.value = withRepeat(
      withTiming(1, { duration: 5200, easing: Easing.linear }),
      -1,
    );
    ringSpin.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.linear }),
      -1,
    );
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
    progress.value = withDelay(
      300,
      withTiming(1, { duration: 2100, easing: Easing.out(Easing.cubic) }),
    );

    const t = setTimeout(onFinish, 2500);
    return () => {
      clearTimeout(t);
      cancelAnimation(spin);
      cancelAnimation(ringSpin);
      cancelAnimation(pulse);
    };
  }, [spin, ringSpin, pulse, progress, onFinish]);

  const compassStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-ringSpin.value * 360}deg` }],
  }));
  const haloStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.35, 0.85]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.9, 1.12]) }],
  }));
  const barStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progress.value, [0, 1], [4, 100])}%`,
  }));

  return (
    <Aura colors={Gradients.field} angle={130} style={styles.root}>
      <GlowOrb
        color={Palette.emberGlow}
        size={420}
        opacity={0.55}
        style={styles.orb}
      />

      <Animated.View entering={FadeIn.duration(700)} style={styles.center}>
        <View style={styles.emblem}>
          <Animated.View style={[styles.halo, haloStyle]}>
            <GlowOrb color="rgba(143,180,255,0.5)" size={220} />
          </Animated.View>

          <Animated.View style={[styles.ring, styles.ringOuter, ringStyle]} />
          <View style={[styles.ring, styles.ringInner]} />

          <Animated.View style={compassStyle}>
            <Compass size={74} color={Palette.emberBright} strokeWidth={1.6} />
          </Animated.View>
        </View>

        <Display variant="hero" align="center" style={styles.brand}>
          Forgotten Journeys
        </Display>
        <Body variant="small" align="center" style={styles.tag}>
          MAPPING THE WORLD'S MYSTERIES
        </Body>

        <View style={styles.track}>
          <Animated.View style={[styles.fill, barStyle]}>
            <Aura colors={Gradients.ember} angle={0} style={styles.fillInner} />
          </Animated.View>
        </View>
      </Animated.View>
    </Aura>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  orb: { position: 'absolute', top: '12%' },
  center: { alignItems: 'center', paddingHorizontal: 32 },
  emblem: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  halo: { position: 'absolute' },
  ring: {
    position: 'absolute',
    borderRadius: 999,
  },
  ringOuter: {
    width: 168,
    height: 168,
    borderWidth: 1,
    borderColor: 'rgba(143,180,255,0.35)',
    borderStyle: 'dashed',
  },
  ringInner: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: 'rgba(242,147,47,0.4)',
  },
  brand: { marginTop: 4, letterSpacing: 1 },
  tag: { marginTop: 10, letterSpacing: 3 },
  track: {
    marginTop: 34,
    width: 200,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(143,180,255,0.16)',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4, overflow: 'hidden' },
  fillInner: { flex: 1 },
});
