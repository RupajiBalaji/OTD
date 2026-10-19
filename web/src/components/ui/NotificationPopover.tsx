import React from 'react';
import { X, CloudRain, Sparkles, Calendar, Check, Bell } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'weather' | 'style' | 'occasion' | 'system';
  read: boolean;
}

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOccasion?: (occasionName: string) => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Hyderabad Weather Notice',
    message: 'Partly cloudy tonight (28°C) with light breeze. Light linen and structured draping recommended.',
    time: '25m ago',
    type: 'weather',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Upcoming Occasion: Dinner at L\'amore',
    message: 'Scheduled for tonight at 8:00 PM. Your outfit "The Parisian Minimalist" is ready.',
    time: '2h ago',
    type: 'occasion',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Style Synergy Match',
    message: 'Your new Navy Hopsack Blazer creates 4 new versatile combinations with your existing trousers.',
    time: '1d ago',
    type: 'style',
    read: true,
  },
];

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'weather':
        return <CloudRain className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'occasion':
        return <Calendar className="w-4 h-4 text-[var(--gold-primary)]" />;
      case 'style':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-[var(--text-muted)]" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xl p-5 text-[var(--text-body)] mt-16 animate-in slide-in-from-top-3 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-card)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[var(--pill-bg)] border border-[var(--border-gold)] flex items-center justify-center">
              <Bell className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
            </div>
            <h4 className="font-playfair text-base font-bold text-[var(--text-heading)]">
              Notifications
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="text-[11px] font-semibold text-[var(--gold-primary)] hover:underline cursor-pointer"
            >
              Mark read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[var(--pill-bg)] text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors cursor-pointer"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="py-2 space-y-2 max-h-[380px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              No new notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-2xl border transition-all text-xs flex gap-3 ${
                  notif.read
                    ? 'bg-[var(--bg-card)] border-[var(--border-card)]/50 opacity-75'
                    : 'bg-[var(--pill-bg)]/60 border-[var(--border-gold)]/60 shadow-xs'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] flex items-center justify-center shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h5 className="font-semibold text-[var(--text-heading)] text-[12px] truncate">
                      {notif.title}
                    </h5>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono shrink-0">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-body)] leading-snug">
                    {notif.message}
                  </p>
                </div>
                <button
                  onClick={() => clearNotification(notif.id)}
                  className="text-[var(--text-muted)] hover:text-rose-500 transition-colors p-1 self-start cursor-pointer"
                  title="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[var(--border-card)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <span>Synced with style telemetry</span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <Check className="w-3 h-3 stroke-[3]" /> Active
          </span>
        </div>
      </div>
    </div>
  );
};
