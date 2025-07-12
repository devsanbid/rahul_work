import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthRedirect = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    const roleRedirects = {
      admin: '/admin/dashboard',
      developer: '/developer/dashboard',
      user: '/user/dashboard'
    };
    
    return <Navigate to={roleRedirects[user.role] || '/user/dashboard'} replace />;
  }

  return children;
};

export default AuthRedirect;