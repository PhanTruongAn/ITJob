import type { MenuProps } from "antd";

export const getDropdownItems = (
  onChangePassword?: () => void,
  onChangeInformation?: () => void,
  onLogout?: () => void
): MenuProps["items"] => [
  {
    key: "change-password",
    label: "Đổi mật khẩu",
    onClick: onChangePassword,
  },
  //   {
  //     type: "divider",
  //   },
  {
    key: "information",
    label: "Thông tin cá nhân",
    onClick: onChangeInformation,
  },
  {
    key: "logout",
    label: "Đăng xuất",
    onClick: onLogout,
  },
];
