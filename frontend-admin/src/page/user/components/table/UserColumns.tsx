import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Tag } from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import { IUser } from "../../../../types/backend";

export const userColumns = ({
  onView,
  onEdit,
  onDelete,
}: {
  onView?: (user: IUser) => void;
  onEdit?: (user: IUser) => void;
  onDelete?: (id: number) => void;
}): TableColumnsType<IUser> => [
  {
    title: "ID",
    dataIndex: "id",
    ellipsis: true,
    width: "5%",
    sorter: true,
  },
  {
    title: "Name",
    dataIndex: "name",
    width: "20%",
    ellipsis: true,
    sorter: true,
  },
  {
    title: "Phone",
    dataIndex: "phone",
    width: "10%",
    ellipsis: true,
    sorter: true,
  },
  {
    title: "Address",
    dataIndex: "address",
    ellipsis: true,
  },
  {
    title: "Dob",
    dataIndex: "dob",
    width: "10%",
    ellipsis: true,
    render: (text: string | null) =>
      text ? dayjs(text).format("DD/MM/YYYY") : "",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    width: "10%",
    ellipsis: true,
    render: (gender: string) => {
      let color = "default";
      if (gender === "MALE") color = "blue";
      else if (gender === "FEMALE") color = "magenta";
      return <Tag color={color}>{gender}</Tag>;
    },
  },
  {
    title: "CreatedAt",
    dataIndex: "createdAt",
    width: "10%",
    sorter: true,
    ellipsis: true,
    render: (text: string | null) =>
      text ? dayjs(text).format("DD/MM/YYYY") : "",
  },
  {
    title: "Option",
    width: 80,
    render: (record) => {
      const menu = {
        items: [
          {
            key: "view",
            icon: <EyeOutlined />,
            label: "View detail",
          },
          {
            key: "edit",
            icon: <EditOutlined />,
            label: "Edit",
          },
          {
            key: "delete",
            icon: <DeleteOutlined />,
            label: "Delete",
            danger: true,
          },
        ],
        onClick: ({ key }: { key: string }) => {
          if (key === "view") onView?.(record);
          else if (key === "edit") onEdit?.(record);
          else if (key === "delete") onDelete?.(record.id);
        },
      };

      return (
        <Dropdown menu={menu} trigger={["click"]}>
          <Button
            shape="circle"
            icon={<EllipsisOutlined />}
            style={{ border: "none", outline: "none" }}
          />
        </Dropdown>
      );
    },
  },
];
