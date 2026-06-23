import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import { Body, Display } from './GlyphText';
import { EmberButton } from './EmberButton';
import { VeilCard } from './VeilCard';
import { Spacing } from '../theme';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Themed confirmation modal with backdrop fade + card zoom.
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmLabel = 'Clear',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onCancel}>
      <View style={styles.root}>
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(160)}
          style={StyleSheet.absoluteFill}>
          <View style={styles.scrim} />
        </Animated.View>

        <Animated.View
          entering={ZoomIn.springify().damping(16).stiffness(180)}
          exiting={ZoomOut.duration(140)}
          style={styles.cardWrap}>
          <VeilCard glow radius={22}>
            <Display variant="section" align="center">
              {title}
            </Display>
            <Body variant="body" align="center" style={styles.message}>
              {message}
            </Body>
            <View style={styles.actions}>
              <EmberButton
                label={confirmLabel}
                onPress={onConfirm}
                fullWidth={false}
                compact
                style={styles.flex}
              />
              <EmberButton
                label={cancelLabel}
                variant="ghost"
                onPress={onCancel}
                fullWidth={false}
                compact
                style={styles.flex}
              />
            </View>
          </VeilCard>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  scrim: { flex: 1, backgroundColor: 'rgba(4,8,20,0.74)' },
  cardWrap: { width: '100%', maxWidth: 360 },
  message: { marginTop: Spacing.md, marginBottom: Spacing.xl },
  actions: { flexDirection: 'row', gap: Spacing.md },
  flex: { flex: 1 },
});
