import type { HtmlBlockData } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
}

export default function HtmlBlockSection({ data }: Props) {
  const d = data as unknown as HtmlBlockData;

  return (
    <div dangerouslySetInnerHTML={{ __html: d.html }} />
  );
}
