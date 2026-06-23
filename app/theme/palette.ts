// Colour tokens for the "Forgotten Journeys" mystical-blue theme.
// Single source of truth — never hard-code hex values inside screens.

export const Palette = {
  // Deep night-blue field
  abyss: '#070D1F',
  night: '#0C1430',
  midnight: '#0F1A3C',
  dusk: '#14224C',
  slate: '#1B2C5C',

  // Glass surfaces
  glass: 'rgba(30, 49, 102, 0.55)',
  glassRaised: 'rgba(43, 66, 130, 0.65)',
  glassLine: 'rgba(140, 170, 245, 0.18)',
  glassLineSoft: 'rgba(140, 170, 245, 0.10)',

  // Premium amber accent
  ember: '#F2932F',
  emberBright: '#FFAE47',
  emberDeep: '#D6781C',
  emberGlow: 'rgba(242, 147, 47, 0.45)',

  // Cool moonlight accent
  moon: '#8FB4FF',
  frost: '#BFD4FF',

  // Text
  ink: '#F4F7FF',
  inkSoft: '#C3CFEC',
  inkMuted: '#8595BE',
  inkFaint: '#5E6E9C',

  // Feedback
  correct: '#3FB984',
  correctSoft: 'rgba(63, 185, 132, 0.18)',
  wrong: '#E2566B',
  wrongSoft: 'rgba(226, 86, 107, 0.20)',

  pure: '#FFFFFF',
  shadow: '#000000',
} as const;

// Reusable gradient stop sets (used with a lightweight gradient component).
export const Gradients = {
  field: [Palette.abyss, Palette.night, Palette.midnight] as const,
  card: ['rgba(27, 44, 92, 0.92)', 'rgba(15, 26, 60, 0.92)'] as const,
  ember: [Palette.emberBright, Palette.ember, Palette.emberDeep] as const,
  veil: ['rgba(12, 20, 48, 0)', 'rgba(7, 13, 31, 0.96)'] as const,
};
