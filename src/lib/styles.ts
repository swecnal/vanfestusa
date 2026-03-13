import type { CSSProperties } from "react";

// ─── Button Style ───

export interface ButtonStyle {
  id: string;
  name: string;
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  textColor: string;
  bgColor: string;
  hoverBgColor: string;
  borderWidth: string;
  borderColor: string;
  borderRadius: string;
  paddingX: string;
  paddingY: string;
  shadow: string;
  hoverShadow: string;
  textTransform: string;
}

// ─── Link Style ───

export interface LinkStyle {
  id: string;
  name: string;
  color: string;
  hoverColor: string;
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  textDecoration: string;
  hoverTextDecoration: string;
  textTransform: string;
  letterSpacing: string;
}

// ─── Heading Style ───

export interface HeadingStyle {
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  color: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform: string;
  marginBottom: string;
}

export type HeadingStyles = {
  h1: HeadingStyle;
  h2: HeadingStyle;
  h3: HeadingStyle;
};

export const DEFAULT_HEADING_STYLES: HeadingStyles = {
  h1: {
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
    fontWeight: "900",
    fontFamily: "Gothic A1",
    color: "#1e293b",
    lineHeight: "1.1",
    letterSpacing: "-0.02em",
    textTransform: "none",
    marginBottom: "16px",
  },
  h2: {
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)",
    fontWeight: "900",
    fontFamily: "Gothic A1",
    color: "#1e293b",
    lineHeight: "1.2",
    letterSpacing: "-0.01em",
    textTransform: "none",
    marginBottom: "12px",
  },
  h3: {
    fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
    fontWeight: "700",
    fontFamily: "Gothic A1",
    color: "#1e293b",
    lineHeight: "1.3",
    letterSpacing: "normal",
    textTransform: "none",
    marginBottom: "8px",
  },
};

// ─── Site Styles (fetched from global_settings) ───

export interface SiteStyles {
  button_styles: {
    main: ButtonStyle[];
    secondary: ButtonStyle[];
  };
  link_styles: {
    primary: LinkStyle[];
    secondary: LinkStyle[];
  };
  heading_styles: HeadingStyles;
}

export const EMPTY_SITE_STYLES: SiteStyles = {
  button_styles: { main: [], secondary: [] },
  link_styles: { primary: [], secondary: [] },
  heading_styles: DEFAULT_HEADING_STYLES,
};

// ─── Convert ButtonStyle to inline CSS ───

export function buttonStyleToCSS(style: ButtonStyle): CSSProperties {
  return {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontFamily: style.fontFamily === "inherit" ? undefined : style.fontFamily,
    color: style.textColor,
    backgroundColor: style.bgColor,
    border: `${style.borderWidth} solid ${style.borderColor}`,
    borderRadius: style.borderRadius,
    padding: `${style.paddingY} ${style.paddingX}`,
    boxShadow: style.shadow === "none" ? undefined : style.shadow,
    textTransform: style.textTransform as CSSProperties["textTransform"],
    display: "inline-block",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };
}

// ─── Resolve a styleId to a ButtonStyle ───

export function findButtonStyle(
  styleId: string,
  siteStyles: SiteStyles
): ButtonStyle | null {
  const allButtons = [
    ...siteStyles.button_styles.main,
    ...siteStyles.button_styles.secondary,
  ];
  return allButtons.find((s) => s.id === styleId) || null;
}

// ─── Get all button styles as flat list with group labels ───

export function getAllButtonStyles(
  siteStyles: SiteStyles
): Array<{ style: ButtonStyle; group: string }> {
  const result: Array<{ style: ButtonStyle; group: string }> = [];
  for (const s of siteStyles.button_styles.main) {
    result.push({ style: s, group: "Main" });
  }
  for (const s of siteStyles.button_styles.secondary) {
    result.push({ style: s, group: "Secondary" });
  }
  return result;
}

// ─── Convert LinkStyle to inline CSS ───

export function linkStyleToCSS(style: LinkStyle): CSSProperties {
  return {
    color: style.color,
    fontSize: style.fontSize === "inherit" ? undefined : style.fontSize,
    fontWeight: style.fontWeight,
    fontFamily: style.fontFamily === "inherit" ? undefined : style.fontFamily,
    textDecoration: style.textDecoration,
    textTransform: style.textTransform as CSSProperties["textTransform"],
    letterSpacing: style.letterSpacing === "normal" ? undefined : style.letterSpacing,
    transition: "all 0.2s ease",
  };
}

// ─── Convert HeadingStyle to inline CSS ───

export function headingStyleToCSS(style: HeadingStyle): CSSProperties {
  return {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontFamily: style.fontFamily === "inherit" ? undefined : style.fontFamily,
    color: style.color,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing === "normal" ? undefined : style.letterSpacing,
    textTransform: style.textTransform as CSSProperties["textTransform"],
    marginBottom: style.marginBottom,
  };
}

// ─── Resolve a styleId to a LinkStyle ───

export function findLinkStyle(
  styleId: string,
  siteStyles: SiteStyles
): LinkStyle | null {
  const allLinks = [
    ...siteStyles.link_styles.primary,
    ...siteStyles.link_styles.secondary,
  ];
  return allLinks.find((s) => s.id === styleId) || null;
}
