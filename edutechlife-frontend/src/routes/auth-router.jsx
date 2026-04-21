import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * AuthRouter simplificado - Redirecciona a IA Lab
 * Mantenido para compatibilidad con enlaces existentes
 */
const AuthRouter = () => {
  // Redirección directa a IA Lab (protegido por RoleProtectedRoute)
  return <Navigate to="/ialab" replace />;
};

export default AuthRouter;