import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  Sequence,
  Artifact,
  interpolate,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
// Noise removed for render stability
import { blurDissolve } from "../library/components/layout/transitions/presentations";
import { HeroScene } from "./scenes/HeroScene";
import { DictationScene } from "./scenes/DictationScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { PlatformScene } from "./scenes/PlatformScene";
import { CTAScene } from "./scenes/CTAScene";

const CREAM = "#FFFFEB";
const TEAL = "#034F46";
const LAVENDER = "#F0D7FF";

// Audio URLs
const MUSIC_URL =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/music/1773823771676_i8qxw20jp1e_music_Modern_minimal_tech_.mp3";
const SFX_CHIME =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1773823743399_u2jmgpbsm9_sfx_Soft_magical_chime_with_sparkl.mp3";
const SFX_SWOOSH =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1773823745640_s43d3wbv0t_sfx_Gentle_tech_swoosh__smooth_tra.mp3";

// Scene durations (in frames at 30fps)
const HERO_DUR = 120; // 4s
const DICTATION_DUR = 150; // 5s
const FEATURES_DUR = 140; // ~4.7s
const PLATFORM_DUR = 130; // ~4.3s
const CTA_DUR = 130; // ~4.3s
const EXTRA_END = 30; // 1s buffer

// Transition duration
const TRANS_DUR = 18; // 0.6s
const NUM_TRANSITIONS = 4;

// Total = sum(scenes) - sum(transitions) + end buffer
const TOTAL_DURATION =
  HERO_DUR +
  DICTATION_DUR +
  FEATURES_DUR +
  PLATFORM_DUR +
  CTA_DUR -
  NUM_TRANSITIONS * TRANS_DUR +
  EXTRA_END;

export const COMPOSITION_DURATION = TOTAL_DURATION;

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Background gradient that subtly shifts
  const gradAngle = 135 + Math.sin(frame / 100) * 10;
  const bgOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Fade out at the end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <>
      {/* Thumbnail */}
      {frame === 0 && (
        <Artifact content={Artifact.Thumbnail} filename="thumbnail.jpeg" />
      )}

      {/* Background layer - persists across all scenes */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${gradAngle}deg, ${CREAM} 0%, #FFF9E0 40%, ${CREAM} 70%, #FFF5F9 100%)`,
          opacity: bgOpacity,
        }}
      />

      {/* Subtle animated gradient orbs in background */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${LAVENDER}18 0%, transparent 70%)`,
          transform: `translate(${Math.sin(frame / 60) * 30}px, ${Math.cos(frame / 80) * 20}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "5%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${TEAL}10 0%, transparent 70%)`,
          transform: `translate(${Math.cos(frame / 70) * 25}px, ${Math.sin(frame / 90) * 18}px)`,
        }}
      />

      {/* Scene transitions */}
      <div style={{ opacity: fadeOut }}>
        <TransitionSeries>
          {/* Scene 1: Hero */}
          <TransitionSeries.Sequence durationInFrames={HERO_DUR}>
            <HeroScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={blurDissolve()}
            timing={linearTiming({ durationInFrames: TRANS_DUR })}
          />

          {/* Scene 2: Dictation Demo */}
          <TransitionSeries.Sequence durationInFrames={DICTATION_DUR}>
            <DictationScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={blurDissolve()}
            timing={linearTiming({ durationInFrames: TRANS_DUR })}
          />

          {/* Scene 3: Features */}
          <TransitionSeries.Sequence durationInFrames={FEATURES_DUR}>
            <FeaturesScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={blurDissolve()}
            timing={linearTiming({ durationInFrames: TRANS_DUR })}
          />

          {/* Scene 4: Platforms */}
          <TransitionSeries.Sequence durationInFrames={PLATFORM_DUR}>
            <PlatformScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={blurDissolve()}
            timing={linearTiming({ durationInFrames: TRANS_DUR })}
          />

          {/* Scene 5: CTA */}
          <TransitionSeries.Sequence durationInFrames={CTA_DUR + EXTRA_END}>
            <CTAScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </div>

      {/* Subtle texture overlay via CSS */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      {/* Background music */}
      <Audio
        src={MUSIC_URL}
        volume={(f) => {
          const fadeInVol = interpolate(f, [0, 30], [0, 0.35], {
            extrapolateRight: "clamp",
          });
          const fadeOutVol = interpolate(
            f,
            [TOTAL_DURATION * fps / 30 - 60, TOTAL_DURATION * fps / 30],
            [0.35, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return Math.min(fadeInVol, fadeOutVol + 0.35);
        }}
        loop
      />

      {/* SFX: Chime when AI transforms text (around frame 85 of dictation scene + hero duration - transition) */}
      <Sequence from={HERO_DUR - TRANS_DUR + 85}>
        <Audio src={SFX_CHIME} volume={0.3} />
      </Sequence>

      {/* SFX: Swoosh on transitions */}
      <Sequence from={HERO_DUR - Math.floor(TRANS_DUR / 2)}>
        <Audio src={SFX_SWOOSH} volume={0.2} />
      </Sequence>
      <Sequence
        from={
          HERO_DUR +
          DICTATION_DUR -
          TRANS_DUR -
          Math.floor(TRANS_DUR / 2)
        }
      >
        <Audio src={SFX_SWOOSH} volume={0.18} />
      </Sequence>
      <Sequence
        from={
          HERO_DUR +
          DICTATION_DUR +
          FEATURES_DUR -
          2 * TRANS_DUR -
          Math.floor(TRANS_DUR / 2)
        }
      >
        <Audio src={SFX_SWOOSH} volume={0.18} />
      </Sequence>
    </>
  );
};
