import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Navigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export default function OpenRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}
