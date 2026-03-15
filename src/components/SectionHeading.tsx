import type { CSSProperties } from "react";

interface Props {
  title: string;
  subtitle?: string;
  light?: boolean;
  titleStyle?: CSSProperties;
  subtitleStyle?: CSSProperties;
}

export default function SectionHeading({ title, subtitle, light, titleStyle, subtitleStyle }: Props) {
  return (
    <div className="text-center mb-12">
      <h2
        className={`font-display font-black text-3xl md:text-4xl lg:text-5xl mb-4 ${
          light ? "text-white" : "text-charcoal"
        }`}
        style={titleStyle}
        dangerouslySetInnerHTML={{ __html: title || "" }}
      />
      {subtitle && (
        <p
          className={`text-lg max-w-2xl mx-auto ${
            light ? "text-white/70" : "text-charcoal/60"
          }`}
          style={subtitleStyle}
          dangerouslySetInnerHTML={{ __html: subtitle || "" }}
        />
      )}
      <div className="mt-4 mx-auto w-20 h-1 bg-teal rounded-full" />
    </div>
  );
}
