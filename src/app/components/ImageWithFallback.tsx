import { useState, type ImgHTMLAttributes } from 'react';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

function isLocalOrSvg(src: string): boolean {
  return (
    src.startsWith("/") ||
    src.startsWith("data:") ||
    src.endsWith(".svg") ||
    src.startsWith("blob:") ||
    src.includes("wsrv.nl")
  );
}

function optimizeUnsplash(src: string, targetWidth?: number | string): string {
  try {
    const url = new URL(src);
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    url.searchParams.set("q", "80");
    if (targetWidth) url.searchParams.set("w", String(targetWidth));
    return url.toString();
  } catch (err) {
    console.debug("Unsplash URL optimization error, using raw src:", err);
    return src;
  }
}

function optimizeSanity(src: string, targetWidth?: number | string): string {
  try {
    const url = new URL(src);
    url.searchParams.set("auto", "format");
    if (targetWidth) url.searchParams.set("w", String(targetWidth));
    return url.toString();
  } catch (err) {
    console.debug("Sanity URL optimization error, using raw src:", err);
    return src;
  }
}

function getOptimizedSrc(src?: string, targetWidth?: number | string): string {
  if (!src) return "";
  if (isLocalOrSvg(src)) return src;
  if (src.includes("images.unsplash.com")) return optimizeUnsplash(src, targetWidth);
  if (src.includes("cdn.sanity.io")) return optimizeSanity(src, targetWidth);
  if (src.startsWith("http://") || src.startsWith("https://")) {
    const w = targetWidth ? Number(targetWidth) : 640;
    return `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=${w}&q=80&output=webp`;
  }
  return src;
}

export function ImageWithFallback(props: Readonly<ImgHTMLAttributes<HTMLImageElement>>) {
  const { src, alt, style, className, width, height, loading = "lazy", decoding = "async", ...rest } = props;

  const optimizedSrc = getOptimizedSrc(src, width);
  const [currentSrc, setCurrentSrc] = useState(optimizedSrc);
  const [didError, setDidError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset states when src changes to handle transitions between images
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    const nextOpt = getOptimizedSrc(src, width);
    setIsLoading(true);
    setDidError(false);
    setCurrentSrc(nextOpt);
    setPrevSrc(src);
  }

  const handleError = () => {
    // If the optimized proxy failed, fallback to raw original src before failing completely
    if (src && currentSrc !== src) {
      setCurrentSrc(src);
      setIsLoading(true);
      return;
    }
    setDidError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setDidError(false);
  };

  const isAbsolute = className?.includes('absolute');
  const posClass = isAbsolute ? '' : 'relative';

  if (didError) {
    return (
      <div
        className={`${posClass} overflow-hidden bg-stone-900/30 text-center flex items-center justify-center ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Loading error" {...rest} data-original-url={src} className="w-8 h-8 opacity-40" width={width} height={height} />
        </div>
      </div>
    );
  }

  return (
    <div className={`${posClass} overflow-hidden ${className ?? ''}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-xs animate-pulse" />
      )}
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        className={`w-full h-full object-cover block transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        {...rest}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}

