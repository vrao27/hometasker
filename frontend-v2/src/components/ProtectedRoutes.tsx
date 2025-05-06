import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: JSX.Element; //restricts the type of children to a single JSX element
    //children: React.ReactNode; // Allows any valid React node (string, number, element, fragment, etc.)
    // This is more flexible than just JSX.Element, which is a single React element.
    // This is useful for allowing multiple children or different types of children.
    // If you want to restrict it to a single element, you can use JSX.Element instead. 
  }

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem('token'); // Get token from local storage

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/" replace />; //use replace to prevent redirect history in browser - prevents the protected URL from remaining in your history,
    }

    // If token exists, render the children (protected component)
    return children;
};

export default ProtectedRoute;
