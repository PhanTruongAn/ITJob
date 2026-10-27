import type { MenuProps } from "antd";

export const getDropdownItems = (
  onChangePassword?: () => void,
  onChangeInformation?: () => void,
  onLogout?: () => void,
  labels?: { changePassword: string; profile: string; logout: string },
): MenuProps["items"] => [
  {
    key: "change-password",
    label: labels?.changePassword ?? "Đổi mật khẩu",
    onClick: onChangePassword,
  },
  //   {
  //     type: "divider",
  //   },
  {
    key: "information",
    label: labels?.profile ?? "Thông tin cá nhân",
    onClick: onChangeInformation,
  },
  {
    key: "logout",
    label: labels?.logout ?? "Đăng xuất",
    onClick: onLogout,
  },
];
