import React, { useState, useEffect, useRef } from 'react';
import { Building2, ImageOff } from 'lucide-react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  containerClassName?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, containerClassName, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Helper to optimize Firebase Storage URLs
  const getOptimizedSrc = (url: string) => {
    if (url.includes('firebasestorage.googleapis.com') && !url.includes('?')) {
       // Assuming standard Firebase resize extension usage or just appending generic params
       // Note: This is a placeholder logic. Real resize requires specific extension setup.
       // For now, we return the original to avoid breaking signed URLs if they have tokens.
       // If tokens are present (usually after ?), we shouldn't blindly append without checking.
       return url;
    }
    return url;
  };

  return (
    <div ref={containerRef} className={`w-full h-full relative bg-slate-200 ${containerClassName || ''}`}>
      {/* Placeholder */}
      {(!isLoaded || hasError) && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
          {hasError ? <ImageOff size={24} /> : <Building2 size={24} className="animate-pulse" />}
        </div>
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          src={getOptimizedSrc(src)}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
};
