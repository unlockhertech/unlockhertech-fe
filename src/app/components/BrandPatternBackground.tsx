import type { ReactNode } from "react";
import { BERRY, BLUE, PINK, ORANGE, GREEN } from "../data";

export interface BrandPatternProps {
  className?: string;
  children?: ReactNode;
  variant?: "brand" | "light" | "coral" | "minimal" | "watermark";
  opacity?: number;
}

/**
 * High-performance vector brand pattern background matching Unlock Her Tech's
 * geometric visual language and 5-colour brand identity (Berry, Blue, Pink, Yellow, Green).
 */
export function BrandPatternBackground({
  className = "",
  children,
  variant = "brand",
}: Readonly<BrandPatternProps>) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <BrandPatternOverlay variant={variant} />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

/**
 * Absolute overlay vector pattern designed to sit behind content in any container.
 */
export function BrandPatternOverlay({
  className = "",
  variant = "brand",
}: Readonly<{ className?: string; variant?: "brand" | "light" | "coral" | "minimal" | "watermark" }>) {
  if (variant === "watermark") {
    return (
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 675"
        aria-hidden="true"
      >
        {/* Top-Left: Delicate Thin Pink Ring */}
        <circle
          cx="140"
          cy="140"
          r="160"
          fill="none"
          stroke={PINK}
          strokeWidth="3"
          strokeOpacity="0.25"
        />

        {/* Top-Left: Delicate Blue Accent Ring */}
        <circle
          cx="190"
          cy="90"
          r="100"
          fill="none"
          stroke={BLUE}
          strokeWidth="3"
          strokeOpacity="0.2"
        />

        {/* Diagonal Capsule Pill 1 (Top-Right) */}
        <rect
          x="750"
          y="30"
          width="320"
          height="48"
          rx="24"
          fill={PINK}
          fillOpacity="0.12"
          transform="rotate(-40 910 54)"
        />

        {/* Diagonal Orange Accent Pill */}
        <rect
          x="1020"
          y="180"
          width="180"
          height="36"
          rx="18"
          fill={ORANGE}
          fillOpacity="0.08"
          transform="rotate(-40 1110 198)"
        />

        {/* Bottom-Right: Soft Blue Torus */}
        <circle
          cx="820"
          cy="580"
          r="200"
          fill="none"
          stroke={BLUE}
          strokeWidth="50"
          strokeOpacity="0.08"
        />

        {/* Bottom-Right: Berry Accent Ring */}
        <circle
          cx="960"
          cy="580"
          r="140"
          fill="none"
          stroke={BERRY}
          strokeWidth="3"
          strokeOpacity="0.15"
        />

        {/* Green Dot Flourish */}
        <circle
          cx="1080"
          cy="340"
          r="10"
          fill={GREEN}
          fillOpacity="0.25"
        />
      </svg>
    );
  }

  if (variant === "light") {
    return (
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 675"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="brandLightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdf0f7" />
            <stop offset="50%" stopColor="#fef6fa" />
            <stop offset="100%" stopColor="#f0f6fd" />
          </linearGradient>
        </defs>

        {/* Base Background Fill */}
        <rect width="1200" height="675" fill="url(#brandLightGradient)" />

        {/* Top-Left: Large Thin Pink Ring */}
        <circle
          cx="170"
          cy="180"
          r="190"
          fill="none"
          stroke={PINK}
          strokeWidth="4"
          strokeOpacity="0.4"
        />

        {/* Top-Left: Thin Blue Ring */}
        <circle
          cx="220"
          cy="120"
          r="130"
          fill="none"
          stroke={BLUE}
          strokeWidth="4"
          strokeOpacity="0.5"
        />

        {/* Diagonal Capsule Pill 1 (Top-Centre) */}
        <rect
          x="620"
          y="40"
          width="360"
          height="54"
          rx="27"
          fill={PINK}
          fillOpacity="0.2"
          transform="rotate(-40 800 67)"
        />

        {/* Diagonal Capsule Pill 2 (Lower-Right) */}
        <rect
          x="1050"
          y="390"
          width="260"
          height="54"
          rx="27"
          fill={ORANGE}
          fillOpacity="0.15"
          transform="rotate(-40 1180 417)"
        />

        {/* Bottom-Right: Thick Blue Torus / Doughnut Ring */}
        <circle
          cx="720"
          cy="580"
          r="240"
          fill="none"
          stroke={BLUE}
          strokeWidth="70"
          strokeOpacity="0.2"
        />

        {/* Bottom-Right: Overlapping Berry Ring */}
        <circle
          cx="890"
          cy="590"
          r="170"
          fill="none"
          stroke={BERRY}
          strokeWidth="4"
          strokeOpacity="0.25"
        />
      </svg>
    );
  }

  // Default "brand" / "coral" variant with rich authentic brand colours (Berry #b42970 base)
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1200 675"
      aria-hidden="true"
    >
      <defs>
        {/* Harmonised Brand Gradient (Berry #b42970 → Deep Berry #8a1f55) */}
        <linearGradient id="brandRichBerryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c2327c" />
          <stop offset="45%" stopColor="#b42970" />
          <stop offset="100%" stopColor="#8a1f55" />
        </linearGradient>

        {/* Subtle glow filter for geometric accents */}
        <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* Base Background Fill */}
      <rect width="1200" height="675" fill="url(#brandRichBerryGradient)" />

      {/* Top-Left: Large Thin Light Pink / White Ring */}
      <circle
        cx="170"
        cy="180"
        r="190"
        fill="none"
        stroke={PINK}
        strokeWidth="5"
        strokeOpacity="0.5"
      />

      {/* Top-Left: Thin Electric Blue Ring */}
      <circle
        cx="220"
        cy="120"
        r="130"
        fill="none"
        stroke={BLUE}
        strokeWidth="6"
        strokeOpacity="0.85"
      />

      {/* Diagonal Capsule Pill 1 (Top-Center to Upper-Right) */}
      <rect
        x="620"
        y="40"
        width="360"
        height="60"
        rx="30"
        fill="rgba(255, 255, 255, 0.28)"
        transform="rotate(-40 800 70)"
      />

      {/* Diagonal Capsule Pill 2 (Lower-Right) */}
      <rect
        x="1050"
        y="390"
        width="260"
        height="60"
        rx="30"
        fill={PINK}
        fillOpacity="0.3"
        transform="rotate(-40 1180 420)"
      />

      {/* Small Accent Pill (Top-Right) */}
      <rect
        x="980"
        y="110"
        width="140"
        height="40"
        rx="20"
        fill={ORANGE}
        fillOpacity="0.35"
        transform="rotate(-40 1050 130)"
      />

      {/* Bottom-Right: Signature Electric Blue Torus / Doughnut Ring */}
      <circle
        cx="720"
        cy="580"
        r="240"
        fill="none"
        stroke={BLUE}
        strokeWidth="84"
        strokeOpacity="0.9"
        filter="url(#subtleGlow)"
      />

      {/* Bottom-Right: Overlapping Thin Pink/White Ring */}
      <circle
        cx="890"
        cy="590"
        r="170"
        fill="none"
        stroke="rgba(255, 255, 255, 0.5)"
        strokeWidth="6"
      />

      {/* Subtle Green Dot Accent */}
      <circle
        cx="1100"
        cy="260"
        r="16"
        fill={GREEN}
        fillOpacity="0.75"
      />
    </svg>
  );
}
