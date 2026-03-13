import { Navigate } from "react-router-dom";
import { useAuth } from "../services/useAuth";

export default function ProtectedRoute({ children }) {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}