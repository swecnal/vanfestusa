interface Props {
  title: string;
  subtitle?: string;
  light?: boolean;
}

export default function SectionHeading({ title, subtitle, light }: Props) {
  return (
    <div className="text-center mb-12">
      <h2
        className={`font-display font-black text-3xl md:text-4xl lg:text-5xl mb-4 ${
          light ? "text-white" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg max-w-2xl mx-auto ${
            light ? "text-white/70" : "text-charcoal/60"
          }`}
        >
          {subtitle}
        </p>
      )}
      <div className="mt-4 mx-auto w-20 h-1 bg-teal rounded-full" />
    </div>
  );
}
