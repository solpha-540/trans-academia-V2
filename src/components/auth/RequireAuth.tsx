import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';
import { toast } from 'react-toastify';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  const isAuthenticate = isAuthenticated();

  useEffect(() => {
    if (!isAuthenticate) {
      // Afficher un message d'erreur clair sans déclencher la déconnexion
      if (!location.pathname.includes('login') && !location.pathname.includes('admin')) {
        toast.info('Veuillez vous connecter pour accéder à cette page', {
          toastId: 'auth-required',
          autoClose: 3000,
        });
      }
    }
  }, [location.pathname, isAuthenticate]);

  if (!isAuthenticate) {
    // Rediriger vers la page de connexion avec l'URL actuelle sauvegardée
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
