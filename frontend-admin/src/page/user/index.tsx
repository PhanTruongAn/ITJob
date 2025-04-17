import React, { useState } from "react";
import { message, theme } from "antd";
import "./style.css";
import { userColumns } from "./components/table/UserColumns";

import {
  deleteUser,
  editUser,
  fetchUsers,
  getUserById,
} from "../../apis/userModule";
import { useUserListState } from "./common/hooks";
import CustomHooks from "../../common/hooks/CustomHooks";
import { IBackendPaginateRes, IUser } from "../../types/backend";
import { UserListHeaderToolbar } from "./components/UserListToolbar";
import CreateUserModal from "./components/create/CreateUserModal";
import { ICreateUser, IEditUser } from "./common/interface";
import CustomGlobalTable from "../../components/table";
import ConfirmModal from "../../components/modal/ConfirmModal";
import UserListHeader from "./components/UserListHeader";
import EditUserModal from "./components/edit/EditUserModal";
import { useCreateUser, useDeleteUser, useEditUser } from "./common/services";

const User: React.FC = () => {
  const { token } = theme.useToken();
  const { state, updateState } = useUserListState();
  const [loading, setLoading] = useState(false);
  const { mutate: createMutate, isPending: isCreate } = useCreateUser();
  const { mutate: deleteMutate, isPending: isDelete } = useDeleteUser();
  const { mutate: editMutate, isPending: isEdit } = useEditUser();
  const handleOk = (values: ICreateUser) => {
    createMutate(values, {
      onSuccess: (res) => {
        if (res.statusCode >= 400) {
          message.error(res.error);
        } else {
          refetch();
          message.success(res.message);
          updateState({ visibleCreateModal: false });
        }
      },
      onError: () => {
        message.error("Error when create user");
      },
    });
  };
  const handleSubmitEditUser = (values: IEditUser) => {
    editMutate(values, {
      onSuccess: (res) => {
        if (res?.statusCode >= 400) {
          message.error(res.error);
        } else {
          refetch();
          message.success(res.message);
          updateState({ visibleEditModal: false, selectedUser: undefined });
        }
      },
      onError: () => {
        message.error("Error when edit user");
      },
    });
  };
  const handleDelete = () => {
    deleteMutate(
      { id: state.selectedUserId! },
      {
        onSuccess: async (result) => {
          const updatedData = await refetch();
          const resultLength = updatedData?.data?.data?.result?.length ?? 0;

          if (resultLength === 0 && state.page > 1) {
            updateState({ page: state.page - 1 });
          }

          message.success(result.message);
          updateState({
            visibleDeleteModal: false,
            selectedUserId: null,
          });
        },
        onError: () => {
          message.error("Error when deleted user");
          updateState({
            visibleDeleteModal: false,
            selectedUserId: null,
          });
        },
      }
    );
  };

  const handleFilter = (filters: { name?: string; phone?: string }) => {
    updateState({
      filterName: filters.name || null,
      filterPhone: filters.phone || null,
      page: 1,
    });
  };

  const handleClearFilter = () => {
    updateState({
      filterName: null,
      filterPhone: null,
      page: 1,
    });
  };
  const fetchDataUser = async (): Promise<IBackendPaginateRes<IUser[]>> => {
    const res = await fetchUsers({
      page: state.page,
      pageSize: state.pageSize,
      sort: state.sortBy,
      phone: state.filterPhone || null,
      name: state.filterName || null,
    });
    if (res?.statusCode >= 400) {
      message.error(res?.error);
    } else {
      updateState({ total: res.data.meta.total });
    }
    return res;
  };
  const { data, refetch } = CustomHooks.useQuery<IBackendPaginateRes<IUser[]>>(
    [
      "users",
      state.page,
      state.pageSize,
      state.sortBy,
      state.filterName,
      state.filterPhone,
    ],
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
        loading={isEdit}
        onSubmit={handleSubmitEditUser}
        open={state.visibleEditModal}
        option={state.typeModal}
        record={state.selectedUser}
        onCancel={() =>
          updateState({ visibleEditModal: false, selectedUser: undefined })
        }
      />
      <CreateUserModal
        loading={isCreate}
        open={state.visibleCreateModal}
        onSubmit={handleOk}
        onCancel={() => updateState({ visibleCreateModal: false })}
      />
      <ConfirmModal
        content="Are you sure you want to delete this user?"
        visible={state.visibleDeleteModal}
        type="warning"
        onOk={handleDelete}
        loading={isDelete}
        onCancel={() => updateState({ visibleDeleteModal: false })}
        title="Confirm user deletion"
      />
      <UserListHeaderToolbar
        onFilter={handleFilter}
        onClear={handleClearFilter}
      />
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
