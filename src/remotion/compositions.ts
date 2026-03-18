import { Main } from "./compositions/Main";

// Scene durations match Main.tsx
const HERO_DUR = 120;
const DICTATION_DUR = 150;
const FEATURES_DUR = 140;
const PLATFORM_DUR = 130;
const CTA_DUR = 130;
const EXTRA_END = 30;
const TRANS_DUR = 18;
const NUM_TRANSITIONS = 4;

const TOTAL_DURATION =
  HERO_DUR +
  DICTATION_DUR +
  FEATURES_DUR +
  PLATFORM_DUR +
  CTA_DUR -
  NUM_TRANSITIONS * TRANS_DUR +
  EXTRA_END;

// Single composition configuration
export const composition = {
  id: "Main",
  component: Main,
  durationInFrames: TOTAL_DURATION,
  fps: 30,
  width: 1920,
  height: 1080,
};
