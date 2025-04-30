import React from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import type { DropdownProps } from "antd/es/dropdown";

interface CustomDropdownProps extends DropdownProps {
  items: MenuProps["items"];
  triggerNode: React.ReactNode;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  items,
  triggerNode,
  placement = "bottomLeft",
  ...rest
}) => {
  const menuProps = { items };

  return (
    <Dropdown
      menu={menuProps}
      placement={placement}
      {...rest}
      trigger={["click"]}
    >
      <span style={{ cursor: "pointer" }}>{triggerNode}</span>
    </Dropdown>
  );
};

export default CustomDropdown;
