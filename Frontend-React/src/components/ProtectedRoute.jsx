import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element, role }) => {
  const auth = useSelector((state) => state.auth);

  if (!auth.user) return <Navigate to="/signin" />;

  if (role && auth.user.role !== role) return <Navigate to="/unauthorized" />;

  return element;
};

export default ProtectedRoute;
