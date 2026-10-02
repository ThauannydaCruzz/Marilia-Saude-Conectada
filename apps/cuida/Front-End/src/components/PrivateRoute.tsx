import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const id = localStorage.getItem('id'); // sessão sem JWT — só o id do cliente

  if (!id) {
    // se não tiver sessão, redireciona para login
    return <Navigate to="/" replace />;
  }

  // se tiver sessão, permite acesso à rota
  return children;
};

export default PrivateRoute;
