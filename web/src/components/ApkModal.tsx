import { useState } from 'react';
import { X, Download, Copy, Check, Smartphone, ShieldCheck } from 'lucide-react';

interface ApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkModal: React.FC<ApkModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadUrl = window.location.origin + '/fashion_otd_companion.apk';

  const handleCopy = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-[0_0_60px_rgba(212,175,55,0.25)] bg-[#0E0E14]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#A19DA8] hover:text-[#FFF] hover:bg-[#1E1E28] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] p-[1px]">
            <div className="w-full h-full bg-[#121217] rounded-2xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-[#EADB9B]" />
            </div>
          </div>
          <div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#FAF8F5]">
              Download Maison OTD
            </h3>
            <p className="text-xs text-[#A6A2AE]">Official Android Companion Package (v1.0.0)</p>
          </div>
        </div>

        {/* Specs Table */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-[#14141B] p-3.5 rounded-2xl border border-[#23232C] text-xs">
          <div>
            <span className="text-[#888591] block text-[10px] uppercase">File Name</span>
            <span className="font-mono text-[#EADB9B] truncate block">fashion_otd_companion.apk</span>
          </div>
          <div>
            <span className="text-[#888591] block text-[10px] uppercase">Size</span>
            <span className="font-mono text-[#ECE9E3]">150.0 MB</span>
          </div>
          <div>
            <span className="text-[#888591] block text-[10px] uppercase">Operating System</span>
            <span className="text-[#ECE9E3]">Android 8.0 or Newer</span>
          </div>
          <div>
            <span className="text-[#888591] block text-[10px] uppercase">Security</span>
            <span className="text-[#10B981] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Build
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href="/fashion_otd_companion.apk"
            download="fashion_otd_companion.apk"
            onClick={onClose}
            className="gold-btn w-full py-4 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer text-center block"
          >
            <Download className="w-4 h-4" />
            <span>Download APK Directly (150 MB)</span>
          </a>

          <button
            onClick={handleCopy}
            className="gold-btn-outline w-full py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Shareable Link for Friends'}</span>
          </button>
        </div>

        {/* Sideload hint */}
        <div className="mt-5 p-3 rounded-xl bg-[#171722] border border-[#242431] text-[11px] text-[#8E8A98] leading-relaxed">
          <strong className="text-[#D4AF37]">Android Sideload Note:</strong> If prompted with "File might be harmful", select <strong>Download anyway</strong> and grant permission to install from your browser.
        </div>

      </div>
    </div>
  );
};
