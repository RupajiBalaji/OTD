import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  tabName?: string;
  onResetToHome?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class StudioErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`[StudioErrorBoundary] Uncaught exception in ${this.props.tabName || 'Studio Tab'}:`, error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-8 sm:p-12 max-w-2xl mx-auto w-full my-12">
          <div className="glass-card rounded-3xl p-8 sm:p-10 border border-amber-500/30 text-center shadow-2xl relative overflow-hidden bg-[var(--bg-card)]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-[var(--gold-primary)] to-amber-500" />
            
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-6 shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-amber-500 font-semibold block mb-2">
              ATELIER RUNTIME ANOMALY
            </span>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[var(--text-heading)] mb-3">
              Unable to Render {this.props.tabName ? `"${this.props.tabName}"` : 'This View'}
            </h3>

            <p className="text-xs sm:text-sm text-[var(--text-body)] mb-6 font-light leading-relaxed max-w-md mx-auto">
              An unexpected error occurred while computing styling recommendations or loading assets for this studio module. Your wardrobe data remains safe.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-left">
                <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">Diagnostic Detail:</div>
                <div className="text-xs font-mono text-amber-600 dark:text-amber-400 break-words line-clamp-2">
                  {this.state.error.message || 'Unknown runtime error'}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleRetry}
                className="gold-btn w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload View</span>
              </button>

              {this.props.onResetToHome && (
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    this.props.onResetToHome?.();
                  }}
                  className="gold-btn-outline w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Return to Home Atelier</span>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
