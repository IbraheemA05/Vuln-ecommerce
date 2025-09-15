import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const { Navigate } = ReactRouterDOM;

    if (!user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them along to that page after they login.
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
