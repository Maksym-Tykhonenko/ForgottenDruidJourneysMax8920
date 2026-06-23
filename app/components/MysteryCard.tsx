import React from 'react';
import { Image, Share, StyleSheet, View } from 'react-native';
import { Heart, Share2 } from 'lucide-react-native';
import { Body, Display } from './GlyphText';
import { EmberButton } from './EmberButton';
import { IconPuck } from './IconPuck';
import { Palette, Radii, Spacing } from '../theme';
import { MysteryPlace } from '../data/catalogue';
import { useVault } from '../vault/VaultProvider';

interface MysteryCardProps {
  place: MysteryPlace;
  onOpen: () => void;
}

export function shareMystery(place: MysteryPlace) {
  Share.share({
    message: `${place.name} — ${place.region}\n\n${place.shortDescription}\n\nDiscovered in Forgotten Journeys.`,
  }).catch(() => {});
}

// Rich mystery card: cover image with overlaid title, teaser, and an
// actions row (Open / Favorite / Share). Shared by list + favorites.
export const MysteryCard: React.FC<MysteryCardProps> = ({ place, onOpen }) => {
  const { isFavorite, toggleFavorite } = useVault();
  const fav = isFavorite(place.id);

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={place.image} style={styles.image} resizeMode="cover" />
      </View>

      <View style={styles.body}>
        <Display variant="eyebrow" color={Palette.moon}>
          {place.region.toUpperCase()}
        </Display>
        <Display variant="section" style={styles.title}>
          {place.name}
        </Display>
        <Body variant="body" numberOfLines={2} style={styles.desc}>
          {place.shortDescription}
        </Body>
        <View style={styles.actions}>
          <EmberButton
            label="Open Mystery"
            onPress={onOpen}
            compact
            fullWidth={false}
            style={styles.openBtn}
          />
          <IconPuck
            tone="ember"
            active={fav}
            onPress={() => toggleFavorite(place.id)}>
            <Heart
              size={18}
              color={fav ? Palette.ember : Palette.inkSoft}
              fill={fav ? Palette.ember : 'transparent'}
              strokeWidth={2}
            />
          </IconPuck>
          <IconPuck onPress={() => shareMystery(place)}>
            <Share2 size={17} color={Palette.inkSoft} strokeWidth={2} />
          </IconPuck>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
    backgroundColor: Palette.glass,
    borderWidth: 1,
    borderColor: Palette.glassLine,
  },
  // Source artwork is 4:3 — match it exactly so `cover` shows the whole scene.
  imageWrap: { width: '100%', aspectRatio: 4 / 3, backgroundColor: Palette.midnight },
  image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  title: { marginTop: 6 },
  desc: { marginTop: Spacing.md },
  body: { padding: Spacing.lg, paddingTop: Spacing.lg },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  openBtn: { flex: 1 },
});
