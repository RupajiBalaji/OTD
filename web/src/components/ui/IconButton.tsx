import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type IconButtonVariant = 'default' | 'gold' | 'ghost' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'default', size = 'md', className = '', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-full transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-primary)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-95';

    const variantStyles: Record<IconButtonVariant, string> = {
      default:
        'bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-heading)] hover:border-[var(--gold-primary)] hover:bg-[var(--pill-bg)] shadow-xs',
      gold:
        'bg-[#D4AF37] text-black hover:bg-[#A67C1E] shadow-sm',
      ghost:
        'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--pill-bg)]',
      danger:
        'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900',
    };

    const sizeStyles: Record<IconButtonSize, string> = {
      sm: 'w-7 h-7 text-xs',
      md: 'w-9 h-9 text-sm',
      lg: 'w-11 h-11 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
