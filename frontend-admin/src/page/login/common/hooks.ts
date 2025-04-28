import { useNavigate } from "react-router-dom";
import CustomHooks from "../../../common/hooks/CustomHooks";
import { login } from "../../../apis/authModule";
import { PATH_AUTH } from "../../../routes/paths";
import { useAppDispatch } from "../../../redux/hooks";
import { message, notification } from "antd";
import { setUserLoginInfo } from "../../../redux/slice/accountSlice";

export const useAuthLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return {
    ...CustomHooks.useMutation(
      ({ username, password }: { username: string; password: string }) =>
        login(username, password),
      {
        onSuccess: (res) => {
          if (res && res.data && res.statusCode === 200) {
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem(
              "session",
              JSON.stringify({
                user: res.data.user,
              })
            );
            dispatch(setUserLoginInfo(res.data.user));
            message.success("Login successfully!");
          } else {
            notification.error({
              message: "Login failed!",
              description: Array.isArray(res.message)
                ? res.message[0]
                : res.message,
              duration: 5,
            });
          }
        },
        onError: (error) => {
          console.error("Login error: ", error);
          navigate(PATH_AUTH.login, { replace: true });
        },
      }
    ),
  };
};
