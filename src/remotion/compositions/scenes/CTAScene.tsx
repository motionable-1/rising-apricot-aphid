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

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  // CTA text
  const ctaProgress = spring({
    frame,
    fps,
    delay: 12,
    config: { damping: 14 },
  });

  // Button entrance
  const btnProgress = spring({
    frame,
    fps,
    delay: 24,
    config: { damping: 10, stiffness: 100 },
  });
  const btnScale = interpolate(btnProgress, [0, 1], [0.8, 1]);

  // URL text
  const urlProgress = spring({
    frame,
    fps,
    delay: 35,
    config: { damping: 16 },
  });

  // Ambient blobs
  const blob1X = Math.sin(frame / 40) * 20;
  const blob1Y = Math.cos(frame / 50) * 15;
  const blob2X = Math.cos(frame / 35) * 18;
  const blob2Y = Math.sin(frame / 45) * 22;

  // Sparkle particles
  const sparkles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const dist = 180 + Math.sin(frame / 20 + i) * 30;
    const x = Math.cos(angle + frame / 60) * dist;
    const y = Math.sin(angle + frame / 60) * dist;
    const opacity = 0.15 + Math.sin(frame / 15 + i * 2) * 0.15;
    const size = 4 + Math.sin(frame / 10 + i) * 2;
    return { x, y, opacity, size };
  });

  // Button pulse
  const btnPulse = 1 + Math.sin(frame / 15) * 0.02;

  return (
    <AbsoluteFill>
      {/* Background blobs */}
      <div
        style={{
          position: "absolute",
          top: -80 + blob1Y,
          right: -60 + blob1X,
          opacity: 0.1,
        }}
      >
        <LiquidShape
          color={LAVENDER}
          colorEnd="#D4B5FF"
          size={400}
          speed={0.4}
          preset="blob"
          seed="cta1"
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: -100 + blob2Y,
          left: -80 + blob2X,
          opacity: 0.08,
        }}
      >
        <LiquidShape
          color={TEAL}
          colorEnd="#0A8A7E"
          size={380}
          speed={0.3}
          preset="organic"
          seed="cta2"
        />
      </div>

      {/* Sparkles */}
      {sparkles.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            backgroundColor: i % 2 === 0 ? LAVENDER : TEAL,
            opacity: s.opacity,
            transform: `translate(${s.x}px, ${s.y}px)`,
          }}
        />
      ))}

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
            opacity: logoProgress,
            transform: `scale(${interpolate(logoProgress, [0, 1], [0.8, 1])}) translateY(${interpolate(logoProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          <Img
            src={LOGO_URL}
            style={{
              width: 220,
              height: "auto",
            }}
          />
        </div>

        {/* CTA Headline */}
        <div
          style={{
            marginTop: 36,
            opacity: ctaProgress,
            transform: `translateY(${interpolate(ctaProgress, [0, 1], [30, 0])}px)`,
          }}
        >
          <TextAnimation
            startFrom={12}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "words" });
              tl.from(split.words, {
                opacity: 0,
                y: 30,
                rotationX: -15,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out",
              });
              return tl;
            }}
            style={{
              fontFamily: garamond,
              fontSize: 54,
              fontWeight: 600,
              color: TEAL,
              letterSpacing: "-0.02em",
              textAlign: "center",
              lineHeight: 1.2,
              textWrap: "balance",
            }}
          >
            Start speaking. Stop typing.
          </TextAnimation>
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 16,
            opacity: ctaProgress,
            transform: `translateY(${interpolate(ctaProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          <TextAnimation
            startFrom={20}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "chars" });
              tl.from(split.chars, {
                opacity: 0,
                filter: "blur(4px)",
                duration: 0.3,
                stagger: 0.015,
                ease: "power2.out",
              });
              return tl;
            }}
            style={{
              fontFamily: figtree,
              fontSize: 22,
              fontWeight: 400,
              color: "#777",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Download for free on all platforms
          </TextAnimation>
        </div>

        {/* CTA Button */}
        <div
          style={{
            marginTop: 40,
            opacity: btnProgress,
            transform: `scale(${btnScale * btnPulse})`,
          }}
        >
          <div
            style={{
              backgroundColor: LAVENDER,
              borderRadius: 16,
              padding: "18px 48px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: `2px solid ${TEAL}20`,
              boxShadow: `0 4px 30px ${LAVENDER}60`,
            }}
          >
            <Img
              src="https://api.iconify.design/heroicons/arrow-down-tray-solid.svg?color=%23034F46&width=22"
              style={{ width: 22, height: 22 }}
            />
            <span
              style={{
                fontFamily: figtree,
                fontSize: 18,
                fontWeight: 700,
                color: TEAL,
              }}
            >
              Download for Free
            </span>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: 24,
            opacity: urlProgress,
            transform: `translateY(${interpolate(urlProgress, [0, 1], [10, 0])}px)`,
          }}
        >
          <TextAnimation
            startFrom={35}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "chars" });
              tl.from(split.chars, {
                opacity: 0,
                y: 8,
                duration: 0.3,
                stagger: 0.02,
                ease: "power2.out",
              });
              return tl;
            }}
            style={{
              fontFamily: figtree,
              fontSize: 18,
              fontWeight: 500,
              color: TEAL,
              letterSpacing: "0.02em",
            }}
          >
            wisprflow.ai
          </TextAnimation>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
