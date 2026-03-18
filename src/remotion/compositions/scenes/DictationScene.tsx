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
import { TextAnimation } from "../../library/components/text/TextAnimation";

const { fontFamily: figtree } = loadFigtree("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const TEAL = "#034F46";

const SPOKEN_TEXT =
  "hey so I was thinking we could maybe move the meeting to like Thursday or Friday that would work better for everyone I think";
const POLISHED_TEXT =
  "I'd like to suggest moving the meeting to Thursday or Friday — that would work better for everyone.";

export const DictationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene label entrance
  const labelProgress = spring({
    frame,
    fps,
    config: { damping: 14 },
  });

  // Chat bubble with raw text
  const rawBubbleProgress = spring({
    frame,
    fps,
    delay: 12,
    config: { damping: 12, stiffness: 80 },
  });
  const rawBubbleScale = interpolate(rawBubbleProgress, [0, 1], [0.85, 1]);
  const rawBubbleOpacity = rawBubbleProgress;

  // Typewriter effect for raw text
  const typeStart = 18;
  const charsPerFrame = 1.2;
  const rawCharsToShow = Math.min(
    SPOKEN_TEXT.length,
    Math.max(0, Math.floor((frame - typeStart) * charsPerFrame))
  );
  const rawVisible = SPOKEN_TEXT.slice(0, rawCharsToShow);
  const rawCursorVisible =
    frame >= typeStart && rawCharsToShow < SPOKEN_TEXT.length;

  // Transformation sparkle moment
  const transformFrame = 85;
  const sparkleProgress = spring({
    frame,
    fps,
    delay: transformFrame,
    config: { damping: 10, stiffness: 120 },
  });

  // Polished text bubble
  const polishedProgress = spring({
    frame,
    fps,
    delay: transformFrame + 10,
    config: { damping: 12, stiffness: 80 },
  });
  const polishedScale = interpolate(polishedProgress, [0, 1], [0.9, 1]);

  // Arrow/transform icon
  const arrowOpacity = interpolate(
    frame,
    [transformFrame, transformFrame + 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const arrowRotation = interpolate(sparkleProgress, [0, 1], [-90, 0]);

  // Floating particles around transform
  const particles = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    const delay = transformFrame + i * 2;
    const p = spring({ frame, fps, delay, config: { damping: 8 } });
    const dist = interpolate(p, [0, 1], [0, 40 + i * 8]);
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      opacity: interpolate(p, [0, 0.3, 1], [0, 1, 0]),
      scale: interpolate(p, [0, 0.5, 1], [0, 1.2, 0.4]),
    };
  });

  // Soundwave bars — high contrast teal with dynamic heights
  const isTyping = frame >= typeStart && rawCharsToShow < SPOKEN_TEXT.length;
  const bars = Array.from({ length: 32 }, (_, i) => {
    const phase = (frame / fps) * 4 + i * 0.35;
    const height = isTyping
      ? 6 +
        Math.abs(Math.sin(phase)) * 18 +
        Math.abs(Math.cos(phase * 1.7)) * 8
      : 4;
    // Vary opacity from center outward for a flowing feel
    const centerDist = Math.abs(i - 16) / 16;
    const barOpacity = isTyping
      ? 0.35 + (1 - centerDist) * 0.55
      : 0.2;
    return { height, opacity: barOpacity };
  });

  // Polished section height animation for smooth expand
  const expandProgress = spring({
    frame,
    fps,
    delay: transformFrame,
    config: { damping: 14, stiffness: 60 },
  });

  // The polished section adds ~250px of content. Shift up by half to keep centered.
  const centerShift = interpolate(expandProgress, [0, 1], [0, -125]);

  return (
    <AbsoluteFill>
      {/* Centered container with dynamic vertical offset */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 120,
          right: 120,
          transform: `translateY(calc(-50% + ${centerShift}px))`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Section label */}
        <div
          style={{
            textAlign: "center",
            opacity: labelProgress,
            transform: `translateY(${interpolate(labelProgress, [0, 1], [20, 0])}px)`,
            marginBottom: 14,
          }}
        >
          <TextAnimation
            startFrom={0}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "chars" });
              tl.from(split.chars, {
                opacity: 0,
                y: 15,
                duration: 0.4,
                stagger: 0.03,
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
            Seamless Voice Dictation
          </TextAnimation>
        </div>

        {/* Voice waveform - high contrast teal bars */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            height: 44,
            marginBottom: 28,
            opacity: interpolate(frame, [12, 22], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {bars.map((bar, i) => (
            <div
              key={i}
              style={{
                width: 3.5,
                height: bar.height,
                borderRadius: 2,
                backgroundColor: TEAL,
                opacity: bar.opacity,
              }}
            />
          ))}
        </div>

        {/* Raw speech bubble */}
        <div
          style={{
            opacity: rawBubbleOpacity,
            transform: `scale(${rawBubbleScale})`,
            width: "100%",
            maxWidth: 800,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: `${TEAL}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 4,
              }}
            >
              <Img
                src="https://api.iconify.design/heroicons/microphone-solid.svg?color=%23034F46&width=22"
                style={{ width: 22, height: 22 }}
              />
            </div>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: 20,
                padding: "20px 28px",
                boxShadow: "0 2px 20px rgba(3,79,70,0.08)",
                border: `1px solid ${TEAL}15`,
                flex: 1,
              }}
            >
              <div
                style={{
                  fontFamily: figtree,
                  fontSize: 19,
                  color: "#666",
                  lineHeight: 1.6,
                  fontStyle: "italic",
                  minHeight: 50,
                }}
              >
                &ldquo;{rawVisible}
                {rawCursorVisible && (
                  <span
                    style={{
                      color: TEAL,
                      opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0.3,
                    }}
                  >
                    |
                  </span>
                )}
                {rawCharsToShow >= SPOKEN_TEXT.length ? "\u201D" : ""}
              </div>
              <div
                style={{
                  fontFamily: figtree,
                  fontSize: 12,
                  color: "#aaa",
                  marginTop: 8,
                  opacity: rawCharsToShow > 0 ? 0.6 : 0,
                }}
              >
                Speaking...
              </div>
            </div>
          </div>
        </div>

        {/* Transform sparkle + polished bubble: animated expand */}
        <div
          style={{
            overflow: "hidden",
            // Animate max-height smoothly using spring
            maxHeight: interpolate(expandProgress, [0, 1], [0, 350]),
            width: "100%",
            maxWidth: 800,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}
        >
          {/* Transform icon */}
          <div
            style={{
              opacity: arrowOpacity,
              transform: `rotate(${arrowRotation}deg) scale(${sparkleProgress})`,
              position: "relative",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <Img
              src="https://api.iconify.design/heroicons/sparkles-solid.svg?color=%23034F46&width=36"
              style={{ width: 36, height: 36 }}
            />
            {particles.map((p, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: i % 2 === 0 ? "#F0D7FF" : TEAL,
                  opacity: p.opacity,
                  transform: `translate(${p.x - 3}px, ${p.y - 3}px) scale(${p.scale})`,
                }}
              />
            ))}
          </div>

          {/* Polished text bubble */}
          <div
            style={{
              opacity: polishedProgress,
              transform: `scale(${polishedScale})`,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: TEAL,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 4,
                }}
              >
                <Img
                  src="https://api.iconify.design/heroicons/sparkles-solid.svg?color=%23FFFFEB&width=22"
                  style={{ width: 22, height: 22 }}
                />
              </div>
              <div
                style={{
                  backgroundColor: TEAL,
                  borderRadius: 20,
                  padding: "20px 28px",
                  boxShadow: "0 4px 30px rgba(3,79,70,0.2)",
                  flex: 1,
                }}
              >
                {frame >= transformFrame + 10 ? (
                  <TextAnimation
                    startFrom={transformFrame + 10}
                    createTimeline={({ textRef, tl, SplitText }) => {
                      const split = new SplitText(textRef.current, {
                        type: "words",
                      });
                      tl.from(split.words, {
                        opacity: 0,
                        y: 10,
                        duration: 0.3,
                        stagger: 0.04,
                        ease: "power2.out",
                      });
                      return tl;
                    }}
                    style={{
                      fontFamily: figtree,
                      fontSize: 19,
                      color: "#FFFFFF",
                      lineHeight: 1.6,
                      fontWeight: 500,
                    }}
                  >
                    {POLISHED_TEXT}
                  </TextAnimation>
                ) : (
                  <div style={{ minHeight: 50 }} />
                )}
                <div
                  style={{
                    fontFamily: figtree,
                    fontSize: 12,
                    color: "rgba(255,255,255,0.55)",
                    marginTop: 8,
                    opacity: polishedProgress,
                  }}
                >
                  AI-polished
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
