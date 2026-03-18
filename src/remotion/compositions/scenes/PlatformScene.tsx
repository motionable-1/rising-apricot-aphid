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

interface PlatformItem {
  name: string;
  icon: string;
  color: string;
}

const platforms: PlatformItem[] = [
  {
    name: "Mac",
    icon: "https://api.iconify.design/mdi/apple.svg?color=%23034F46&width=40",
    color: TEAL,
  },
  {
    name: "Windows",
    icon: "https://api.iconify.design/mdi/microsoft-windows.svg?color=%23034F46&width=40",
    color: TEAL,
  },
  {
    name: "iPhone",
    icon: "https://api.iconify.design/mdi/cellphone.svg?color=%23034F46&width=40",
    color: TEAL,
  },
  {
    name: "Android",
    icon: "https://api.iconify.design/mdi/android.svg?color=%23034F46&width=40",
    color: TEAL,
  },
];

export const PlatformScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 14 },
  });

  // Central orb pulse
  const orbScale = 1 + Math.sin(frame / 20) * 0.03;
  const orbOpacity = spring({
    frame,
    fps,
    delay: 8,
    config: { damping: 12 },
  });

  // Connection lines
  const lineProgress = spring({
    frame,
    fps,
    delay: 15,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  return (
    <AbsoluteFill>
      {/* Subtle background blob */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.06,
        }}
      >
        <LiquidShape
          color={LAVENDER}
          colorEnd={TEAL}
          size={700}
          speed={0.3}
          preset="blob"
          seed="platform"
        />
      </div>

      {/* Section label */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [20, 0])}px)`,
        }}
      >
        <TextAnimation
          startFrom={0}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            tl.from(split.chars, {
              opacity: 0,
              y: 12,
              duration: 0.4,
              stagger: 0.02,
              ease: "power2.out",
            });
            return tl;
          }}
          style={{
            fontFamily: figtree,
            fontSize: 16,
            fontWeight: 600,
            color: TEAL,
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
          }}
        >
          Cross-Platform
        </TextAnimation>
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [20, 0])}px)`,
        }}
      >
        <TextAnimation
          startFrom={4}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "words" });
            tl.from(split.words, {
              opacity: 0,
              y: 25,
              duration: 0.5,
              stagger: 0.1,
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
          Your voice, on every device
        </TextAnimation>
      </div>

      {/* Central hub - Flow logo */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${orbScale})`,
          opacity: orbOpacity,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 28,
            backgroundColor: TEAL,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 40px ${TEAL}40, 0 0 80px ${TEAL}15`,
          }}
        >
          <Img
            src="https://api.iconify.design/heroicons/microphone-solid.svg?color=%23FFFFEB&width=44"
            style={{ width: 44, height: 44 }}
          />
        </div>
      </div>

      {/* Platform items arranged in a circle */}
      {platforms.map((platform, i) => {
        const angle = (i / platforms.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 220;
        const cx = Math.cos(angle) * radius;
        const cy = Math.sin(angle) * radius;

        const delay = 20 + i * 8;
        const entrance = spring({
          frame,
          fps,
          delay,
          config: { damping: 12, stiffness: 80 },
        });

        const floatX = Math.sin((frame + i * 30) / 30) * 4;
        const floatY = Math.cos((frame + i * 20) / 25) * 4;

        // Line from center to platform
        const lineDist = radius - 50;
        const lineEndX = Math.cos(angle) * lineDist * lineProgress;
        const lineEndY = Math.sin(angle) * lineDist * lineProgress;

        return (
          <React.Fragment key={i}>
            {/* Connection line */}
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              <line
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${lineEndX}px)`}
                y2={`calc(50% + ${lineEndY}px)`}
                stroke={TEAL}
                strokeWidth={2}
                strokeDasharray="6 4"
                opacity={lineProgress * 0.25}
              />
            </svg>

            {/* Platform card */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(calc(-50% + ${cx + floatX}px), calc(-50% + ${cy + floatY}px)) scale(${entrance})`,
                opacity: entrance,
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 24,
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column" as const,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  boxShadow: `0 4px 30px rgba(3,79,70,0.08)`,
                  border: `1px solid ${TEAL}10`,
                }}
              >
                <Img
                  src={platform.icon}
                  style={{ width: 40, height: 40 }}
                />
                <span
                  style={{
                    fontFamily: figtree,
                    fontSize: 14,
                    fontWeight: 600,
                    color: TEAL,
                  }}
                >
                  {platform.name}
                </span>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <TextAnimation
          startFrom={50}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "words" });
            tl.from(split.words, {
              opacity: 0,
              y: 15,
              duration: 0.4,
              stagger: 0.06,
              ease: "power2.out",
            });
            return tl;
          }}
          style={{
            fontFamily: figtree,
            fontSize: 20,
            fontWeight: 400,
            color: "#777",
            lineHeight: 1.5,
          }}
        >
          Mac • Windows • iPhone • Android — one voice, everywhere
        </TextAnimation>
      </div>
    </AbsoluteFill>
  );
};
