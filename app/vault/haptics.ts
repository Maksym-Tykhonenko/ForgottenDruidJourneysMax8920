import { Vibration } from 'react-native';

// Thin wrapper so screens never call Vibration directly; respects the
// user's vibration preference passed in from settings.
export function pulse(enabled: boolean, pattern: 'tap' | 'error' = 'tap') {
  if (!enabled) return;
  if (pattern === 'error') {
    Vibration.vibrate([0, 60, 70, 120]);
  } else {
    Vibration.vibrate(28);
  }
}
