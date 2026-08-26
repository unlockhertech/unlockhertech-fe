import { useState, type ImgHTMLAttributes } from 'react';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: Readonly<ImgHTMLAttributes<HTMLImageElement>>) {
  const [didError, setDidError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    setDidError(false) // Reset error if we're trying a new sec
    setDidError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
    setDidError(false)
  }

  const { src, alt, style, className, ...rest } = props

  // Reset states when src changes to handle transitions between images
  const [prevSrc, setPrevSrc] = useState(src)
  if (src !== prevSrc) {
    setIsLoading(true)
    setDidError(false)
    setPrevSrc(src)
  }

  const isAbsolute = className?.includes('absolute');
  const posClass = isAbsolute ? '' : 'relative';

  if (didError) {
    return (
      <div
        className={`${posClass} overflow-hidden bg-stone-900/30 text-center flex items-center justify-center ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Loading error" {...rest} data-original-url={src} className="w-8 h-8 opacity-40" />
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
        src={src}
        alt={alt}
        className={`w-full h-full object-cover block transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        {...rest}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
