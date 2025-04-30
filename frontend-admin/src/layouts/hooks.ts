import { message } from "antd";
import { logout } from "../apis/authModule";
import CustomHooks from "../common/hooks/CustomHooks";
import { PATH_AUTH } from "../routes/paths";

export const useLogout = () => {
  return CustomHooks.useMutation(logout, {
    onSuccess: (res) => {
      if (res && res.statusCode === 200) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("session");
        message.success("Logout successfully!");
        setTimeout(() => {
          window.location.href = PATH_AUTH.login;
        }, 1000);
      } else {
        message.error("Logout failed!");
      }
    },
    onError: (error) => {
      console.error("Logout error: ", error);
    },
  });
};
