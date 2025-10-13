import React from 'react';
import Link from 'next/link';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';

interface BaseCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  role?: string;
  'aria-label'?: string;
}

interface CardAsDiv extends BaseCardProps {
  as?: 'div';
  href?: never;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface CardAsLink extends BaseCardProps {
  as: 'link';
  href: string;
  onClick?: never;
  target?: '_blank' | '_self';
}

interface CardAsButton extends BaseCardProps {
  as: 'button';
  href?: never;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

type CardProps = CardAsDiv | CardAsLink | CardAsButton;

const getVariantClasses = (variant: CardVariant): string => {
  const variants = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg border border-gray-100',
    outlined: 'bg-transparent border-2 border-gray-300',
    filled: 'bg-gray-50 border border-gray-200',
  };
  return variants[variant];
};

const getPaddingClasses = (padding: 'none' | 'sm' | 'md' | 'lg'): string => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  return paddings[padding];
};

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  role,
  'aria-label': ariaLabel,
  ...props
}: CardProps) {
  const baseClasses = 'rounded-lg transition-shadow';
  const variantClasses = getVariantClasses(variant);
  const paddingClasses = getPaddingClasses(padding);

  const combinedClasses = `${baseClasses} ${variantClasses} ${paddingClasses} ${className}`.trim();

  if (props.as === 'link' && props.href) {
    return (
      <Link
        href={props.href}
        className={`${combinedClasses} hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:ring-offset-2`}
        role={role}
        aria-label={ariaLabel}
        target={props.target}
        rel={props.target === '_blank' ? 'noopener noreferrer' : undefined}
      >
        {children}
      </Link>
    );
  }

  if (props.as === 'button') {
    return (
      <button
        type="button"
        className={`${combinedClasses} hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:ring-offset-2 text-left w-full`}
        onClick={props.onClick}
        role={role}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      className={combinedClasses}
      onClick={props.onClick}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

// Subcomponents for structured card content
export function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = '',
  as: Component = 'h3',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}) {
  return (
    <Component className={`text-xl font-bold text-gray-900 ${className}`}>
      {children}
    </Component>
  );
}

export function CardDescription({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>
  );
}

export function CardContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
      {children}
    </div>
  );
}
