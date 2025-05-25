import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const ProtectedRoute = ({ children }) => {
  const { accessToken, username, isInitializing } = useAuth();

  // Debug logs
  console.log("ProtectedRoute - Access Token:", accessToken);
  console.log("ProtectedRoute - Username:", username);
  console.log("ProtectedRoute - Is Initializing:", isInitializing);

  // Show loading while auth is being initialized
  if (isInitializing) {
    console.log("ProtectedRoute - Still initializing auth state");
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!accessToken || !username) {
    console.log("ProtectedRoute - Redirecting to login because auth is incomplete.");
    console.log("ProtectedRoute - Auth state:", { accessToken: !!accessToken, username });
    return <Navigate to="/login" replace />;
  }

  console.log("ProtectedRoute - Access granted. Rendering child component.");
  return children;
};

export default ProtectedRoute;