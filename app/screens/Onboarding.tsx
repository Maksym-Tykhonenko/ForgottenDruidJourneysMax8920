import React, { useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  useWindowDimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Aura, GlowOrb } from '../components/Aura';
import { Body, Display } from '../components/GlyphText';
import { EmberButton } from '../components/EmberButton';
import { Gradients, Palette, Radii, Spacing } from '../theme';
import { ONBOARDING_SLIDES } from '../data/catalogue';
import { OnboardingPlates } from '../data/artwork';

interface OnboardingProps {
  onDone: () => void;
}

const Dot: React.FC<{ active: boolean }> = ({ active }) => {
  const style = useAnimatedStyle(() => ({
    width: withSpring(active ? 26 : 8, { damping: 16, stiffness: 200 }),
    opacity: withSpring(active ? 1 : 0.4),
  }));
  return (
    <Animated.View
      style={[
        styles.dot,
        style,
        { backgroundColor: active ? Palette.ember : Palette.inkMuted },
      ]}
    />
  );
};

export const Onboarding: React.FC<OnboardingProps> = ({ onDone }) => {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const next = Math.round(x / width);
    if (next !== index) setIndex(next);
  };

  const advance = () => {
    if (index >= ONBOARDING_SLIDES.length - 1) {
      onDone();
      return;
    }
    scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
  };

  return (
    <Aura colors={Gradients.field} angle={135} style={styles.root}>
      <GlowOrb
        color={Palette.emberGlow}
        size={360}
        opacity={0.5}
        style={styles.orb}
      />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.dots}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <Dot key={i} active={i === index} />
          ))}
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}>
          {ONBOARDING_SLIDES.map((slide, i) => (
            <View key={i} style={[styles.slide, { width }]}>
              <Animated.View
                entering={FadeIn.duration(500)}
                style={styles.imageWrap}>
                <Image
                  source={OnboardingPlates[i]}
                  style={styles.image}
                  resizeMode="cover"
                />
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(120).duration(520)}
                style={styles.copy}>
                <Display variant="title" align="center">
                  {slide.title}
                </Display>
                <Body variant="lead" align="center" style={styles.body}>
                  {slide.body}
                </Body>
              </Animated.View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <EmberButton label={ONBOARDING_SLIDES[index].cta} onPress={advance} />
        </View>
      </SafeAreaView>
    </Aura>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  orb: { position: 'absolute', top: '6%', right: -60 },
  dots: {
    flexDirection: 'row',
    gap: 7,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  dot: { height: 8, borderRadius: 4 },
  slide: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
  },
  imageWrap: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
    aspectRatio: 0.82,
    borderWidth: 1,
    borderColor: Palette.glassLine,
    backgroundColor: Palette.midnight,
  },
  image: { width: '100%', height: '100%' },
  imageVeil: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
  },
  copy: { marginTop: Spacing.xxl, paddingHorizontal: Spacing.sm },
  body: { marginTop: Spacing.lg },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
});
