import React, { useState } from 'react';
import { X, Moon, Sun, Ruler, Bell, RotateCcw, LogOut, Check, Sliders } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSignOut,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [measurementUnit, setMeasurementUnit] = useState<'metric' | 'imperial'>('metric');
  const [notifyWeather, setNotifyWeather] = useState(true);
  const [notifyOccasions, setNotifyOccasions] = useState(true);
  const [notifySuggestions, setNotifySuggestions] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClearCache = () => {
    localStorage.removeItem('otd_closet_items');
    localStorage.removeItem('otd_user_profile');
    setStatusMessage('Local closet & style cache reset to defaults.');
    setTimeout(() => {
      setStatusMessage(null);
      window.location.reload();
    }, 900);
  };

  const handleSave = () => {
    setStatusMessage('Preferences saved successfully.');
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xl p-6 sm:p-7 text-[var(--text-body)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-card)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--pill-bg)] border border-[var(--border-gold)] flex items-center justify-center text-[var(--gold-primary)]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-playfair text-xl font-bold text-[var(--text-heading)]">
                Studio Settings
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Calibrate appearance, telemetry, and account preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--pill-bg)] text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback message banner */}
        {statusMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Settings options list */}
        <div className="py-4 space-y-5 text-xs">
          {/* Appearance / Theme */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-[var(--text-heading)] text-sm">
                Appearance Mode
              </h4>
              <p className="text-[11px] text-[var(--text-muted)]">
                Toggle between Haute Light and Obsidian Dark luxury themes
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-card)] bg-[var(--bg-card)] hover:border-[var(--gold-primary)] text-xs font-semibold cursor-pointer transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dark Theme</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light Theme</span>
                </>
              )}
            </button>
          </div>

          {/* Measurement Units */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-card)]">
            <div>
              <h4 className="font-semibold text-[var(--text-heading)] text-sm flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-[var(--gold-primary)]" />
                <span>Measurement Units</span>
              </h4>
              <p className="text-[11px] text-[var(--text-muted)]">
                Used for garment dimensions and style avatar calibration
              </p>
            </div>
            <div className="flex rounded-xl p-0.5 border border-[var(--border-card)] bg-[var(--pill-bg)]">
              <button
                onClick={() => setMeasurementUnit('metric')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  measurementUnit === 'metric'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                Metric (cm/kg)
              </button>
              <button
                onClick={() => setMeasurementUnit('imperial')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  measurementUnit === 'imperial'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                Imperial (ft/lbs)
              </button>
            </div>
          </div>

          {/* Telemetry & Notifications */}
          <div className="space-y-3 pt-3 border-t border-[var(--border-card)]">
            <h4 className="font-semibold text-[var(--text-heading)] text-sm flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-[var(--gold-primary)]" />
              <span>Smart Alerts & Telemetry</span>
            </h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[11px] text-[var(--text-body)]">Weather & climate adaptation alerts</span>
                <input
                  type="checkbox"
                  checked={notifyWeather}
                  onChange={(e) => setNotifyWeather(e.target.checked)}
                  className="rounded text-[var(--gold-primary)] focus:ring-[var(--gold-primary)]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[11px] text-[var(--text-body)]">Upcoming occasion outfit reminders</span>
                <input
                  type="checkbox"
                  checked={notifyOccasions}
                  onChange={(e) => setNotifyOccasions(e.target.checked)}
                  className="rounded text-[var(--gold-primary)] focus:ring-[var(--gold-primary)]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[11px] text-[var(--text-body)]">Wardrobe synergy & recommendation tips</span>
                <input
                  type="checkbox"
                  checked={notifySuggestions}
                  onChange={(e) => setNotifySuggestions(e.target.checked)}
                  className="rounded text-[var(--gold-primary)] focus:ring-[var(--gold-primary)]"
                />
              </label>
            </div>
          </div>

          {/* Data Reset */}
          <div className="pt-3 border-t border-[var(--border-card)] flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-[var(--text-heading)] text-sm">
                Reset Demo Data
              </h4>
              <p className="text-[11px] text-[var(--text-muted)]">
                Restore default digital closet and style profile
              </p>
            </div>
            <button
              onClick={handleClearCache}
              className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-[var(--border-card)] flex items-center justify-between">
          {onSignOut ? (
            <button
              onClick={onSignOut}
              className="text-xs font-bold text-[var(--text-muted)] hover:text-rose-600 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[var(--border-card)] text-xs font-semibold hover:bg-[var(--pill-bg)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-md"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
