import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  'aria-label'?: string;
}

interface ButtonAsButton extends BaseButtonProps {
  as?: 'button';
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  href?: never;
}

interface ButtonAsLink extends BaseButtonProps {
  as: 'link';
  href: string;
  type?: never;
  onClick?: never;
  target?: '_blank' | '_self';
  rel?: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const getVariantClasses = (variant: ButtonVariant): string => {
  const variants = {
    primary:
      'bg-crimson-500 text-white hover:bg-crimson-600 focus:ring-crimson-500 disabled:bg-gray-300',
    secondary:
      'bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-700 disabled:bg-gray-300',
    outline:
      'bg-transparent border-2 border-crimson-500 text-crimson-500 hover:bg-crimson-50 focus:ring-crimson-500 disabled:border-gray-300 disabled:text-gray-300',
    ghost:
      'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400 disabled:text-gray-300',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 disabled:bg-gray-300',
  };
  return variants[variant];
};

const getSizeClasses = (size: ButtonSize): string => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  return sizes[size];
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  className = '',
  'aria-label': ariaLabel,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const widthClasses = fullWidth ? 'w-full' : '';

  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`.trim();

  const content = (
    <>
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
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
      )}
      {children}
    </>
  );

  if (props.as === 'link' && props.href) {
    return (
      <Link
        href={props.href}
        className={combinedClasses}
        aria-label={ariaLabel}
        target={props.target}
        rel={props.target === '_blank' ? 'noopener noreferrer' : props.rel}
        aria-disabled={disabled || loading}
        onClick={(e) => {
          if (disabled || loading) {
            e.preventDefault();
          }
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type || 'button'}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={props.onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {content}
    </button>
  );
}
