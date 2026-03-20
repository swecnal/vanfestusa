import type { CSSProperties } from "react";

interface DividerStyle {
  color?: string;
  width?: number;
  height?: number;
  opacity?: number;
}

interface Props {
  title?: string;
  subtitle?: string;
  light?: boolean;
  titleStyle?: CSSProperties;
  subtitleStyle?: CSSProperties;
  dividerStyle?: DividerStyle;
}

export type { DividerStyle };

export default function SectionHeading({ title, subtitle, light, titleStyle, subtitleStyle, dividerStyle }: Props) {
  const dw = dividerStyle?.width ?? 80;
  const dh = dividerStyle?.height ?? 4;
  const dc = dividerStyle?.color || "#09B593";
  const dop = dividerStyle?.opacity ?? 1;

  return (
    <div className="text-center mb-12">
      {title && (
        <h2
          className={`font-display font-black text-3xl md:text-4xl lg:text-5xl mb-4 ${
            light ? "text-white" : "text-charcoal"
          }`}
          style={titleStyle}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      )}
      {subtitle && (
        <p
          className={`text-lg max-w-2xl mx-auto ${
            light ? "text-white/70" : "text-charcoal/60"
          }`}
          style={subtitleStyle}
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
      )}
      <div
        className="mt-4 mx-auto rounded-full"
        style={{ width: dw, height: dh, backgroundColor: dc, opacity: dop }}
      />
    </div>
  );
}
