import { Navigate, Outlet } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import Loading from "./Loading";

function ProtectedRoute() {
  const { data, isLoading } = useAuthUser();

  if (isLoading) {
    return <Loading />;
  }
  const isAuth = !!data?.user;
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in but hasn't completed onboarding
  if (!data.user.isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
