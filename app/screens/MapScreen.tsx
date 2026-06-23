import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import { Body, Display } from '../components/GlyphText';
import { EmberButton } from '../components/EmberButton';
import { IconPuck } from '../components/IconPuck';
import { Aura } from '../components/Aura';
import {
  bottomSafePad,
  Gradients,
  Palette,
  Radii,
  Spacing,
} from '../theme';
import { findMystery, MysteryPlace } from '../data/catalogue';
import { buildMapHtml } from './mapHtml';
import { useNav } from '../navigation/NavContext';

export const MapScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { openMystery } = useNav();
  const webRef = useRef<WebView>(null);
  const html = useMemo(() => buildMapHtml(), []);
  const [selected, setSelected] = useState<MysteryPlace | null>(null);
  const [ready, setReady] = useState(false);

  const onMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'select') {
        const place = findMystery(data.id);
        if (place) setSelected(place);
      }
    } catch {}
  };

  const dismiss = () => {
    setSelected(null);
    webRef.current?.postMessage(JSON.stringify({ type: 'deselect' }));
  };

  return (
    <View style={styles.root}>
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html }}
        onMessage={onMessage}
        onLoadEnd={() => setReady(true)}
        style={styles.web}
        scrollEnabled={false}
        overScrollMode="never"
      />

      {!ready ? (
        <View style={styles.loading} pointerEvents="none">
          <ActivityIndicator color={Palette.ember} />
        </View>
      ) : null}

      {/* Header overlay */}
      <View style={[styles.header, { top: insets.top + Spacing.sm }]}>
        <Aura colors={Gradients.card} angle={120} radius={Radii.lg} style={styles.headerCard}>
          <Display variant="section">Mystery Map</Display>
          <Display variant="eyebrow" style={styles.headerSub}>
            TAP A PIN TO EXPLORE
          </Display>
        </Aura>
      </View>

      {/* Floating info card — kept clear of the bottom bar */}
      {selected ? (
        <Animated.View
          key={selected.id}
          entering={SlideInDown.springify().damping(18).stiffness(170)}
          exiting={SlideOutDown.duration(200)}
          style={[
            styles.cardWrap,
            { bottom: bottomSafePad(insets.bottom) - 10 },
          ]}>
          <Aura
            colors={Gradients.card}
            angle={125}
            radius={Radii.lg}
            style={styles.card}>
            <Image source={selected.image} style={styles.thumb} />
            <View style={styles.cardBody}>
              <Display variant="card" numberOfLines={1}>
                {selected.name}
              </Display>
              <Body variant="small" numberOfLines={2} style={styles.cardDesc}>
                {selected.shortDescription}
              </Body>
              <EmberButton
                label="Open Mystery"
                compact
                onPress={() => openMystery(selected.id)}
              />
            </View>
            <View style={styles.close}>
              <IconPuck size={30} onPress={dismiss}>
                <X size={15} color={Palette.inkSoft} strokeWidth={2.4} />
              </IconPuck>
            </View>
          </Aura>
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.abyss },
  web: { flex: 1, backgroundColor: Palette.abyss },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: { position: 'absolute', left: Spacing.xl, right: Spacing.xl },
  headerCard: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Palette.glassLine,
  },
  headerSub: { marginTop: 4 },
  cardWrap: { position: 'absolute', left: Spacing.xl, right: Spacing.xl },
  card: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.glassLine,
    shadowColor: Palette.shadow,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  thumb: {
    width: 84,
    height: 104,
    borderRadius: Radii.md,
    backgroundColor: Palette.midnight,
  },
  cardBody: { flex: 1, marginLeft: Spacing.md, justifyContent: 'center' },
  cardDesc: { marginTop: 4, marginBottom: Spacing.md },
  close: { position: 'absolute', top: Spacing.sm, right: Spacing.sm },
});
