import React, { useState } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  ChevronRight,
  Cog,
  Heart,
  Images,
  Music4,
  Share2,
  Vibrate,
} from 'lucide-react-native';
import { ScreenCanvas } from '../components/ScreenCanvas';
import { Body, Display } from '../components/GlyphText';
import { Toggle } from '../components/Toggle';
import { Tappable } from '../components/Tappable';
import { VeilCard } from '../components/VeilCard';
import { GlowOrb } from '../components/Aura';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { bottomSafePad, Palette, Radii, Spacing } from '../theme';
import { useVault } from '../vault/VaultProvider';

const Divider = () => <View style={styles.divider} />;

const Row: React.FC<{
  icon: React.ReactNode;
  label: string;
  right: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
}> = ({ icon, label, right, onPress }) => {
  const content = (
    <View style={styles.row}>
      <View style={styles.rowIcon}>{icon}</View>
      <Body variant="body" color={Palette.ink} style={styles.rowLabel}>
        {label}
      </Body>
      {right}
    </View>
  );
  return onPress ? (
    <Tappable onPress={onPress} scaleTo={0.98}>
      {content}
    </Tappable>
  ) : (
    content
  );
};

export const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { settings, setMusic, setVibration, clearFavorites, clearArchive } =
    useVault();
  const [confirm, setConfirm] = useState<null | 'favorites' | 'gallery'>(null);

  const shareApp = () => {
    Share.share({
      message:
        'Explore the world\'s greatest unexplained places with Forgotten Journeys — mysteries, legends, and a quiz to test your intuition.',
    }).catch(() => {});
  };

  return (
    <ScreenCanvas title="Settings">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: bottomSafePad(insets.bottom) },
        ]}>
        <Animated.View entering={FadeInDown.duration(460)}>
          <Display variant="eyebrow" style={styles.sectionLabel}>
            PREFERENCES
          </Display>
          <VeilCard padded={false} style={styles.card}>
            <View style={styles.cardPad}>
              <Row
                icon={<Music4 size={18} color={Palette.frost} strokeWidth={2} />}
                label="Notifications"
                right={
                  <Toggle value={settings.music} onChange={setMusic} />
                }
              />
              <Divider />
              <Row
                icon={<Vibrate size={18} color={Palette.frost} strokeWidth={2} />}
                label="Vibration"
                right={
                  <Toggle
                    value={settings.vibration}
                    onChange={setVibration}
                  />
                }
              />
            </View>
          </VeilCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(460)}>
          <Display variant="eyebrow" style={styles.sectionLabel}>
            APP
          </Display>
          <VeilCard padded={false} style={styles.card}>
            <View style={styles.cardPad}>
              <Row
                icon={<Share2 size={18} color={Palette.frost} strokeWidth={2} />}
                label="Share App"
                onPress={shareApp}
                right={
                  <ChevronRight
                    size={18}
                    color={Palette.inkMuted}
                    strokeWidth={2}
                  />
                }
              />
              <Divider />
              <Row
                icon={<Heart size={18} color={Palette.ember} strokeWidth={2} />}
                label="Clear Favorites"
                onPress={() => setConfirm('favorites')}
                right={
                  <ChevronRight
                    size={18}
                    color={Palette.inkMuted}
                    strokeWidth={2}
                  />
                }
              />
              <Divider />
              <Row
                icon={<Images size={18} color={Palette.ember} strokeWidth={2} />}
                label="Clear Gallery"
                onPress={() => setConfirm('gallery')}
                right={
                  <ChevronRight
                    size={18}
                    color={Palette.inkMuted}
                    strokeWidth={2}
                  />
                }
              />
            </View>
          </VeilCard>
        </Animated.View>

        <View style={styles.emblem}>
          <GlowOrb
            color={Palette.emberGlow}
            size={220}
            opacity={0.4}
            style={styles.emblemOrb}
          />
          <Cog size={72} color="rgba(143,180,255,0.55)" strokeWidth={1.2} />
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={confirm === 'favorites'}
        title="Clear Favorites?"
        message="All Favorites will be removed. Are you sure you want to clear your favorites list?"
        onConfirm={() => {
          clearFavorites();
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        visible={confirm === 'gallery'}
        title="Clear Gallery?"
        message="All gallery photos will be removed. Are you sure you want to clear your gallery?"
        onConfirm={() => {
          clearArchive();
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
    </ScreenCanvas>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm },
  sectionLabel: { marginBottom: Spacing.md, marginLeft: Spacing.xs },
  card: { marginBottom: Spacing.xl },
  cardPad: { paddingHorizontal: Spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: Radii.sm,
    backgroundColor: Palette.glassRaised,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  rowLabel: { flex: 1 },
  divider: { height: 1, backgroundColor: Palette.glassLineSoft },
  emblem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.huge,
  },
  emblemOrb: { position: 'absolute' },
});
