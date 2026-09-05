import { Navigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Spinner } from "../../common/Spinner";
export default function PrivateRoute({ children, roles = [] }) {
  const { user, checked } = useAuth();

  if (!checked) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
