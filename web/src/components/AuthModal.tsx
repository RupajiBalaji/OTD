import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  X,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  Info,
} from 'lucide-react';
import { authService } from '../services/auth.service';

export type AuthMode = 'signin' | 'signup' | 'forgot';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
  onSuccess?: (user: unknown) => void;
  onSwitchToOnboarding?: () => void;
}

const AuthModalDialog: React.FC<Omit<AuthModalProps, 'isOpen'>> = ({
  initialMode = 'signin',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Form fields
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation errors
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Status & messages
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [socialNotice, setSocialNotice] = useState<string | null>(null);
  const [forgotNotice, setForgotNotice] = useState<string | null>(null);

  // Reset helper
  const resetForm = () => {
    setName('');
    setIdentifier('');
    setPassword('');
    setShowPassword(false);
    setTouched({});
    setFieldErrors({});
    setServerError(null);
    setSocialNotice(null);
    setForgotNotice(null);
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Validation logic
  const validate = () => {
    const errors: Record<string, string> = {};

    if (mode === 'signup') {
      if (!name.trim()) {
        errors.name = 'Please enter your full name.';
      } else if (name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters.';
      }
    }

    if (!identifier.trim()) {
      errors.identifier = 'Please enter your email or phone number.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/;
      const isEmail = emailRegex.test(identifier.trim());
      const isPhone = phoneRegex.test(identifier.trim()) && identifier.replace(/\D/g, '').length >= 7;

      if (!isEmail && !isPhone) {
        errors.identifier = 'Please enter a valid email address or phone number.';
      }
    }

    if (mode !== 'forgot') {
      if (!password) {
        errors.password = 'Password is required.';
      } else if (mode === 'signup' && password.length < 8) {
        errors.password = 'Password must be at least 8 characters long.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, identifier: true, password: true });
    setServerError(null);
    setSocialNotice(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const result = await authService.login({
          email: identifier,
          password,
        });

        if (result.success && result.data) {
          if (onSuccess) onSuccess(result.data);
          onClose();
        } else {
          setServerError(
            result.error || 'Invalid credentials or authentication failed.'
          );
        }
      } else if (mode === 'signup') {
        const result = await authService.register({
          name,
          email: identifier,
          password,
        });

        if (result.success && result.data) {
          if (onSuccess) onSuccess(result.data);
          onClose();
        } else {
          setServerError(
            result.error || 'Registration failed. The server rejected the request.'
          );
        }
      } else if (mode === 'forgot') {
        const result = await authService.requestPasswordReset(identifier);
        if (result.success) {
          setForgotNotice('Reset instructions sent to your email.');
        } else {
          setServerError(
            result.error ||
              'Password recovery is pending backend configuration (POST /api/v1/auth/forgot-password).'
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialClick = (provider: 'Google' | 'Apple') => {
    setServerError(null);
    setSocialNotice(
      `${provider} OAuth is not yet configured on the backend server. Please use email and password to continue.`
    );
  };

  const handleBack = () => {
    if (mode === 'forgot') {
      setMode('signin');
      resetForm();
    } else {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-[420px] rounded-[32px] overflow-hidden shadow-2xl bg-[#FAF5ED] text-[#1C1612] border border-[#E8DEC8] px-7 py-8 sm:px-8 sm:py-9 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Navigation Row: Back Arrow + Close */}
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={handleBack}
            aria-label={mode === 'forgot' ? 'Back to Sign In' : 'Close'}
            className="p-2 -ml-2 rounded-full text-[#1C1612] hover:bg-black/5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 -mr-2 rounded-full text-[#84796C] hover:text-[#1C1612] hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Brand Logo matching reference */}
        <div className="flex justify-center mb-2.5">
          <img
            src="/otd_logo.png"
            alt="OTD - Outfit of the Day"
            className="h-20 sm:h-22 w-auto object-contain select-none pointer-events-none"
          />
        </div>

        {/* Heading & Subtitle */}
        <div className="text-center mb-6">
          <h2
            id="auth-modal-title"
            className="font-playfair text-2xl sm:text-[26px] font-bold text-[#1C1612] leading-tight"
          >
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-[#6B5E51] mt-1 font-normal tracking-wide">
            {mode === 'forgot'
              ? 'Enter your email or phone to reset your password'
              : 'Your style. Every place.'}
          </p>
        </div>

        {/* Social Authentication (Google & Apple) */}
        {mode !== 'forgot' && (
          <div className="space-y-2.5 mb-5">
            {/* Google Button */}
            <button
              type="button"
              onClick={() => handleSocialClick('Google')}
              className="w-full py-2.5 sm:py-3 px-4 rounded-2xl border border-[#DECDB3] bg-[#FCF8F2] hover:bg-[#F3ECE0] text-xs sm:text-[13px] font-semibold text-[#1C1612] flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-sm hover:border-[#C4B296]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Apple Button */}
            <button
              type="button"
              onClick={() => handleSocialClick('Apple')}
              className="w-full py-2.5 sm:py-3 px-4 rounded-2xl border border-[#DECDB3] bg-[#FCF8F2] hover:bg-[#F3ECE0] text-xs sm:text-[13px] font-semibold text-[#1C1612] flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-sm hover:border-[#C4B296]"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.76 1.05-1.83.93-2.9-.9.04-2 .6-2.65 1.36-.58.67-1.09 1.76-.95 2.81 1.01.08 2.04-.51 2.67-1.27z" />
              </svg>
              <span>Continue with Apple</span>
            </button>

            {/* Horizontal "or" Divider */}
            <div className="relative pt-2 pb-1 flex items-center justify-center">
              <div className="border-t border-[#E3D6C1] w-full" />
              <span className="bg-[#FAF5ED] px-3 text-[11px] text-[#8A7C6E] font-medium lowercase">
                or
              </span>
            </div>
          </div>
        )}

        {/* Social Provider Notice Banner */}
        {socialNotice && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5 animate-in fade-in">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{socialNotice}</div>
            <button
              type="button"
              onClick={() => setSocialNotice(null)}
              className="text-amber-600 hover:text-amber-800 font-bold ml-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Server / Network Error Message Banner */}
        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{serverError}</div>
            <button
              type="button"
              onClick={() => setServerError(null)}
              className="text-rose-500 hover:text-rose-700 font-bold ml-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Informative Notice for Forgot Password */}
        {mode === 'forgot' && !serverError && (
          <div className="mb-4 p-3 rounded-xl bg-[#F0E6D5] border border-[#DFCBB2] text-[#544A40] text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#A67C1E] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Pending Backend Integration:</strong> Password reset requests will connect to <code>POST /api/v1/auth/forgot-password</code> once email and SMS dispatch services are configured.
            </p>
          </div>
        )}

        {forgotNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-snug">
            {forgotNotice}
          </div>
        )}

        {/* Main Authentication Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          {/* Sign Up: Full Name Field */}
          {mode === 'signup' && (
            <div>
              <label
                htmlFor="auth-name"
                className="block text-[11px] font-semibold text-[#544A40] mb-1 text-left"
              >
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) validate();
                }}
                onBlur={() => handleBlur('name')}
                placeholder="e.g. Eleanor Vance"
                disabled={isLoading}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FCF8F2] border text-xs sm:text-[13px] text-[#1C1612] placeholder:text-[#9E9284] outline-none transition-all ${
                  touched.name && fieldErrors.name
                    ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                    : 'border-[#DECDB3] focus:border-[#1C1612] focus:ring-1 focus:ring-[#1C1612]'
                }`}
              />
              {touched.name && fieldErrors.name && (
                <p className="text-[11px] text-rose-600 mt-1 text-left font-medium">
                  {fieldErrors.name}
                </p>
              )}
            </div>
          )}

          {/* Email or Phone Field */}
          <div>
            <label
              htmlFor="auth-identifier"
              className="block text-[11px] font-semibold text-[#544A40] mb-1 text-left"
            >
              Email or Phone
            </label>
            <input
              id="auth-identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (fieldErrors.identifier) validate();
              }}
              onBlur={() => handleBlur('identifier')}
              placeholder="you@example.com"
              disabled={isLoading}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FCF8F2] border text-xs sm:text-[13px] text-[#1C1612] placeholder:text-[#9E9284] outline-none transition-all ${
                touched.identifier && fieldErrors.identifier
                  ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                  : 'border-[#DECDB3] focus:border-[#1C1612] focus:ring-1 focus:ring-[#1C1612]'
              }`}
            />
            {touched.identifier && fieldErrors.identifier && (
              <p className="text-[11px] text-rose-600 mt-1 text-left font-medium">
                {fieldErrors.identifier}
              </p>
            )}
          </div>

          {/* Password Field (only for Sign In / Sign Up) */}
          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="auth-password"
                  className="block text-[11px] font-semibold text-[#544A40] text-left"
                >
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      resetForm();
                    }}
                    className="text-[11px] text-[#6B5E51] hover:text-[#1C1612] transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) validate();
                  }}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#FCF8F2] border text-xs sm:text-[13px] text-[#1C1612] placeholder:text-[#9E9284] outline-none transition-all tracking-normal ${
                    touched.password && fieldErrors.password
                      ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                      : 'border-[#DECDB3] focus:border-[#1C1612] focus:ring-1 focus:ring-[#1C1612]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#84796C] hover:text-[#1C1612] transition-colors cursor-pointer p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {touched.password && fieldErrors.password && (
                <p className="text-[11px] text-rose-600 mt-1 text-left font-medium">
                  {fieldErrors.password}
                </p>
              )}
            </div>
          )}

          {/* Submit CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-[#121214] hover:bg-black text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>
                    {mode === 'signin' && 'Signing In...'}
                    {mode === 'signup' && 'Creating Account...'}
                    {mode === 'forgot' && 'Submitting...'}
                  </span>
                </>
              ) : (
                <span>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Submit Request'}
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Bottom Mode Switcher */}
        <div className="text-center mt-5 pt-3 border-t border-[#E8DEC8]/60 text-xs text-[#6B5E51]">
          {mode === 'signin' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  resetForm();
                }}
                className="font-bold text-[#1C1612] hover:text-[#A67C1E] underline cursor-pointer ml-1"
              >
                Create Account
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  resetForm();
                }}
                className="font-bold text-[#1C1612] hover:text-[#A67C1E] underline cursor-pointer ml-1"
              >
                Sign In
              </button>
            </p>
          )}

          {mode === 'forgot' && (
            <p>
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  resetForm();
                }}
                className="font-bold text-[#1C1612] hover:text-[#A67C1E] underline cursor-pointer ml-1"
              >
                Back to Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <AuthModalDialog
      initialMode={initialMode}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
};
