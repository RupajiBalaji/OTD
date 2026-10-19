import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { useCloset, type ClosetItem } from '../context/ClosetContext';

interface AddPieceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_SAMPLES = [
  {
    name: 'Oatmeal Wool Flannel Trousers',
    brand: 'Fox Brothers',
    category: 'bottoms' as const,
    subType: 'Flannel Trousers',
    color: 'Oatmeal Beige',
    fit: 'Regular' as const,
    formality: 4 as const,
    icon: '👖',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Raw Silk Safari Overshirt',
    brand: 'Zegna',
    category: 'outerwear' as const,
    subType: 'Overshirt',
    color: 'Olive Forest',
    fit: 'Relaxed / Tailored' as const,
    formality: 3 as const,
    icon: '🧥',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Calfskin Horsebit Loafers',
    brand: 'Gucci 1953',
    category: 'footwear' as const,
    subType: 'Loafers',
    color: 'Burgundy Noir',
    fit: 'Regular' as const,
    formality: 4 as const,
    icon: '👞',
    imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=400&q=80',
  },
];

export const AddPieceModal: React.FC<AddPieceModalProps> = ({ isOpen, onClose }) => {
  const { addClosetItem } = useCloset();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<'upload' | 'analyzing' | 'confirm'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewIcon, setPreviewIcon] = useState('🧥');
  const [fileError, setFileError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('Double-Faced Camel Wool Overcoat');
  const [brand, setBrand] = useState('Loro Piana');
  const [category, setCategory] = useState<ClosetItem['category']>('outerwear');
  const [subType, setSubType] = useState('Overcoat');
  const [color, setColor] = useState('Vicuna Camel');
  const [fit, setFit] = useState<ClosetItem['fit']>('Relaxed / Tailored');
  const [formality, setFormality] = useState<ClosetItem['formality']>(4);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    setFileError(null);
    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError('Image size exceeds 10MB limit. Please choose a smaller file.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);

      // Auto-detect a sensible default name from filename
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));

      // Quick analyzing transition
      setStage('analyzing');
      setTimeout(() => {
        setStage('confirm');
      }, 700);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handlePresetSelect = (preset: typeof PRESET_SAMPLES[0]) => {
    setFileError(null);
    setName(preset.name);
    setBrand(preset.brand);
    setCategory(preset.category);
    setSubType(preset.subType);
    setColor(preset.color);
    setFit(preset.fit);
    setFormality(preset.formality);
    setPreviewIcon(preset.icon);
    setPreviewUrl(preset.imageUrl);
    setSelectedFile(null);

    setStage('analyzing');
    setTimeout(() => {
      setStage('confirm');
    }, 600);
  };

  const handleConfirmAdd = () => {
    addClosetItem({
      category,
      subType,
      name: name.trim() || 'Custom Garment',
      brand: brand.trim() || 'Bespoke',
      color: color.trim() || 'Classic Tone',
      fit,
      formality,
      icon: previewIcon,
      imageUrl: previewUrl || undefined,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      resetState();
      onClose();
    }, 700);
  };

  const resetState = () => {
    setStage('upload');
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileError(null);
    setIsDragging(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-[var(--border-gold)] shadow-2xl bg-[var(--bg-card)] text-[var(--text-body)] max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--pill-bg)] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[var(--pill-bg)] border border-[var(--border-gold)] flex items-center justify-center text-[var(--gold-primary)] shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-playfair text-2xl font-bold text-[var(--text-heading)]">
              Add Garment to Closet
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Real photo intake & AI garment cataloging
            </p>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {/* Stage 1: File Upload / Drag & Drop */}
        {stage === 'upload' && (
          <div className="space-y-5">
            {/* Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all group ${
                isDragging
                  ? 'border-[var(--gold-primary)] bg-[var(--pill-bg)] scale-[1.01]'
                  : 'border-[var(--border-gold)] hover:bg-[var(--pill-bg)]'
              }`}
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-[var(--pill-bg)] flex items-center justify-center text-[var(--gold-primary)] group-hover:scale-110 transition-transform mb-3 border border-[var(--border-card)]">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[var(--text-heading)]">
                Choose Photo or Drag Garment Image Here
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Supports JPG, PNG, WebP up to 10MB
              </p>
              <button
                type="button"
                className="mt-3.5 px-4 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold pointer-events-none"
              >
                Browse Files
              </button>
            </div>

            {/* Error Message */}
            {fileError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Sample presets */}
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] block mb-2 font-semibold">
                Or Try Sample Editorial Pieces:
              </span>
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                {PRESET_SAMPLES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(sample)}
                    className="p-2.5 rounded-xl border border-[var(--border-card)] bg-[var(--pill-bg)]/50 hover:border-[var(--gold-primary)] text-left transition-all cursor-pointer group hover:scale-[1.02]"
                  >
                    <div className="w-full h-16 rounded-lg overflow-hidden mb-2 bg-neutral-900 border border-[var(--border-card)]">
                      <img
                        src={sample.imageUrl}
                        alt={sample.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-[var(--text-heading)] line-clamp-1 block">
                      {sample.name}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] block truncate">
                      {sample.color}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: AI Analyzing Spinner */}
        {stage === 'analyzing' && (
          <div className="py-12 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-2 border-[var(--border-gold)] border-t-[var(--gold-primary)] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-xl">
                ✨
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-heading)]">
                Cataloging Garment...
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Processing dimensions, color family & silhouette profile
              </p>
            </div>
          </div>
        )}

        {/* Stage 3: Confirm & Edit Attributes */}
        {stage === 'confirm' && (
          <div className="space-y-4 text-xs">
            {/* Preview Banner */}
            <div className="p-3 rounded-2xl border border-[var(--border-card)] bg-[var(--pill-bg)] flex items-center gap-3">
              <div className="w-14 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-[var(--border-gold)] shrink-0 flex items-center justify-center text-2xl">
                {previewUrl ? (
                  <img src={previewUrl} alt="Garment Preview" className="w-full h-full object-cover" />
                ) : (
                  <span>{previewIcon}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-mono font-semibold text-[var(--gold-primary)]">
                  Photo Selected
                </span>
                <p className="text-xs font-bold text-[var(--text-heading)] truncate">
                  {name || 'Selected Piece'}
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB • Local file` : 'Curated sample'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStage('upload')}
                className="text-[11px] font-semibold text-[var(--gold-primary)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Change
              </button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-[var(--text-muted)] mb-1">
                  Garment Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-[var(--text-muted)] mb-1">
                  Brand / Maker
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-[var(--text-muted)] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ClosetItem['category'])}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)]"
                >
                  <option value="tops">Tops / Shirts / Knits</option>
                  <option value="bottoms">Bottoms / Trousers / Denim</option>
                  <option value="outerwear">Outerwear / Jackets</option>
                  <option value="footwear">Footwear / Shoes</option>
                  <option value="accessories">Accessories / Timepiece</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-[var(--text-muted)] mb-1">
                  Color Family
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-[var(--text-muted)] mb-1">
                  Fit Profile
                </label>
                <select
                  value={fit}
                  onChange={(e) => setFit(e.target.value as ClosetItem['fit'])}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)]"
                >
                  <option value="Slim">Slim / Tailored</option>
                  <option value="Regular">Regular Classic</option>
                  <option value="Relaxed / Tailored">Relaxed / Drape</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-[var(--text-muted)] mb-1">
                  Formality Tier (1-5)
                </label>
                <select
                  value={formality}
                  onChange={(e) => setFormality(Number(e.target.value) as ClosetItem['formality'])}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)]"
                >
                  <option value={1}>Tier 1: Casual Street / Lounge</option>
                  <option value={2}>Tier 2: Smart Casual</option>
                  <option value={3}>Tier 3: Elevated Social / Date</option>
                  <option value={4}>Tier 4: Business Sartorial</option>
                  <option value={5}>Tier 5: Formal Black-Tie</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={() => setStage('upload')}
                className="px-4 py-2.5 rounded-xl border border-[var(--border-card)] text-xs font-semibold hover:bg-[var(--pill-bg)] transition-colors cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleConfirmAdd}
                className="flex-1 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:opacity-95 transition-all"
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    <span>Added to Digital Closet!</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm & Add to Closet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
