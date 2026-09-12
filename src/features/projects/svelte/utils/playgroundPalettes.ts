export interface PlaygroundPalette {
  label: string;
  bg: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  hoverBg: string;
}

export const PLAYGROUND_PALETTES: Record<string, PlaygroundPalette> = {
  midnight: {
    label: "Midnight",
    bg: "#1c1e2b",
    border: "#34374d",
    text: "#e4e6f1",
    muted: "#8a8da3",
    accent: "#8b7cf6",
    hoverBg: "#292c40",
  },
  ocean: {
    label: "Ocean",
    bg: "oklch(0.22 0.05 230)",
    border: "oklch(0.35 0.06 225)",
    text: "oklch(0.92 0.02 220)",
    muted: "oklch(0.65 0.03 220)",
    accent: "oklch(0.7 0.12 200)",
    hoverBg: "oklch(0.28 0.05 225)",
  },
  sunset: {
    label: "Sunset",
    bg: "oklch(0.24 0.04 40)",
    border: "oklch(0.4 0.08 45)",
    text: "oklch(0.93 0.02 60)",
    muted: "oklch(0.68 0.05 55)",
    accent: "oklch(0.74 0.17 60.21)",
    hoverBg: "oklch(0.3 0.06 45)",
  },
};
