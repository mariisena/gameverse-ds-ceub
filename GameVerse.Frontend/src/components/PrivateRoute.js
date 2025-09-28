// ../components/PrivateRoute.js
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return user 
    ? <Outlet /> 
    : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
