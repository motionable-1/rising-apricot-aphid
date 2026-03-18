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

interface FeatureCardData {
  icon: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
}

const features: FeatureCardData[] = [
  {
    icon: "https://api.iconify.design/heroicons/bolt-solid.svg?color=%23034F46&width=28",
    title: "4x Faster",
    description: "Than typing. Speak naturally and watch your words appear instantly.",
    stat: "4×",
    statLabel: "faster than typing",
  },
  {
    icon: "https://api.iconify.design/heroicons/sparkles-solid.svg?color=%23034F46&width=28",
    title: "AI Auto-Edit",
    description: "Messy speech becomes polished, professional text automatically.",
    stat: "100%",
    statLabel: "hands-free editing",
  },
  {
    icon: "https://api.iconify.design/heroicons/globe-alt-solid.svg?color=%23034F46&width=28",
    title: "Works Everywhere",
    description: "Every app, every text field, every platform. No switching needed.",
    stat: "∞",
    statLabel: "apps supported",
  },
];

const FeatureCard: React.FC<{
  feature: FeatureCardData;
  index: number;
}> = ({ feature, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = 15 + index * 12;
  const entrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 14, stiffness: 80 },
  });

  const cardY = interpolate(entrance, [0, 1], [60, 0]);
  const cardOpacity = entrance;

  // Stat counter animation
  const statDelay = delay + 15;
  const statProgress = spring({
    frame,
    fps,
    delay: statDelay,
    config: { damping: 12 },
  });

  // Subtle hover float
  const floatY = Math.sin((frame + index * 20) / 25) * 3;

  return (
    <div
      style={{
        opacity: cardOpacity,
        transform: `translateY(${cardY + floatY}px)`,
        width: 320,
        backgroundColor: "white",
        borderRadius: 24,
        padding: "32px 28px",
        boxShadow: `0 4px 40px rgba(3,79,70,0.06), 0 1px 3px rgba(3,79,70,0.04)`,
        border: `1px solid ${TEAL}10`,
        display: "flex",
        flexDirection: "column" as const,
        gap: 16,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          backgroundColor: `${LAVENDER}60`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img src={feature.icon} style={{ width: 28, height: 28 }} />
      </div>

      {/* Stat */}
      <div
        style={{
          fontFamily: garamond,
          fontSize: 44,
          fontWeight: 700,
          color: TEAL,
          lineHeight: 1,
          opacity: statProgress,
          transform: `scale(${interpolate(statProgress, [0, 1], [0.8, 1])})`,
        }}
      >
        {feature.stat}
      </div>
      <div
        style={{
          fontFamily: figtree,
          fontSize: 13,
          color: "#999",
          fontWeight: 500,
          marginTop: -8,
          letterSpacing: "0.03em",
        }}
      >
        {feature.statLabel}
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: figtree,
          fontSize: 20,
          fontWeight: 700,
          color: TEAL,
          marginTop: 4,
        }}
      >
        {feature.title}
      </div>

      {/* Description */}
      <div
        style={{
          fontFamily: figtree,
          fontSize: 15,
          color: "#777",
          lineHeight: 1.5,
          fontWeight: 400,
        }}
      >
        {feature.description}
      </div>
    </div>
  );
};

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 14 },
  });

  return (
    <AbsoluteFill>
      {/* Single centered flex container for title + cards */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 60,
          paddingRight: 60,
          gap: 0,
        }}
      >
        {/* Title */}
        <div
          style={{
            textAlign: "center",
            opacity: titleProgress,
            transform: `translateY(${interpolate(titleProgress, [0, 1], [20, 0])}px)`,
            marginBottom: 48,
          }}
        >
          <TextAnimation
            startFrom={0}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "words" });
              tl.from(split.words, {
                opacity: 0,
                y: 25,
                duration: 0.5,
                stagger: 0.08,
                ease: "power3.out",
              });
              return tl;
            }}
            style={{
              fontFamily: garamond,
              fontSize: 48,
              fontWeight: 600,
              color: TEAL,
              letterSpacing: "-0.01em",
            }}
          >
            Why Flow Changes Everything
          </TextAnimation>
        </div>

        {/* Feature cards - in a row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
          }}
        >
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
