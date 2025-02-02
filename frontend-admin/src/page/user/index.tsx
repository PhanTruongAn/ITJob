import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Button } from "antd";
import { useRef } from "react";
import DataTable from "../../components/table";
export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

type User = {
  id: number;
  name: string;
  address: string;
  created_at: Date;
  updated_at: Date;
};

const columns: ProColumns<User>[] = [
  {
    title: "Id",
    dataIndex: "id",
    valueType: "indexBorder",
    width: 48,
    hideInSearch: true,
  },
  {
    title: "Name",
    dataIndex: "name",
    copyable: true,
    ellipsis: true,
  },
  {
    title: "Address",
    dataIndex: "address",
    copyable: true,
    ellipsis: true,
  },
  {
    title: "CreatedAt",
    dataIndex: "created_at",
    copyable: true,
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: "UpdatedAt",
    dataIndex: "updated_at",
    copyable: true,
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: "Option",
    valueType: "option",
    key: "option",
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        Edit
      </a>,

      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: "copy", name: "Copy" },
          { key: "delete", name: "Delete" },
        ]}
      />,
    ],
  },
];

const User: React.FC = () => {
  const actionRef = useRef<ActionType>();

  return (
    <DataTable<User>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      // editable={{
      //   type: "multiple",
      // }}
      scroll={{ x: true }}
      rowKey="id"
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      headerTitle="List User"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          type="primary"
          style={{ outline: "none" }}
        >
          Add new
        </Button>,
      ]}
    />
  );
};
export default User;
