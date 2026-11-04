import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { X } from 'lucide-react';

export interface ContextChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: ReactNode;
  colorDot?: string;
  badge?: string | number;
  onRemove?: () => void;
  size?: 'sm' | 'md';
}

export const ContextChip = forwardRef<HTMLButtonElement, ContextChipProps>(
  (
    {
      children,
      selected = false,
      icon,
      colorDot,
      badge,
      onRemove,
      size = 'md',
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'text-[11px] px-3 py-1 gap-1.5 rounded-full',
      md: 'text-xs px-4 py-2 gap-2 rounded-full',
    };

    const stateStyles = selected
      ? 'bg-[#1C1612] text-white dark:bg-white dark:text-[#1C1612] border-black dark:border-white shadow-sm font-semibold'
      : 'bg-[var(--bg-card)] text-[var(--text-body)] hover:text-[var(--text-heading)] border-[var(--border-card)] hover:border-[var(--gold-primary)] hover:bg-[var(--pill-bg)] font-medium';

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={`inline-flex items-center justify-center border transition-all duration-200 select-none cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${sizeStyles[size]} ${stateStyles} ${className}`}
        {...props}
      >
        {colorDot && (
          <span
            className="w-3 h-3 rounded-full shrink-0 border border-black/20"
            style={{ backgroundColor: colorDot }}
          />
        )}
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{children}</span>
        {badge !== undefined && (
          <span
            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
              selected
                ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                : 'bg-[var(--pill-bg)] text-[var(--text-muted)]'
            }`}
          >
            {badge}
          </span>
        )}
        {onRemove && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>
    );
  }
);

ContextChip.displayName = 'ContextChip';
