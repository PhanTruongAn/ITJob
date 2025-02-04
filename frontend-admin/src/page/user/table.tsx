import { Button, Space, TableColumnsType } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
export interface IDataType {
  key: React.Key;
  name: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
export const columns: TableColumnsType<IDataType> = [
  {
    title: "Name",
    dataIndex: "name",
    ellipsis: true,
  },

  {
    title: "Address",
    dataIndex: "address",
    ellipsis: true,
  },
  {
    title: "CreatedAt",
    dataIndex: "createdAt",
    ellipsis: true,
    render: (text) => new Date(text).toLocaleDateString(),
  },
  {
    title: "UpdatedAt",
    dataIndex: "updatedAt",
    ellipsis: true,
    render: (text) => new Date(text).toLocaleDateString(),
  },
  {
    title: "Option",
    ellipsis: true,
    render: (record) => (
      <Space>
        <Button
          key={`edit-${record.key}`}
          color="orange"
          variant="link"
          icon={<EditOutlined style={{ fontSize: "16px" }} />}
          style={{ outline: "none", border: "none" }}
        />
        <Button
          key={`delete-${record.key}`}
          color="danger"
          variant="link"
          icon={<DeleteOutlined style={{ fontSize: "16px" }} />}
          style={{ outline: "none", border: "none" }}
        />
      </Space>
    ),
  },
];

export const data: IDataType[] = [
  {
    key: 1,
    name: "John Doe",
    address: "123 Main St, Springfield, USA",
    createdAt: new Date("2023-01-15T10:00:00Z"),
    updatedAt: new Date("2023-02-01T12:00:00Z"),
  },
  {
    key: 2,
    name: "Jane Smith",
    address: "456 Elm St, Metropolis, USA",
    createdAt: new Date("2023-01-20T11:30:00Z"),
    updatedAt: new Date("2023-02-05T09:15:00Z"),
  },
  {
    key: 3,
    name: "Alice Johnson",
    address: "789 Oak St, Gotham, USA",
    createdAt: new Date("2023-01-25T14:45:00Z"),
    updatedAt: new Date("2023-02-10T08:30:00Z"),
  },
];
