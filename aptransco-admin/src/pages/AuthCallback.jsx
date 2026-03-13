import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/authService';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get('code');

  useEffect(() => {
    if (code) {
      authService.handleCallback(code).
      then(() => navigate('/dashboard')).
      catch((err) => {
        console.error(err);
        navigate('/login');
      });
    }
  }, [code, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Authenticating with APTRANSCO...</p>
      </div>
    </div>);

};

export default AuthCallback;