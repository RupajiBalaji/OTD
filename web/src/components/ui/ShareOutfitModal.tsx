import React, { useState } from 'react';
import { X, Sparkles, Globe } from 'lucide-react';
import { socialApiService, type CommunityOutfitPost } from '../../services/social.service';
import { useCloset } from '../../context/ClosetContext';

interface ShareOutfitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShared: (post: CommunityOutfitPost) => void;
}

export const ShareOutfitModal: React.FC<ShareOutfitModalProps> = ({ isOpen, onClose, onShared }) => {
  const { currentOutfit } = useCloset();
  const [caption, setCaption] = useState(
    currentOutfit
      ? `Curated ${currentOutfit.vibe} look for ${currentOutfit.venue}. Architectural silhouette with elevated tonal harmony.`
      : 'My latest quiet luxury ensemble.'
  );
  const [tags, setTags] = useState('Quiet Luxury, Editorial, Minimalist');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !currentOutfit) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      setError('Please add an editorial caption');
      return;
    }

    setIsLoading(true);
    setError(null);

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const token = localStorage.getItem('otd_access_token');
    try {
      const shared = await socialApiService.shareOutfit(
        {
          outfitId: currentOutfit.id,
          caption: caption.trim(),
          venue: currentOutfit.venue,
          occasion: currentOutfit.occasion,
          tags: tagList,
        },
        token || undefined
      );

      if (shared) {
        onShared(shared);
        onClose();
      } else {
        // Fallback local share item
        const localShare: CommunityOutfitPost = {
          _id: `share_${Date.now()}`,
          userId: { _id: 'u1', name: 'You (Curator)' },
          outfitId: currentOutfit,
          caption: caption.trim(),
          venue: currentOutfit.venue,
          occasion: currentOutfit.occasion,
          likesCount: 1,
          commentsCount: 0,
          tags: tagList,
          isLiked: true,
          createdAt: new Date().toISOString(),
        };
        onShared(localShare);
        onClose();
      }
    } catch {
      setError('Failed to share to community lookbook.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-gold)] rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--pill-bg)] border border-[var(--border-gold)] flex items-center justify-center text-[var(--gold-primary)]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-playfair text-lg font-bold text-[var(--text-heading)]">
                Publish to Community Lookbook
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Inspire other curators with your bespoke garment combination
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[var(--border-card)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-heading)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 font-medium">
            {error}
          </div>
        )}

        {/* Outfit Preview */}
        <div className="p-3 rounded-2xl border border-[var(--border-card)] bg-[var(--pill-bg)] flex items-center gap-3">
          <div className="w-14 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-[var(--border-gold)] shrink-0 flex items-center justify-center">
            {currentOutfit.pieces[0]?.imageUrl ? (
              <img src={currentOutfit.pieces[0].imageUrl} alt="Outfit piece" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">{currentOutfit.pieces[0]?.icon || '👔'}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] uppercase font-mono font-bold text-[var(--gold-primary)]">
              {currentOutfit.harmonyScore}% Harmony • {currentOutfit.occasion}
            </span>
            <p className="text-xs font-bold text-[var(--text-heading)] truncate">
              {currentOutfit.title}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] truncate">
              {currentOutfit.venue}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
              Editorial Caption
            </label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-[var(--pill-bg)] border border-[var(--border-card)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)] resize-none"
              placeholder="Describe your styling philosophy for this look..."
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
              Style Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-[var(--pill-bg)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] outline-none focus:border-[var(--gold-primary)]"
              placeholder="e.g. Quiet Luxury, Summer Sartorial, Milanese"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[var(--border-card)] text-xs font-semibold hover:bg-[var(--pill-bg)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
              <span>{isLoading ? 'Publishing...' : 'Publish to Lookbook'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
