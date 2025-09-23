import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute({ children }) {
  const { user, booting } = useAuth();
  const location = useLocation();

  //if app still loading
  if (booting) return <div className="container">Loading...</div>;

  // not logged in → go to login, keep the original destination for later
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  // logged in → render the protected element
  return children;
}
export default ProtectedRoute;
