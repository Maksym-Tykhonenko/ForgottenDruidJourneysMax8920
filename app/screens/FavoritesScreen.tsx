import React from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ScreenCanvas } from '../components/ScreenCanvas';
import { Body, Display } from '../components/GlyphText';
import { EmberButton } from '../components/EmberButton';
import { MysteryCard } from '../components/MysteryCard';
import { GlowOrb } from '../components/Aura';
import { bottomSafePad, Palette, Spacing } from '../theme';
import { MYSTERIES, MysteryPlace } from '../data/catalogue';
import { Illustrations } from '../data/artwork';
import { useVault } from '../vault/VaultProvider';
import { useNav } from '../navigation/NavContext';

export const FavoritesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { favorites } = useVault();
  const { openMystery, setTab } = useNav();

  // Preserve the order favorites were added (most recent first).
  const saved = favorites
    .map(id => MYSTERIES.find(m => m.id === id))
    .filter((m): m is MysteryPlace => !!m);

  if (saved.length === 0) {
    return (
      <ScreenCanvas title="Favorites">
        <Animated.View entering={FadeIn.duration(500)} style={styles.empty}>
          <View style={styles.art}>
            <GlowOrb
              color={Palette.emberGlow}
              size={280}
              opacity={0.45}
              style={styles.orb}
            />
            <Image source={Illustrations.favoriteHeart} style={styles.img} />
          </View>
          <Display variant="section" align="center">
            No Saved Mysteries Yet
          </Display>
          <Body variant="lead" align="center" style={styles.text}>
            Tap the heart icon on any mystery to save it here for quick access.
          </Body>
          <EmberButton
            label="Explore Mysteries"
            onPress={() => setTab('mysteries')}
            style={styles.cta}
          />
        </Animated.View>
      </ScreenCanvas>
    );
  }

  return (
    <ScreenCanvas
      title="Favorites"
      subtitle={`${saved.length} SAVED`}>
      <FlatList
        data={saved}
        keyExtractor={i => String(i.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomSafePad(insets.bottom) },
        ]}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(Math.min(index, 8) * 70).duration(460)}
            style={styles.item}>
            <MysteryCard place={item} onOpen={() => openMystery(item.id)} />
          </Animated.View>
        )}
      />
    </ScreenCanvas>
  );
};

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  art: { alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  orb: { position: 'absolute' },
  img: { width: 210, height: 210, resizeMode: 'contain' },
  text: { marginTop: Spacing.md },
  cta: { marginTop: Spacing.xxl },
  list: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm },
  item: { marginBottom: Spacing.xl },
});
