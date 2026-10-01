import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, ShieldCheck } from 'lucide-react';
import { StorageService } from '../services/storage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught clinical error boundary:', error, errorInfo);
  }

  private handleReset = () => {
    StorageService.resetAllData();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-stone-900">
          <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 p-8 shadow-xl text-center space-y-5">
            <div className="w-14 h-14 bg-rose-100 text-rose-800 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h2 className="font-serif-display text-2xl font-bold text-stone-900">
                Application Recovery Console
              </h2>
              <p className="text-xs text-stone-600 mt-2">
                An unexpected interface state occurred. Your encrypted records are preserved. You can reset local state to clinical defaults and resume instantly without a blank screen.
              </p>
              {this.state.error && (
                <div className="mt-3 p-3 bg-stone-100 rounded-lg text-left text-[11px] font-mono text-stone-700 overflow-x-auto max-h-28">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs"
              >
                Refresh Application
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Clinical Defaults</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
