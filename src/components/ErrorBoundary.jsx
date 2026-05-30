import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    // Clear credentials and force reload from root
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#191c24] p-4 transition-colors">
          <div className="bg-white dark:bg-[#1f222b] p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800/80 text-center max-w-md w-full animate-fade-in flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center mb-6 shadow-sm">
              <AlertTriangle className="size-8 stroke-[1.5]" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Something went wrong</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              An unexpected application crash or render error occurred.
            </p>
            <div className="w-full text-left bg-slate-50 dark:bg-black/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800/85 mb-6 max-h-36 overflow-y-auto">
              <code className="text-xs text-red-500 dark:text-red-400 font-mono break-all leading-relaxed whitespace-pre-wrap">
                {this.state.error?.stack || this.state.error?.toString() || 'Unknown Error'}
              </code>
            </div>
            <Button
              onClick={this.handleReset}
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 px-5 text-sm"
            >
              <RotateCcw className="size-4" />
              Reset App & Go Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
