import React from 'react';
import { Trash2 } from 'lucide-react';
import type { ClosetItem } from '../../context/ClosetContext';

export interface ItemCardProps {
  item: ClosetItem;
  onClick?: () => void;
  selected?: boolean;
  onDelete?: (e: React.MouseEvent) => void;
  onEdit?: (e: React.MouseEvent) => void;
  showActions?: boolean;
  className?: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onClick,
  selected = false,
  onDelete,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer shadow-xs hover:shadow-md ${
        selected
          ? 'border-[var(--gold-primary)] ring-2 ring-[var(--gold-primary)]/30 bg-[var(--pill-bg)]'
          : 'border-[var(--border-card)] bg-[var(--bg-card)] hover:border-[var(--gold-primary)]'
      } ${className}`}
    >
      {/* Garment Image / Icon Container */}
      <div className="h-48 bg-neutral-100 dark:bg-neutral-900/80 relative overflow-hidden flex items-center justify-center p-1.5">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full rounded-xl bg-neutral-200 dark:bg-neutral-800 flex flex-col items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300">
            <span>{item.icon}</span>
          </div>
        )}

        {/* Delete button if onDelete passed */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-black/60 text-white hover:text-rose-400 hover:bg-black/90 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-md z-10"
            title="Delete piece"
            aria-label="Delete piece"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Category Pill Tag */}
        <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-mono tracking-wider backdrop-blur-md uppercase">
          {item.category}
        </span>
      </div>

      {/* Garment Metadata */}
      <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] text-[var(--gold-primary)] font-mono font-semibold uppercase tracking-wider block truncate">
            {item.brand}
          </span>
          <h5 className="font-playfair text-sm font-bold text-[var(--text-heading)] leading-snug line-clamp-1 group-hover:text-[var(--gold-primary)] transition-colors">
            {item.name}
          </h5>
          <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
            {item.subType} • {item.color}
          </p>
        </div>

        {/* Fit and Formality Tier */}
        <div className="flex items-center justify-between pt-1 border-t border-[var(--border-card)] text-[10px]">
          <span className="text-[var(--text-body)] font-medium truncate">{item.fit}</span>
          <span className="px-2 py-0.5 rounded-md bg-[var(--pill-bg)] text-[var(--text-muted)] font-mono border border-[var(--border-card)]">
            Tier {item.formality} / 5
          </span>
        </div>
      </div>
    </div>
  );
};
