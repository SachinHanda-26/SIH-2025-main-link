import React, { useState } from "react";
import { ImageIcon } from "lucide-react";

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackIcon?: React.ReactNode; // Optional custom fallback
}

export function ImageWithFallback({
  src,
  alt,
  className = "",
  style,
  fallbackIcon,
  ...rest
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => setHasError(true);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={style}
      >
        {fallbackIcon ?? (
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
    />
  );
}
