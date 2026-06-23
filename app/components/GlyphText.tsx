import React from 'react';
import { Text, TextProps, TextStyle, StyleProp } from 'react-native';
import { Fonts, Palette } from '../theme';

type DisplayVariant =
  | 'hero'
  | 'title'
  | 'section'
  | 'card'
  | 'eyebrow'
  | 'button';

const DISPLAY_STYLES: Record<DisplayVariant, TextStyle> = {
  hero: { fontFamily: Fonts.displayBlack, fontSize: 30, lineHeight: 38, color: Palette.ink },
  title: { fontFamily: Fonts.displayExtra, fontSize: 24, lineHeight: 30, color: Palette.ink },
  section: { fontFamily: Fonts.displayBold, fontSize: 19, lineHeight: 25, color: Palette.ink },
  card: { fontFamily: Fonts.displaySemi, fontSize: 16, lineHeight: 21, color: Palette.ink },
  eyebrow: {
    fontFamily: Fonts.displayMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 2.2,
    color: Palette.inkMuted,
  },
  button: {
    fontFamily: Fonts.displayBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 1.2,
    color: Palette.abyss,
  },
};

interface DisplayProps extends TextProps {
  variant?: DisplayVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
}

// Cinzel display type. Use for headings, eyebrows and button labels.
export const Display: React.FC<DisplayProps> = ({
  variant = 'title',
  color,
  align,
  style,
  ...rest
}) => (
  <Text
    {...rest}
    style={[
      DISPLAY_STYLES[variant],
      color ? { color } : null,
      align ? { textAlign: align } : null,
      style,
    ]}
  />
);

type BodyVariant = 'lead' | 'body' | 'small' | 'tiny';

const BODY_STYLES: Record<BodyVariant, TextStyle> = {
  lead: { fontSize: 16, lineHeight: 25, color: Palette.inkSoft },
  body: { fontSize: 14, lineHeight: 22, color: Palette.inkSoft },
  small: { fontSize: 12.5, lineHeight: 19, color: Palette.inkMuted },
  tiny: { fontSize: 11, lineHeight: 16, color: Palette.inkMuted },
};

interface BodyProps extends TextProps {
  variant?: BodyVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  weight?: TextStyle['fontWeight'];
  style?: StyleProp<TextStyle>;
}

// System-font reading text for descriptions and paragraphs.
export const Body: React.FC<BodyProps> = ({
  variant = 'body',
  color,
  align,
  weight,
  style,
  ...rest
}) => (
  <Text
    {...rest}
    style={[
      BODY_STYLES[variant],
      color ? { color } : null,
      align ? { textAlign: align } : null,
      weight ? { fontWeight: weight } : null,
      style,
    ]}
  />
);
