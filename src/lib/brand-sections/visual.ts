import { z } from "zod";

export type VisualColors = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
};

export type VisualTypography = {
  licensedTarget?: string;
  sans: string;
  display: string;
  mono?: string;
};

export type VisualRadii = {
  sm: string;
  md: string;
  lg: string;
  full: string;
};

export type VisualMotion = {
  durations: string;
  easings: string;
};

export type VisualData = {
  colors: VisualColors;
  extendedRamps: string;
  typography: VisualTypography;
  radii: VisualRadii;
  motion: VisualMotion;
};

export const COLOR_KEYS: (keyof VisualColors)[] = [
  "primary",
  "primaryLight",
  "primaryDark",
  "accent",
  "surface",
  "surfaceAlt",
  "text",
  "textMuted",
  "border",
];

const hex = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "Must be a hex color like #RRGGBB")
  .or(z.literal("TODO"))
  .or(z.literal(""));

export const visualSchema = z.object({
  colors: z.object({
    primary: hex,
    primaryLight: hex,
    primaryDark: hex,
    accent: hex,
    surface: hex,
    surfaceAlt: hex,
    text: hex,
    textMuted: hex,
    border: hex,
  }),
  extendedRamps: z.string(),
  typography: z.object({
    licensedTarget: z.string().optional(),
    sans: z.string(),
    display: z.string(),
    mono: z.string().optional(),
  }),
  radii: z.object({
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    full: z.string(),
  }),
  motion: z.object({
    durations: z.string(),
    easings: z.string(),
  }),
});

export const EMPTY_VISUAL: VisualData = {
  colors: COLOR_KEYS.reduce(
    (acc, k) => {
      acc[k] = "TODO";
      return acc;
    },
    {} as VisualColors,
  ),
  extendedRamps: "TODO",
  typography: { licensedTarget: "", sans: "TODO", display: "TODO", mono: "" },
  radii: { sm: "TODO", md: "TODO", lg: "TODO", full: "TODO" },
  motion: { durations: "TODO", easings: "TODO" },
};

/**
 * Parse the `## 9. Visual system` Markdown block into a structured object.
 * Tolerates missing subsections — unfilled fields become "TODO" or "".
 */
export function parseVisual(markdown: string): VisualData {
  const data: VisualData = {
    colors: { ...EMPTY_VISUAL.colors },
    extendedRamps: "",
    typography: { sans: "", display: "" },
    radii: { sm: "", md: "", lg: "", full: "" },
    motion: { durations: "", easings: "" },
  };

  // Colors table: rows `| primary | #XXXXXX | role |`
  const colorRowRe = /^\|\s*([A-Za-z]+)\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|$/gm;
  let m: RegExpExecArray | null;
  while ((m = colorRowRe.exec(markdown)) !== null) {
    const key = m[1] as keyof VisualColors;
    if ((COLOR_KEYS as string[]).includes(key)) {
      data.colors[key] = m[2].trim();
    }
  }

  // Extended ramps: section from `### Extended ramps` to the next `###` or end.
  const ramps = markdown.match(/###\s+Extended ramps[^\n]*\n([\s\S]*?)(?=\n###\s+|\n##\s+|$)/);
  if (ramps) {
    // Strip the leading descriptive italic line if present.
    data.extendedRamps = ramps[1]
      .replace(/^\s*_[^_]*_\s*\n/, "")
      .trim();
  }

  // Typography
  const licensed = markdown.match(/\*\*Licensed target fonts\.\*\*\s*([^\n]+)/);
  if (licensed) data.typography.licensedTarget = licensed[1].trim();
  const shipping = markdown.match(
    /\*\*Shipping fonts\.\*\*\s*sans:\s*([^,]+?),\s*display:\s*([^,]+?)(?:,\s*mono:\s*([^\n]+))?$/m,
  );
  if (shipping) {
    data.typography.sans = shipping[1].trim();
    data.typography.display = shipping[2].trim();
    if (shipping[3]) data.typography.mono = shipping[3].trim();
  }

  // Radii
  const radiiSection = markdown.match(/###\s+Radii[^\n]*\n([\s\S]*?)(?=\n###\s+|\n##\s+|$)/);
  if (radiiSection) {
    const body = radiiSection[1];
    const pick = (key: keyof VisualRadii) => {
      const r = body.match(new RegExp(`\\*\\*${key}\\.\\*\\*\\s*([^\\n]+)`));
      if (r) data.radii[key] = r[1].trim();
    };
    pick("sm");
    pick("md");
    pick("lg");
    pick("full");
  }

  // Motion
  const durations = markdown.match(/\*\*Durations\.\*\*\s*([^\n]+)/);
  if (durations) data.motion.durations = durations[1].trim();
  const easings = markdown.match(/\*\*Easings\.\*\*\s*([^\n]+)/);
  if (easings) data.motion.easings = easings[1].trim();

  return data;
}

export function renderVisual(data: VisualData): string {
  const lines: string[] = [];
  lines.push("## 9. Visual system");
  lines.push("");
  lines.push("### Colors (mapped to `site.config.ts`)");
  lines.push("");
  lines.push("| Token | Hex | Role |");
  lines.push("|---|---|---|");
  for (const k of COLOR_KEYS) {
    lines.push(`| ${k} | ${data.colors[k] || "TODO"} | TODO |`);
  }
  lines.push("");
  lines.push("### Extended ramps (project-local, optional)");
  lines.push("");
  lines.push("_Additional color tokens not part of the core SiteConfig. Lives in project-local theme.css._");
  lines.push("");
  lines.push(data.extendedRamps.trim() || "TODO");
  lines.push("");
  lines.push("### Typography");
  lines.push("");
  lines.push(`- **Licensed target fonts.** ${data.typography.licensedTarget?.trim() || "TODO"}`);
  const mono = data.typography.mono?.trim();
  const monoPart = mono ? `, mono: ${mono}` : "";
  lines.push(
    `- **Shipping fonts.** sans: ${data.typography.sans || "TODO"}, display: ${data.typography.display || "TODO"}${monoPart}`,
  );
  lines.push("");
  lines.push("### Radii");
  lines.push("");
  lines.push(`- **sm.** ${data.radii.sm || "TODO"}`);
  lines.push(`- **md.** ${data.radii.md || "TODO"}`);
  lines.push(`- **lg.** ${data.radii.lg || "TODO"}`);
  lines.push(`- **full.** ${data.radii.full || "TODO"}`);
  lines.push("");
  lines.push("### Motion");
  lines.push("");
  lines.push(`- **Durations.** ${data.motion.durations || "TODO"}`);
  lines.push(`- **Easings.** ${data.motion.easings || "TODO"}`);
  return lines.join("\n");
}
