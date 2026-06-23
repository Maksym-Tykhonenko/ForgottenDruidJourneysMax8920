// Domain data access layer. Screens import from here rather than reaching
// into the raw `forakatd` folder directly, so the data source can evolve
// without rippling through the UI.

import places, { MysteryPlace } from '../../forakatd/mysteryPlaces';
import rawQuiz from '../../forakatd/quiz';

export type { MysteryPlace };

export const MYSTERIES: MysteryPlace[] = places;

export const findMystery = (id: number): MysteryPlace | undefined =>
  places.find(p => p.id === id);

export interface TrialQuestion {
  id: number;
  statement: string;
  answer: 'True' | 'False';
  explanation: string;
}

const ALL_QUESTIONS = rawQuiz as TrialQuestion[];

export const TRIAL_LENGTH = 10;

// Build a fresh randomized run of fixed length each time the trial starts.
export function buildTrial(count: number = TRIAL_LENGTH): TrialQuestion[] {
  const pool = [...ALL_QUESTIONS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export interface ONBOARDING_SLIDE {
  title: string;
  body: string;
  cta: string;
}

export const ONBOARDING_SLIDES: ONBOARDING_SLIDE[] = [
  {
    title: 'Welcome to\nForgotten Journeys',
    body: 'Explore mysterious locations, legends, and unexplained stories from around the world.',
    cta: 'Continue',
  },
  {
    title: 'Follow\nAncient Clues',
    body: 'Discover places connected to myths, strange events, and forgotten gatherings.',
    cta: 'Continue',
  },
  {
    title: 'Test\nYour Intuition',
    body: 'Answer mystery facts and learn the stories behind each explanation.',
    cta: 'Continue',
  },
  {
    title: 'Create\nYour Archive',
    body: 'Save observations, notes, and discoveries in your personal gallery.',
    cta: 'Enter the Mysteries',
  },
];
