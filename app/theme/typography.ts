// Font + spacing + radius tokens.

export const Fonts = {
  // Cinzel family (titles / display)
  displayBlack: 'Cinzel-Black',
  displayExtra: 'Cinzel-ExtraBold',
  displayBold: 'Cinzel-Bold',
  displaySemi: 'Cinzel-SemiBold',
  displayMedium: 'Cinzel-Medium',
  display: 'Cinzel-Regular',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  huge: 40,
} as const;

export const Radii = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

// Height reserved for the floating bottom bar + safe gap so scroll content
// is never hidden behind it. Screens add this to their list bottom padding.
export const TAB_BAR_HEIGHT = 64;
export const TAB_BAR_GUTTER = 18;
export const bottomSafePad = (inset: number) =>
  TAB_BAR_HEIGHT + TAB_BAR_GUTTER + inset + 24;
