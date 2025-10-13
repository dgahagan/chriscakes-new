import React from 'react';

type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'skeleton';
type LoadingSize = 'sm' | 'md' | 'lg';

interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const getSizeClasses = (size: LoadingSize): string => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  return sizes[size];
};

export default function Loading({
  variant = 'spinner',
  size = 'md',
  text,
  className = '',
  fullScreen = false,
}: LoadingProps) {
  const sizeClasses = getSizeClasses(size);

  const renderLoading = () => {
    switch (variant) {
      case 'spinner':
        return (
          <svg
            className={`animate-spin ${sizeClasses} text-crimson-500`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );

      case 'dots':
        return (
          <div className="flex gap-2" aria-hidden="true">
            <div className={`${sizeClasses} bg-crimson-500 rounded-full animate-bounce`} />
            <div
              className={`${sizeClasses} bg-crimson-500 rounded-full animate-bounce`}
              style={{ animationDelay: '0.1s' }}
            />
            <div
              className={`${sizeClasses} bg-crimson-500 rounded-full animate-bounce`}
              style={{ animationDelay: '0.2s' }}
            />
          </div>
        );

      case 'pulse':
        return (
          <div
            className={`${sizeClasses} bg-crimson-500 rounded-full animate-pulse`}
            aria-hidden="true"
          />
        );

      case 'skeleton':
        return (
          <div className="space-y-3 w-full" aria-hidden="true">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
          </div>
        );

      default:
        return null;
    }
  };

  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
      role="status"
      aria-live="polite"
    >
      {renderLoading()}
      {text && (
        <p className="text-gray-600 text-sm font-medium">{text}</p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}

// Skeleton component for content placeholders
export function Skeleton({
  className = '',
  count = 1,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 rounded animate-pulse ${className}`}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Card skeleton for loading card layouts
export function CardSkeleton({
  count = 1,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}
          role="status"
          aria-label="Loading card"
        >
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3 mt-4" />
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      ))}
    </>
  );
}

// Page loading component
export function PageLoading({ text = 'Loading page...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loading variant="spinner" size="lg" text={text} />
    </div>
  );
}

// Inline loading for buttons and small spaces
export function InlineLoading({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-4 w-4 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
