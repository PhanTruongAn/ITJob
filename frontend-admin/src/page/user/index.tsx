import { message, theme } from "antd"
import React from "react"
import { userColumns } from "./components/table/UserColumns"
import "./style.css"

import { fetchRoles } from "../../apis/roleModule"
import { fetchUsers, getUserById } from "../../apis/userModule"
import CustomHooks from "../../common/hooks/CustomHooks"
import ConfirmModal from "../../components/modal/ConfirmModal"
import CustomGlobalTable from "../../components/table"
import { IBackendPaginateRes, IRole, IUser } from "../../types/backend"
import {
  useCreateUser,
  useDeleteUser,
  useEditUser,
  useUserListState,
} from "./common/hooks"
import { ICreateUser, IEditUser } from "./common/interface"
import UserListHeader from "./components/UserListHeader"
import { UserListHeaderToolbar } from "./components/UserListToolbar"
import CreateUserModal from "./components/create/CreateUserModal"
import EditUserModal from "./components/edit/EditUserModal"

import useRefresh from "../../common/hooks/useRefresh"
import { QUERY_KEYS } from "../../common/queryKeys"
import { useAppSelector } from "../../redux/hooks"
import axios from "axios"

const User: React.FC = () => {
  const { token } = theme.useToken()
  const { state, updateState } = useUserListState()
  const currentRoleName = useAppSelector(
    (state) => state.account.user.role?.name ?? "",
  )
  const { mutate: createMutate, isPending: isCreate } = useCreateUser()
  const { mutate: deleteMutate, isPending: isDelete } = useDeleteUser()
  const { mutate: editMutate, isPending: isEdit } = useEditUser()
  const {
    data: roleResponse,
    isLoading: isLoadingRoles,
    isError: isRolesError,
    refetch: refetchRoles,
  } = CustomHooks.useQuery<IBackendPaginateRes<IRole[]>>(
    [QUERY_KEYS.ROLE_MODULE, "user-create-options"],
    () => fetchRoles({ page: 1, pageSize: 100 }),
    { enabled: state.visibleCreateModal },
  )
  const assignableRoles = (roleResponse?.data?.result ?? []).filter((role) => {
    if (!role.active) return false
    if (currentRoleName.toUpperCase() === "ADMIN") return true
    return (
      currentRoleName.toUpperCase() === "MANAGER" &&
      ["CANDIDATE", "EMPLOYER"].includes(role.name.toUpperCase())
    )
  })
  const handleOk = (values: ICreateUser) => {
    createMutate(values, {
      onSuccess: (res) => {
        if (res.statusCode >= 400) {
          message.error(res.message)
        } else {
          refetch()
          message.success(res.message)
          updateState({ visibleCreateModal: false })
        }
      },
    })
  }
  const handleSubmitEditUser = (values: IEditUser) => {
    editMutate(values, {
      onSuccess: (res) => {
        if (res?.statusCode >= 400) {
          message.error(res.message)
        } else {
          refetch()
          message.success(res.message)
          updateState({ visibleEditModal: false, selectedUser: undefined })
        }
      },
    })
  }
  const handleDelete = () => {
    deleteMutate(
      { id: state.selectedUserId! },
      {
        onSuccess: async (result) => {
          const updatedData = await refetch()
          const resultLength = updatedData?.data?.data?.result?.length ?? 0

          if (resultLength === 0 && state.page > 1) {
            updateState({ page: state.page - 1 })
          }

          message.success(result.message)
          updateState({
            visibleDeleteModal: false,
            selectedUserId: null,
          })
        },
        onError: () => {
          // CustomHooks shows the backend's structured error message.
          updateState({
            visibleDeleteModal: false,
            selectedUserId: null,
          })
        },
      },
    )
  }

  const handleFilter = (filters: { name?: string; phone?: string }) => {
    updateState({
      filterName: filters.name || null,
      filterPhone: filters.phone || null,
      page: 1,
    })
  }

  const handleClearFilter = () => {
    updateState({
      filterName: null,
      filterPhone: null,
      page: 1,
    })
  }
  const fetchDataUser = async (): Promise<IBackendPaginateRes<IUser[]>> => {
    const res = await fetchUsers({
      page: state.page,
      pageSize: state.pageSize,
      sort: state.sortBy,
      phone: state.filterPhone || null,
      name: state.filterName || null,
    })
    updateState({ total: res.data.meta.total })
    return res
  }

  const {
    data,
    refetch,
    isLoading: isLoadingData,
    isError: isUsersError,
  } = CustomHooks.useQuery<IBackendPaginateRes<IUser[]>>(
    [
      QUERY_KEYS.USER_MODULE,
      state.page,
      state.pageSize,
      state.sortBy,
      state.filterName,
      state.filterPhone,
    ],
    fetchDataUser,
  )
  const { isLoading, handleRefresh } = useRefresh(refetch)

  const handleTableChange = (
    page: number,
    pageSize: number,
    sortBy?: string,
  ) => {
    updateState({ page, pageSize, sortBy })
  }
  const confirmDeleteUser = (id: number) => {
    updateState({ visibleDeleteModal: true, selectedUserId: id })
  }

  const handleViewUser = (record: IUser) => {
    updateState({
      visibleEditModal: true,
      selectedUser: record,
      typeModal: "view",
    })
  }
  const handleEditUser = async (record: IUser) => {
    try {
      const result = await getUserById({ id: record.id })
      if (result?.statusCode >= 400 || !result.data) {
        message.error(result?.message || "Unable to load user details")
        return
      }
      updateState({
        visibleEditModal: true,
        selectedUser: result.data,
        typeModal: "edit",
      })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) return
      message.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Unable to load user details"
          : error instanceof Error
            ? error.message
            : "Unable to load user details",
      )
    }
  }
  const listStyle: React.CSSProperties = {
    display: "flex",
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    marginTop: 13,
    flexDirection: "column",
  }
  return (
    <div className="container">
      <UserListHeader
        onAddUser={() => updateState({ visibleCreateModal: true })}
        onRefresh={handleRefresh}
        loading={isLoading}
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
        roles={assignableRoles}
        rolesLoading={isLoadingRoles}
        rolesError={
          isRolesError ||
          (!isLoadingRoles && !roleResponse) ||
          (roleResponse?.statusCode ?? 200) >= 400 ||
          (!isLoadingRoles && assignableRoles.length === 0)
        }
        onRetryRoles={() => void refetchRoles()}
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
        <div className="table-container">
          <CustomGlobalTable<IUser>
            columns={userColumns({
              onView: (record) => {
                handleViewUser(record)
              },
              onEdit: (record) => {
                handleEditUser(record)
              },
              onDelete: (record) => {
                confirmDeleteUser(record)
              },
            })}
            data={data?.data?.result || []}
            loading={isLoadingData}
            isError={isUsersError}
            onRetry={() => void refetch()}
            total={data?.data?.meta?.total || 0}
            page={state.page}
            pageSize={state.pageSize}
            onTableChange={handleTableChange}
          />
        </div>
      </div>
    </div>
  )
}

export default User
