import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
  Img,
  staticFile,
} from "remotion";

export const LogoAnimation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === TIMELINE ===
  // Phase 1 (0-0.5s): Image 1 (squares) grows onto screen
  // Phase 2 (0.5s-1.2s): Transition from image 1 to image 2 (doors open)
  // Phase 3 (1.2s-2.2s): Image 3 slides in from left (text appears)
  // Phase 4 (2.2s-end): Hold on final logo

  // === PHASE 1: Squares grow in ===
  const growProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const initialScale = interpolate(growProgress, [0, 1], [0, 1]);

  // === PHASE 2: Door opening (crossfade image 1 to image 2) ===
  const doorOpenDelay = Math.floor(0.5 * fps);
  const doorOpenProgress = spring({
    frame: frame - doorOpenDelay,
    fps,
    config: { damping: 14, stiffness: 50 },
  });

  const image1Opacity = interpolate(doorOpenProgress, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const image2Opacity = interpolate(doorOpenProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === PHASE 3: Text slides in (image 3 slides over image 2) ===
  const textDelay = Math.floor(1.2 * fps);
  const textProgress = spring({
    frame: frame - textDelay,
    fps,
    config: { damping: 18, stiffness: 70 },
  });

  // Image 3 slides in from left
  const image3TranslateX = interpolate(textProgress, [0, 1], [-400, 0]);
  const image3Opacity = interpolate(textProgress, [0, 0.1, 1], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Image 2 fades out as image 3 comes in
  const image2FadeOut = interpolate(textProgress, [0.3, 0.7], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoWidth = 500;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Container for all logo states */}
      <div
        style={{
          position: "relative",
          width: logoWidth,
          height: logoWidth * 0.35,
          transform: `scale(${initialScale})`,
        }}
      >
        {/* Image 1: Solid squares (closed doors) */}
        <Img
          src={staticFile("anecdotal-logo-horizontal-1.png")}
          style={{
            position: "absolute",
            width: logoWidth,
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: image1Opacity,
          }}
        />

        {/* Image 2: Quotation marks (doors opened) */}
        <Img
          src={staticFile("anecdotal-logo-horizontal-2.png")}
          style={{
            position: "absolute",
            width: logoWidth,
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: image2Opacity * image2FadeOut,
          }}
        />

        {/* Image 3: Full logo (slides in from left) */}
        <Img
          src={staticFile("anecdotal-logo-horizontal-3.png")}
          style={{
            position: "absolute",
            width: logoWidth,
            left: 0,
            top: "50%",
            transform: `translateY(-50%) translateX(${image3TranslateX}px)`,
            opacity: image3Opacity,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
