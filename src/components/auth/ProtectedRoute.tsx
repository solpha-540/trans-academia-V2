import { ReactElement, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';
import { toast } from 'react-toastify';

interface ProtectedRouteProps {
  children: ReactElement;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuth = isAuthenticated();

  useEffect(() => {
    if (!isAuth) {
      // Afficher un message d'erreur sans rediriger
      if (!location.pathname.includes('login') && !location.pathname.includes('admin')) {
        toast.error('Accès refusé : Veuillez vous connecter pour accéder à cette page', {
          toastId: 'auth-required',
          autoClose: 3000,
          theme: 'colored',
          style: { backgroundColor: '#f8d7da', color: '#842029' }
        });
      }
    }
  }, [location.pathname, isAuth]);

  if (!isAuth) {
    return (
      <Navigate
        to={`${import.meta.env.BASE_URL}`}
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
}
