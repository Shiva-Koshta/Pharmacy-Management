import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, checkAuthStatus } = useUser();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!authChecked) {
        await checkAuthStatus();
        setAuthChecked(true);
      }
    };

    verifyAuth();
  }, [checkAuthStatus, authChecked]);

  // Reset authChecked when location changes to re-verify authentication
  useEffect(() => {
    setAuthChecked(false);
  }, [location.pathname]);

  if (loading || !authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
