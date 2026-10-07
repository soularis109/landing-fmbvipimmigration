import { useState } from "react";
import { asset } from "../../lib/asset";

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  eager?: boolean;
}

/** Image with a navy→sea gradient fallback of the same aspect ratio, so layout never breaks. */
export function Photo({ src, alt, width, height, className = "", eager }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`bg-gradient-to-br from-navy to-sea ${className}`}
        style={{ aspectRatio: `${width} / ${height}` }}
      />
    );
  }
  return (
    <img
      src={asset(src)}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`photo ${className}`}
    />
  );
}
