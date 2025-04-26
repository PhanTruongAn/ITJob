import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PATH_AUTH } from "../routes/paths";

export interface AuthGuardProp {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProp) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!access_token) {
      navigate(PATH_AUTH.login, { replace: true, state: { from: pathname } });
    }
  }, [access_token, navigate, pathname]);

  if (!access_token) {
    return null;
  }

  return <>{children}</>;
}
