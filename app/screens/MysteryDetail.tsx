import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { ArrowLeft, Heart, Share2 } from 'lucide-react-native';
import { Aura, GlowOrb } from '../components/Aura';
import { Body, Display } from '../components/GlyphText';
import { IconPuck } from '../components/IconPuck';
import { shareMystery } from '../components/MysteryCard';
import { Gradients, Palette, Spacing } from '../theme';
import { MysteryPlace } from '../data/catalogue';
import { useVault } from '../vault/VaultProvider';

interface MysteryDetailProps {
  place: MysteryPlace;
  onClose: () => void;
}

// Full-screen article overlay with a smooth slide-up entrance. Image header
// with floating controls, then the three-paragraph long-form story.
export const MysteryDetail: React.FC<MysteryDetailProps> = ({
  place,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useVault();
  const fav = isFavorite(place.id);
  const paragraphs = place.fullDescription.split('\n\n');

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(20).stiffness(180)}
      exiting={SlideOutDown.duration(220)}
      style={styles.root}>
      <Aura colors={Gradients.field} angle={130} style={StyleSheet.absoluteFill}>
        <GlowOrb
          color={Palette.emberGlow}
          size={300}
          opacity={0.4}
          style={styles.orb}
        />
      </Aura>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}>
        <View style={styles.header}>
          <Image source={place.image} style={styles.image} resizeMode="cover" />

          <View style={[styles.controls, { top: insets.top + 8 }]}>
            <IconPuck onPress={onClose}>
              <ArrowLeft size={20} color={Palette.ink} strokeWidth={2.2} />
            </IconPuck>
            <View style={styles.controlRight}>
              <IconPuck
                tone="ember"
                active={fav}
                onPress={() => toggleFavorite(place.id)}>
                <Heart
                  size={18}
                  color={fav ? Palette.ember : Palette.ink}
                  fill={fav ? Palette.ember : 'transparent'}
                  strokeWidth={2}
                />
              </IconPuck>
              <IconPuck onPress={() => shareMystery(place)}>
                <Share2 size={17} color={Palette.ink} strokeWidth={2} />
              </IconPuck>
            </View>
          </View>
        </View>

        <Animated.View
          entering={FadeInDown.delay(120).duration(500)}
          style={styles.headline}>
          <Display variant="eyebrow" color={Palette.moon}>
            {place.region.toUpperCase()}
          </Display>
          <Display variant="title" style={styles.title}>
            {place.name}
          </Display>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(220).duration(520)}
          style={styles.article}>
          {paragraphs.map((p, i) => (
            <Body key={i} variant="lead" style={styles.paragraph}>
              {p}
            </Body>
          ))}
        </Animated.View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, backgroundColor: Palette.abyss },
  orb: { position: 'absolute', bottom: 40, right: -60 },
  // Full 4:3 hero so the whole artwork is shown, uncropped.
  header: { width: '100%', aspectRatio: 4 / 3, backgroundColor: Palette.midnight },
  image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  controls: {
    position: 'absolute',
    left: Spacing.xl,
    right: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlRight: { flexDirection: 'row', gap: Spacing.sm },
  headline: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  title: { marginTop: 8 },
  article: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  paragraph: { marginBottom: Spacing.lg },
});
