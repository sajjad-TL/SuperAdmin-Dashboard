// src/components/PublicRoute.jsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const PublicRoute = ({ children }) => {
    const authenticated = isAuthenticated();

    if (authenticated) {
        // Redirect to admin if user is already logged in
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default PublicRoute;
