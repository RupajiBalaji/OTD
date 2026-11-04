import React, { useState } from 'react';
import { X, Calendar, Check } from 'lucide-react';
import { eventsApiService, type ScheduledCalendarEvent } from '../../services/events.service';
import { useCloset } from '../../context/ClosetContext';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduled: (event: ScheduledCalendarEvent) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onScheduled }) => {
  const { currentOutfit, savedLooks } = useCloset();
  const [selectedOutfitId, setSelectedOutfitId] = useState<string>(
    currentOutfit?.id || savedLooks[0]?.id || ''
  );

  const selectedOutfit =
    selectedOutfitId === currentOutfit?.id
      ? currentOutfit
      : savedLooks.find((l) => l.id === selectedOutfitId) || currentOutfit;

  const [title, setTitle] = useState(selectedOutfit?.title || 'Dinner Date Ensemble');
  const [venue, setVenue] = useState(selectedOutfit?.venue || "L'Amore Ristorante, Jubilee Hills");
  const [occasion, setOccasion] = useState(selectedOutfit?.occasion || 'Fine Dining Date');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('8:00 PM');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOutfit) {
      setError('Please select an outfit to schedule');
      return;
    }

    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem('otd_access_token');
    try {
      const scheduled = await eventsApiService.createEvent(
        {
          title: title.trim() || selectedOutfit.title,
          venue: venue.trim() || selectedOutfit.venue,
          occasion: occasion.trim() || selectedOutfit.occasion,
          vibe: selectedOutfit.vibe,
          scheduledDate: new Date(`${date}T12:00:00Z`).toISOString(),
          time,
          outfitId: selectedOutfit.id,
          weatherForecast: selectedOutfit.weather || '24°C Pleasant',
          notes,
        },
        token || undefined
      );

      if (scheduled) {
        onScheduled(scheduled);
        onClose();
      } else {
        // Fallback local scheduled event
        const localEvent: ScheduledCalendarEvent = {
          _id: `evt_${Date.now()}`,
          title: title.trim() || selectedOutfit.title,
          venue: venue.trim() || selectedOutfit.venue,
          occasion: occasion.trim() || selectedOutfit.occasion,
          vibe: selectedOutfit.vibe,
          scheduledDate: new Date(`${date}T12:00:00Z`).toISOString(),
          time,
          outfitId: selectedOutfit,
          weatherForecast: selectedOutfit.weather || '24°C Pleasant',
          status: 'scheduled',
          notes,
        };
        onScheduled(localEvent);
        onClose();
      }
    } catch {
      setError('Failed to schedule event. Please verify connection.');
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
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-playfair text-lg font-bold text-[var(--text-heading)]">
                Schedule Look on Calendar
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Pre-plan your curated look for an upcoming occasion
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
              Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--pill-bg)] border border-[var(--border-card)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-heading)] font-semibold outline-none focus:border-[var(--gold-primary)]"
              placeholder="e.g. Dinner Date at L'Amore"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[var(--pill-bg)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] outline-none focus:border-[var(--gold-primary)]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[var(--pill-bg)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] outline-none focus:border-[var(--gold-primary)]"
                placeholder="8:00 PM"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                Venue
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-[var(--pill-bg)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] outline-none focus:border-[var(--gold-primary)]"
                placeholder="Venue name"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                Occasion
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full bg-[var(--pill-bg)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] outline-none focus:border-[var(--gold-primary)]"
                placeholder="Occasion"
              />
            </div>
          </div>

          {/* Outfit Selected Preview & Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)]">
                Attached Ensemble
              </label>
              {savedLooks.length > 0 && (
                <select
                  value={selectedOutfitId}
                  onChange={(e) => setSelectedOutfitId(e.target.value)}
                  className="text-[10px] bg-[var(--pill-bg)] border border-[var(--border-card)] rounded-lg px-2 py-0.5 text-[var(--text-heading)] outline-none"
                >
                  {currentOutfit && <option value={currentOutfit.id}>Current Canvas: {currentOutfit.title}</option>}
                  {savedLooks.map((look) => (
                    <option key={look.id} value={look.id}>Saved: {look.title}</option>
                  ))}
                </select>
              )}
            </div>
            {selectedOutfit && (
              <div className="p-3 rounded-2xl border border-[var(--border-card)] bg-[var(--pill-bg)] flex items-center gap-3">
                <div className="w-12 h-14 rounded-xl overflow-hidden bg-neutral-900 border border-[var(--border-gold)] shrink-0 flex items-center justify-center">
                  {selectedOutfit.pieces[0]?.imageUrl ? (
                    <img src={selectedOutfit.pieces[0].imageUrl} alt="Outfit piece" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">{selectedOutfit.pieces[0]?.icon || '👔'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] uppercase font-mono font-bold text-[var(--gold-primary)]">
                    {selectedOutfit.vibe} • {selectedOutfit.occasion}
                  </span>
                  <p className="text-xs font-bold text-[var(--text-heading)] truncate">
                    {selectedOutfit.title}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] truncate">
                    {selectedOutfit.pieces.map((p) => p.name).join(' • ')}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
              Private Styling Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[var(--pill-bg)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] outline-none focus:border-[var(--gold-primary)]"
              placeholder="e.g. Table booked under Julian; wear coat if breezy"
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
              <Check className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Scheduling...' : 'Confirm Schedule'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
