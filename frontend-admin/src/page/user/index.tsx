import React, { useState } from "react";
import { Button, message, Space, Table, theme } from "antd";
import "./style.css";
import { userColumns } from "./components/table/UserColumns";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { createUser, deleteUser, fetchUsers } from "../../apis/userModule";
import { useUserListState } from "./common/hooks";
import CustomHooks from "../../common/hooks/CustomHooks";
import { IBackendRes, IUser } from "../../types/backend";
import { UserListHeaderToolbar } from "./components/UserListHeaderToolbar";
import CreateUserModal from "./components/create/CreateUserModal";
import { ICreateUser } from "./common/interface";
import CustomGlobalTable from "../../components/table";
import ConfirmModal from "../../components/modal/ConfirmModal";

const User: React.FC = () => {
  const { token } = theme.useToken();
  const { state, updateState } = useUserListState();

  const [loading, setLoading] = useState(false);

  const handleOk = async (values: ICreateUser) => {
    const result = await createUser(values);
    if (result?.statusCode !== 201) {
      message.error("Lỗi khi tạo người dùng");
    } else {
      refetch();
      message.success("Tạo người dùng thành công");
      updateState({ visibleCreateModal: false });
    }
  };
  const handleDelete = async () => {
    const result = await deleteUser({ id: state.selectedUserId! });
    if (result?.statusCode !== 200) {
      message.error("Lỗi khi xóa người dùng");
    } else {
      refetch();
      message.success("Xóa người dùng thành công");
      updateState({ visibleCreateModal: false });
    }
    updateState({
      visibleDeleteModal: false,
      selectedUserId: null,
    });
  };

  const fetchDataUser = async (): Promise<IBackendRes<IUser[]>> => {
    const res = await fetchUsers({
      page: state.page,
      pageSize: state.pageSize,
      sort: state.sortBy,
    });
    if (res?.statusCode !== 200) {
      message.error(res?.message || "Lỗi khi lấy danh sách người dùng");
    } else {
      updateState({ total: res.data.meta.total });
    }
    return res;
  };

  const { data, refetch } = CustomHooks.useQuery<IBackendRes<IUser[]>>(
    ["users", state.page, state.pageSize, state.sortBy],
    fetchDataUser
  );

  const handleRefresh = async () => {
    refetch();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Refresh success");
    }, 1000);
  };
  const handleTableChange = (
    page: number,
    pageSize: number,
    sortBy?: string
  ) => {
    updateState({ page, pageSize, sortBy });
  };
  const confirmDeleteUser = (id: number) => {
    updateState({ visibleDeleteModal: true, selectedUserId: id });
  };
  const listStyle: React.CSSProperties = {
    display: "flex",
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    marginTop: 13,
    flexDirection: "column",
  };
  return (
    <div className="container">
      <CreateUserModal
        open={state.visibleCreateModal}
        onSubmit={handleOk}
        onCancel={() => updateState({ visibleCreateModal: false })}
      />
      <ConfirmModal
        content="Are you sure you want to delete this user?"
        visible={state.visibleDeleteModal}
        type="warning"
        onOk={handleDelete}
        onCancel={() => updateState({ visibleDeleteModal: false })}
        title="Confirm user deletion"
      />
      <UserListHeaderToolbar />
      <div style={listStyle}>
        <div className="header-container">
          List users
          <Space className="table-button-group">
            <Button
              type="primary"
              icon={<PlusOutlined style={{ fontSize: "16px" }} />}
              onClick={() => updateState({ visibleCreateModal: true })}
            >
              Add User
            </Button>
            <Button
              color="cyan"
              variant="outlined"
              onClick={handleRefresh}
              loading={loading}
              icon={<ReloadOutlined style={{ fontSize: "16px" }} />}
            >
              Refresh
            </Button>
          </Space>
        </div>
        <div className="table-container">
          <CustomGlobalTable<IUser>
            columns={userColumns({
              onView: (record) => {
                console.log("View", record);
              },
              onEdit: (record) => {
                console.log("Edit", record);
              },
              onDelete: (record) => {
                confirmDeleteUser(record);
              },
            })}
            data={data?.data?.result || []}
            loading={loading}
            total={state.total}
            page={state.page}
            pageSize={state.pageSize}
            onTableChange={handleTableChange}
          />
        </div>
      </div>
    </div>
  );
};

export default User;
