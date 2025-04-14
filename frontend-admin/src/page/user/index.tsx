import React, { useState } from "react";
import { message, theme } from "antd";
import "./style.css";
import { userColumns } from "./components/table/UserColumns";

import {
  createUser,
  deleteUser,
  editUser,
  fetchUsers,
  getUserById,
} from "../../apis/userModule";
import { useUserListState } from "./common/hooks";
import CustomHooks from "../../common/hooks/CustomHooks";
import { IBackendPaginateRes, IBackendRes, IUser } from "../../types/backend";
import { UserListHeaderToolbar } from "./components/UserListToolbar";
import CreateUserModal from "./components/create/CreateUserModal";
import { ICreateUser, IEditUser } from "./common/interface";
import CustomGlobalTable from "../../components/table";
import ConfirmModal from "../../components/modal/ConfirmModal";
import UserListHeader from "./components/UserListHeader";
import EditUserModal from "./components/edit/EditUserModal";

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
  const handleSubmitEditUser = async (values: IEditUser) => {
    const result = await editUser(values);
    if (result?.statusCode !== 200) {
      message.error(result.error);
    } else {
      refetch();
      message.success(result.message);
      updateState({ visibleEditModal: false, selectedUser: undefined });
    }
  };
  const handleDelete = async () => {
    const result = await deleteUser({ id: state.selectedUserId! });
    if (result?.statusCode !== 200) {
      message.error("Failed to delete user");
    } else {
      const updatedData = await refetch();
      const resultLength = updatedData?.data?.data?.result?.length ?? 0;

      if (resultLength === 0 && state.page > 1) {
        updateState({ page: state.page - 1 });
      }
      message.success("User deleted successfully");
    }

    updateState({
      visibleDeleteModal: false,
      selectedUserId: null,
    });
  };

  const fetchDataUser = async (): Promise<IBackendPaginateRes<IUser[]>> => {
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

  const { data, refetch } = CustomHooks.useQuery<IBackendPaginateRes<IUser[]>>(
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

  const handleViewUser = (record: IUser) => {
    updateState({
      visibleEditModal: true,
      selectedUser: record,
      typeModal: "view",
    });
  };
  const handleEditUser = async (record: IUser) => {
    const result = await getUserById({ id: record.id });
    if (result?.statusCode !== 200) {
      message.error(result.message);
    }
    updateState({
      visibleEditModal: true,
      selectedUser: result.data,
      typeModal: "edit",
    });
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
      <UserListHeader
        onAddUser={() => updateState({ visibleCreateModal: true })}
        onRefresh={handleRefresh}
        loading={loading}
      />
      <EditUserModal
        onSubmit={handleSubmitEditUser}
        open={state.visibleEditModal}
        option={state.typeModal}
        record={state.selectedUser}
        onCancel={() =>
          updateState({ visibleEditModal: false, selectedUser: undefined })
        }
      />
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
        <div className="header-container"></div>
        <div className="table-container">
          <CustomGlobalTable<IUser>
            columns={userColumns({
              onView: (record) => {
                handleViewUser(record);
              },
              onEdit: (record) => {
                handleEditUser(record);
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
