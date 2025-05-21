import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "../../../apis/authModule";
import CustomHooks from "../../../common/hooks/CustomHooks";
import { useAppDispatch } from "../../../redux/hooks";
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
            message.success(res.message);
          }
        },
        onError: (error: any) => {
          message.error(error);
        },
      }
    ),
  };
};
