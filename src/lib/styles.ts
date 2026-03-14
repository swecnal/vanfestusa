import type { CSSProperties } from "react";

// ─── Text Style Config (per-field text customization) ───

export interface TextStyleConfig {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textTransform?: string;
  letterSpacing?: string;
  textShadow?: string;
}

export const EMPTY_TEXT_STYLE: TextStyleConfig = {};

export function textStyleConfigToCSS(style: TextStyleConfig): CSSProperties {
  const css: CSSProperties = {};
  if (style.fontFamily && style.fontFamily !== "inherit") css.fontFamily = style.fontFamily;
  if (style.fontSize) css.fontSize = style.fontSize;
  if (style.fontWeight) css.fontWeight = style.fontWeight;
  if (style.color) css.color = style.color;
  if (style.textTransform) css.textTransform = style.textTransform as CSSProperties["textTransform"];
  if (style.letterSpacing && style.letterSpacing !== "normal") css.letterSpacing = style.letterSpacing;
  if (style.textShadow) css.textShadow = style.textShadow;
  return css;
}

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

// ─── Convert ButtonStyle to inline CSS string (for HTML style attr) ───

export function buttonStyleToCSSString(style: ButtonStyle): string {
  const parts: string[] = [];
  parts.push(`font-size: ${style.fontSize}`);
  parts.push(`font-weight: ${style.fontWeight}`);
  if (style.fontFamily && style.fontFamily !== "inherit") parts.push(`font-family: ${style.fontFamily}`);
  parts.push(`color: ${style.textColor}`);
  parts.push(`background-color: ${style.bgColor}`);
  parts.push(`border: ${style.borderWidth} solid ${style.borderColor}`);
  parts.push(`border-radius: ${style.borderRadius}`);
  parts.push(`padding: ${style.paddingY} ${style.paddingX}`);
  if (style.shadow && style.shadow !== "none") parts.push(`box-shadow: ${style.shadow}`);
  if (style.textTransform && style.textTransform !== "none") parts.push(`text-transform: ${style.textTransform}`);
  parts.push("display: inline-block");
  parts.push("text-decoration: none");
  parts.push("cursor: pointer");
  parts.push("transition: all 0.2s ease");
  return parts.join("; ");
}

// ─── Resolve button styles in HTML string (for dangerouslySetInnerHTML) ───

export function resolveButtonStylesInHtml(
  html: string,
  siteStyles: SiteStyles
): string {
  if (!html) return html;
  // Match <a ...data-button-style="..."...> tags
  return html.replace(
    /<a\s([^>]*data-button-style="([^"]*)"[^>]*)>/gi,
    (fullMatch, attrs, styleId) => {
      let cssString = "";
      if (styleId === "custom") {
        // Parse data-custom-style JSON
        const customMatch = attrs.match(/data-custom-style="([^"]*)"/);
        if (customMatch) {
          try {
            const customStyle = JSON.parse(
              customMatch[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'")
            ) as ButtonStyle;
            cssString = buttonStyleToCSSString(customStyle);
          } catch {
            return fullMatch;
          }
        }
      } else {
        const resolved = findButtonStyle(styleId, siteStyles);
        if (!resolved) return fullMatch;
        cssString = buttonStyleToCSSString(resolved);
      }
      // Replace or add style attribute
      let newAttrs = attrs.replace(/style="[^"]*"/i, "");
      newAttrs = newAttrs.replace(/\s+/g, " ").trim();
      return `<a ${newAttrs} style="${cssString}">`;
    }
  );
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
