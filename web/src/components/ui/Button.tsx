import React, { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-primary)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

    // Variant mappings
    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-[#1C1612] text-white hover:bg-neutral-800 dark:bg-white dark:text-[#1C1612] dark:hover:bg-neutral-200 shadow-md',
      secondary:
        'bg-[var(--pill-bg)] text-[var(--text-heading)] hover:bg-[var(--border-card)] border border-[var(--border-card)]',
      gold:
        'bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-black font-semibold hover:brightness-105 shadow-md shadow-[#D4AF37]/20 border border-[#F7E7A9]/40',
      outline:
        'border border-[var(--border-card)] bg-transparent text-[var(--text-heading)] hover:bg-[var(--pill-bg)] hover:border-[var(--gold-primary)]',
      ghost:
        'bg-transparent text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--pill-bg)]',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 shadow-sm border border-rose-700/50',
    };

    // Size mappings
    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'text-xs px-3.5 py-1.5 rounded-full gap-1.5 h-8',
      md: 'text-xs sm:text-sm px-5 py-2.5 rounded-full gap-2 h-10',
      lg: 'text-sm sm:text-base px-6 py-3 rounded-full gap-2.5 h-12',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
