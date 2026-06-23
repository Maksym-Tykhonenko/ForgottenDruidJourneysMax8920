import React from 'react';
import { Pressable, PressableProps, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TappableProps extends PressableProps {
  scaleTo?: number;
  dimTo?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

// Universal pressable with spring scale + opacity feedback.
// Every interactive surface in the app uses this for consistent feel.
export const Tappable: React.FC<TappableProps> = ({
  scaleTo = 0.95,
  dimTo = 0.9,
  style,
  children,
  onPressIn,
  onPressOut,
  disabled,
  ...rest
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={e => {
        scale.value = withSpring(scaleTo, { damping: 15, stiffness: 320 });
        opacity.value = withTiming(dimTo, { duration: 90 });
        onPressIn?.(e);
      }}
      onPressOut={e => {
        scale.value = withSpring(1, { damping: 14, stiffness: 260 });
        opacity.value = withTiming(1, { duration: 130 });
        onPressOut?.(e);
      }}
      style={[{ opacity: disabled ? 0.45 : 1 }, animatedStyle, style]}>
      {children}
    </AnimatedPressable>
  );
};
