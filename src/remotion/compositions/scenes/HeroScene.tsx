import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
} from "remotion";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { TextAnimation } from "../../library/components/text/TextAnimation";
import { LiquidShape } from "../../library/components/effects/LiquidShape";

const { fontFamily: figtree } = loadFigtree("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
const { fontFamily: garamond } = loadEBGaramond("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const TEAL = "#034F46";
const LAVENDER = "#F0D7FF";

const LOGO_URL =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/wispr-flow/1773823725113_jwoudgd0hss_wispr_flow_official_logo.svg";

export const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance with spring
  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Tagline entrance
  const taglineProgress = spring({
    frame,
    fps,
    delay: 18,
    config: { damping: 14, stiffness: 80 },
  });
  const taglineY = interpolate(taglineProgress, [0, 1], [40, 0]);
  const taglineOpacity = interpolate(taglineProgress, [0, 1], [0, 1]);

  // Subtitle entrance
  const subtitleProgress = spring({
    frame,
    fps,
    delay: 30,
    config: { damping: 16, stiffness: 80 },
  });
  const subtitleY = interpolate(subtitleProgress, [0, 1], [30, 0]);
  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1]);

  // Floating blobs ambient movement
  const blob1X = Math.sin(frame / 40) * 30;
  const blob1Y = Math.cos(frame / 50) * 20;
  const blob2X = Math.cos(frame / 35) * 25;
  const blob2Y = Math.sin(frame / 45) * 30;

  // Soundwave bars
  const bars = Array.from({ length: 5 }, (_, i) => {
    const phase = (frame / fps) * 3 + i * 0.8;
    const height = 12 + Math.sin(phase) * 10 + Math.cos(phase * 1.5) * 6;
    const barProgress = spring({
      frame,
      fps,
      delay: 40 + i * 3,
      config: { damping: 10 },
    });
    return { height, opacity: barProgress };
  });

  // Mic icon pulse
  const micPulse = 1 + Math.sin(frame / 10) * 0.04;

  return (
    <AbsoluteFill>
      {/* Floating ambient blobs */}
      <div
        style={{
          position: "absolute",
          top: -100 + blob1Y,
          right: -80 + blob1X,
          opacity: 0.15,
        }}
      >
        <LiquidShape
          color={LAVENDER}
          colorEnd="#C4A8FF"
          size={500}
          speed={0.5}
          preset="blob"
          seed="hero1"
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: -120 + blob2Y,
          left: -100 + blob2X,
          opacity: 0.12,
        }}
      >
        <LiquidShape
          color={TEAL}
          colorEnd="#0A7A6E"
          size={450}
          speed={0.4}
          preset="organic"
          seed="hero2"
        />
      </div>

      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 160,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: LAVENDER,
          opacity: interpolate(
            Math.sin(frame / 20),
            [-1, 1],
            [0.2, 0.6]
          ),
          transform: `scale(${1 + Math.sin(frame / 25) * 0.3})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 180,
          right: 220,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: TEAL,
          opacity: interpolate(
            Math.sin(frame / 18 + 1),
            [-1, 1],
            [0.15, 0.5]
          ),
          transform: `scale(${1 + Math.cos(frame / 22) * 0.3})`,
        }}
      />

      {/* Main content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale * 0.9 + 0.1})`,
          }}
        >
          <Img
            src={LOGO_URL}
            style={{
              width: 280,
              height: "auto",
            }}
          />
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 40,
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
          }}
        >
          <TextAnimation
            startFrom={18}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "words" });
              tl.from(split.words, {
                opacity: 0,
                y: 30,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out",
              });
              return tl;
            }}
            style={{
              fontFamily: garamond,
              fontSize: 62,
              fontWeight: 500,
              color: TEAL,
              letterSpacing: "-0.02em",
              textAlign: "center",
              lineHeight: 1.2,
              textWrap: "balance",
            }}
          >
            Don't type, just speak.
          </TextAnimation>
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 20,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          <TextAnimation
            startFrom={30}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "chars" });
              tl.from(split.chars, {
                opacity: 0,
                filter: "blur(6px)",
                duration: 0.4,
                stagger: 0.015,
                ease: "power2.out",
              });
              return tl;
            }}
            style={{
              fontFamily: figtree,
              fontSize: 24,
              fontWeight: 400,
              color: "#555",
              textAlign: "center",
              maxWidth: 600,
              lineHeight: 1.5,
              textWrap: "balance",
            }}
          >
            The smartest way to write with your voice
          </TextAnimation>
        </div>

        {/* Voice wave indicator */}
        <div
          style={{
            marginTop: 48,
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: interpolate(frame, [40, 55], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {/* Mic icon */}
          <div
            style={{
              transform: `scale(${micPulse})`,
            }}
          >
            <Img
              src="https://api.iconify.design/heroicons/microphone-solid.svg?color=%23034F46&width=32"
              style={{ width: 32, height: 32 }}
            />
          </div>

          {/* Sound bars */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              height: 32,
            }}
          >
            {bars.map((bar, i) => (
              <div
                key={i}
                style={{
                  width: 4,
                  height: bar.height,
                  borderRadius: 2,
                  backgroundColor: TEAL,
                  opacity: bar.opacity * 0.7,
                  transform: `scaleY(${bar.opacity})`,
                }}
              />
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
