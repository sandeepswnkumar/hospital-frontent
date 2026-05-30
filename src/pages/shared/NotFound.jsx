import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // If we have history, go back; otherwise go to root
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#191c24] p-4 transition-colors">
      <div className="bg-white dark:bg-[#1f222b] p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800/80 text-center max-w-md w-full animate-fade-in flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 shadow-sm">
          <AlertCircle className="size-8 stroke-[1.5]" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-850 dark:text-slate-200 mb-2">Page Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="w-full sm:w-auto border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 gap-2 flex items-center justify-center h-10 px-5 text-sm"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
          <Button
            onClick={handleGoHome}
            className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-primary-foreground font-semibold gap-2 flex items-center justify-center h-10 px-5 text-sm"
          >
            <Home className="size-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
