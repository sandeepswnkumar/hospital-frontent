import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Offline() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState('');

  const handleRetry = () => {
    setIsRetrying(true);
    setError('');

    setTimeout(() => {
      setIsRetrying(false);
      if (navigator.onLine) {
        // Retrieve redirect path from query param or fallback to root
        const redirect = searchParams.get('redirect') || '/';
        navigate(decodeURIComponent(redirect), { replace: true });
      } else {
        setError('Still offline. Please check your internet connection and try again.');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#191c24] p-4 transition-colors">
      <div className="bg-white dark:bg-[#1f222b] p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800/80 text-center max-w-sm w-full animate-fade-in flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center mb-6 shadow-sm">
          <WifiOff className="size-8 stroke-[1.5]" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No Internet Connection</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          You are currently offline. Please check your connection and try again to restore access.
        </p>
        {error && (
          <div className="w-full text-xs text-red-500 mb-4 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}
        <Button
          onClick={handleRetry}
          disabled={isRetrying}
          className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 px-5 text-sm"
        >
          {isRetrying ? (
            <>
              <RefreshCw className="size-4 animate-spin" />
              Retrying...
            </>
          ) : (
            'Retry Connection'
          )}
        </Button>
      </div>
    </div>
  );
}
