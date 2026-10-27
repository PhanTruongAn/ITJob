import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { logout } from "../apis/authModule";
import CustomHooks from "../common/hooks/CustomHooks";
import { useAppDispatch } from "../redux/hooks";
import { setLogoutAction } from "../redux/slice/accountSlice";
import { PATH_AUTH } from "../routes/paths";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const finishLogout = () => {
    dispatch(setLogoutAction());
    navigate(PATH_AUTH.login, { replace: true });
  };

  return CustomHooks.useMutation(logout, {
    onSuccess: (res) => {
      if (res && res.statusCode === 200) {
        message.success("Logout successfully!");
      } else {
        message.error("Logout failed!");
      }
      finishLogout();
    },
    onError: () => {
      // Clear the local session even if the token expired or logout is unreachable.
      finishLogout();
    },
  });
};
