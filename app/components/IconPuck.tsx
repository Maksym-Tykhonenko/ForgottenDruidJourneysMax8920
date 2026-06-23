import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tappable } from './Tappable';
import { Palette, Radii } from '../theme';

interface IconPuckProps {
  children: React.ReactNode;
  onPress?: () => void;
  active?: boolean;
  size?: number;
  tone?: 'glass' | 'ember';
}

// Circular glass icon button (header actions, favorite, share, close).
export const IconPuck: React.FC<IconPuckProps> = ({
  children,
  onPress,
  active = false,
  size = 40,
  tone = 'glass',
}) => {
  const emberActive = tone === 'ember' && active;
  return (
    <Tappable onPress={onPress} scaleTo={0.88}>
      <View
        style={[
          styles.base,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: emberActive
              ? 'rgba(242,147,47,0.22)'
              : Palette.glassRaised,
            borderColor: emberActive ? Palette.ember : Palette.glassLine,
          },
        ]}>
        {children}
      </View>
    </Tappable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: Radii.pill,
  },
});
