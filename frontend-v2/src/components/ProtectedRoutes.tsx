import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    //children: JSX.Element; //causing an error - too restrictive in child types
    children: React.ReactNode; //using this as it want to accept all possible child types - strings, numbers, boolean etc
  }

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem('token'); // Get token from local storage

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />; //use replace to prevent redirect history in browser - prevents the protected URL from remaining in your history,
    }

    // If token exists, render the children (protected component)
    return children;
};

export default ProtectedRoute;
