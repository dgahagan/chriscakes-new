'use client';

import Image from 'next/image';
import PinButton from './PinButton';

interface PinnableImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  currentPageUrl: string;
  description?: string;
  className?: string;
  priority?: boolean;
}

export default function PinnableImage({
  src,
  alt,
  width,
  height,
  currentPageUrl,
  description,
  className = '',
  priority = false,
}: PinnableImageProps) {
  return (
    <div className={`relative group ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="rounded-lg object-cover"
      />
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <PinButton
          url={currentPageUrl}
          media={src}
          description={description || alt}
        />
      </div>
    </div>
  );
}
