import { ReactNode, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { isEmpty } from "lodash";
import { useLocation, useNavigate } from "react-router-dom";
import { isValidToken } from "../util/jwt";
import { PATH_AUTH } from "../routes/paths";

export interface AuthGuardProp {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProp) {
  const dispatch = useAppDispatch();
  const authData = useAppSelector((state) => state.account);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    const checkIsAuth = async () => {
      if (access_token && !isValidToken(access_token.toString())) {
        localStorage.removeItem("access_token");
        navigate(PATH_AUTH.login, { state: { from: pathname } });
        return;
      } else if (!access_token) {
        navigate(PATH_AUTH.login, { state: { from: pathname } });
        return;
      }
    };
    checkIsAuth();
  }, []);

  return <>{children}</>;
}
