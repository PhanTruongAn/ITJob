import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { PATH_AUTH } from "../routes/paths";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setUserLoginInfo } from "../redux/slice/accountSlice";
import Login from "../page/login";

export interface AuthGuardProp {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProp) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const access_token = localStorage.getItem("access_token");
  const sessionData = JSON.parse(localStorage.getItem("session") || "{}");
  const [requestedLocation, setRequestedLocation] = useState<string | null>(
    null
  );
  const user = sessionData.user;
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  useEffect(() => {
    if (access_token && sessionData) {
      dispatch(setUserLoginInfo(user));
    } else {
      navigate(PATH_AUTH.login, { replace: true, state: { from: pathname } });
    }
  }, []);

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }
  return <>{children}</>;
}
