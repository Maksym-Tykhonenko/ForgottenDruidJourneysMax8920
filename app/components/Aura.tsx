import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

let gradientSeq = 0;
const nextId = (prefix: string) => `${prefix}_${gradientSeq++}`;

interface AuraProps {
  colors: readonly string[];
  // 0 => vertical (top->bottom), 1 => horizontal, diagonal supported via angle
  angle?: number; // degrees, 90 = top->bottom
  locations?: number[];
  style?: StyleProp<ViewStyle>;
  radius?: number;
  children?: React.ReactNode;
}

// Lightweight linear gradient fill backed by react-native-svg.
// Used everywhere a soft gradient surface is needed (buttons, cards, fields).
export const Aura: React.FC<AuraProps> = ({
  colors,
  angle = 90,
  locations,
  style,
  radius = 0,
  children,
}) => {
  const id = React.useMemo(() => nextId('lin'), []);
  const rad = (angle * Math.PI) / 180;
  const x1 = 0.5 - Math.cos(rad) / 2;
  const y1 = 0.5 - Math.sin(rad) / 2;
  const x2 = 0.5 + Math.cos(rad) / 2;
  const y2 = 0.5 + Math.sin(rad) / 2;

  return (
    <View style={[{ overflow: 'hidden', borderRadius: radius }, style]}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={id} x1={`${x1}`} y1={`${y1}`} x2={`${x2}`} y2={`${y2}`}>
            {colors.map((c, i) => (
              <Stop
                key={i}
                offset={
                  locations ? locations[i] : i / Math.max(1, colors.length - 1)
                }
                stopColor={c}
              />
            ))}
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
};

interface GlowOrbProps {
  color: string;
  size: number;
  style?: StyleProp<ViewStyle>;
  opacity?: number;
}

// Soft radial glow used to add atmosphere behind screens.
export const GlowOrb: React.FC<GlowOrbProps> = ({
  color,
  size,
  style,
  opacity = 1,
}) => {
  const id = React.useMemo(() => nextId('rad'), []);
  return (
    <View
      pointerEvents="none"
      style={[{ width: size, height: size, opacity }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={color} stopOpacity={0.9} />
            <Stop offset="0.55" stopColor={color} stopOpacity={0.25} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width={size} height={size} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
};
