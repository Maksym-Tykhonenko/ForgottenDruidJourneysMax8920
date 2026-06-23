import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenCanvas } from '../components/ScreenCanvas';
import { MysteryCard } from '../components/MysteryCard';
import { MYSTERIES, MysteryPlace } from '../data/catalogue';
import { bottomSafePad, Spacing } from '../theme';
import { useNav } from '../navigation/NavContext';

export const MysteriesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { openMystery } = useNav();

  const renderItem = ({
    item,
    index,
  }: {
    item: MysteryPlace;
    index: number;
  }) => (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 70).duration(480)}
      style={styles.item}>
      <MysteryCard place={item} onOpen={() => openMystery(item.id)} />
    </Animated.View>
  );

  return (
    <ScreenCanvas title="Mysteries" subtitle="16 UNEXPLAINED LOCATIONS">
      <FlatList
        data={MYSTERIES}
        keyExtractor={i => String(i.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomSafePad(insets.bottom) },
        ]}
        ListFooterComponent={<View />}
      />
    </ScreenCanvas>
  );
};

const styles = StyleSheet.create({
  list: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm },
  item: { marginBottom: Spacing.xl },
});
