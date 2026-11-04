import React, { type ReactNode } from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`py-16 px-6 text-center rounded-3xl border border-dashed border-[var(--border-card)] bg-[var(--pill-bg)]/30 flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] flex items-center justify-center text-[var(--gold-primary)] shadow-xs">
        {icon}
      </div>

      <div className="space-y-1.5 max-w-md">
        <h4 className="font-playfair text-xl font-bold text-[var(--text-heading)]">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
