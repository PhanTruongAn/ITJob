import { message, theme } from "antd"
import React, { useEffect, useState } from "react"
import {
  assignPermissions,
  createRole,
  fetchRoles,
  getRoleById,
  updateRole,
} from "../../apis/roleModule"
import { fetchPermissions } from "../../apis/permissionModule"
import CustomHooks from "../../common/hooks/CustomHooks"
import useRefresh from "../../common/hooks/useRefresh"
import { QUERY_KEYS } from "../../common/queryKeys"
import ConfirmModal from "../../components/modal/ConfirmModal"
import CustomGlobalTable from "../../components/table"
import { IBackendPaginateRes, IPermission, IRole } from "../../types/backend"
import {
  useCreateRole,
  useDeleteRole,
  useEditRole,
  useRoleState,
} from "./common/hooks"
import CreateRoleModal from "./components/create/CreateRoleModal"
import EditRoleModal from "./components/edit/EditRoleModal"
import RoleListHeader from "./components/RoleListHeader"
import { roleColumns } from "./components/table/RoleColumns"

const RoleManageList: React.FC = () => {
  const { token } = theme.useToken()
  const { state, updateState } = useRoleState()

  const [permissionsOptions, setPermissionsOptions] = useState<IPermission[]>([])

  useEffect(() => {
    const loadPermissions = async () => {
      // Fetch a large number of permissions to assign
      const res = await fetchPermissions({ page: 1, pageSize: 1000 })
      if (res?.data?.result) {
        setPermissionsOptions(res.data.result)
      }
    }
    loadPermissions()
  }, [])

  const fetchDataRoles = async (): Promise<IBackendPaginateRes<IRole[]>> => {
    const res = await fetchRoles({ page: state.page, pageSize: state.pageSize })
    if (res?.statusCode >= 400) {
      message.error(res?.message)
    }
    return res
  }

  const {
    data,
    refetch,
    isLoading: isLoadingData,
  } = CustomHooks.useQuery<IBackendPaginateRes<IRole[]>>(
    [QUERY_KEYS.ROLE_MODULE, state.page, state.pageSize],
    fetchDataRoles,
  )

  const { isLoading, handleRefresh } = useRefresh(refetch)

  const handleTableChange = (p: number, ps: number) => {
    updateState({ page: p, pageSize: ps })
  }

  const { mutate: createMutate, isPending: isCreating } = useCreateRole()
  const handleCreate = async (values: any) => {
    const { permissions, ...roleData } = values
    createMutate(roleData, {
      onSuccess: async (res) => {
        if (res.statusCode >= 400) {
          message.error(res.message)
        } else {
          const permissionIds = (permissions || []).map((p: any) => p.id)
          if (permissionIds.length > 0) {
            await assignPermissions({
              roleId: res.data.id,
              permissionIds,
            })
          }
          updateState({ visibleCreateModal: false })
          refetch()
        }
      },
    })
  }

  const { mutate: editMutate, isPending: isEditing } = useEditRole()
  const handleEdit = async (values: any) => {
    const { permissions, ...roleData } = values
    editMutate(roleData, {
      onSuccess: async (res) => {
        if (res.statusCode >= 400) {
          message.error(res.message)
        } else {
          const permissionIds = (permissions || []).map((p: any) => p.id)
          await assignPermissions({
            roleId: res.data.id,
            permissionIds,
          })
          updateState({
            visibleEditModal: false,
            selectedRecord: undefined,
          })
          refetch()
        }
      },
    })
  }

  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteRole()
  const handleDelete = () => {
    if (state.selectedId) {
      deleteMutate(
        { id: state.selectedId },
        {
          onSuccess: (res) => {
            if (res.statusCode >= 400) {
              message.error(res.message)
            } else {
              refetch()
            }
          },
        },
      )
    }
    updateState({ visibleDeleteModal: false })
  }

  const handleEditRole = async (record: IRole) => {
    message.loading({ content: "Loading role details...", key: "fetchRole" })
    const res = await getRoleById(record.id)
    if (res.statusCode < 400 && res.data) {
      message.success({ content: "Loaded", key: "fetchRole", duration: 1 })
      updateState({
        selectedRecord: res.data,
        visibleEditModal: true,
      })
    } else {
      message.error({ content: "Failed to load role details", key: "fetchRole" })
    }
  }

  return (
    <div className="container">
      <RoleListHeader
        onAddRole={() => updateState({ visibleCreateModal: true })}
        onRefresh={handleRefresh}
        loading={isLoading}
      />

      <CreateRoleModal
        loading={isCreating}
        open={state.visibleCreateModal}
        permissionOptions={permissionsOptions}
        onCancel={() => updateState({ visibleCreateModal: false })}
        onSubmit={handleCreate}
      />

      <EditRoleModal
        loading={isEditing}
        open={state.visibleEditModal}
        record={state.selectedRecord}
        permissionOptions={permissionsOptions}
        onCancel={() => {
          updateState({
            visibleEditModal: false,
            selectedRecord: undefined,
          })
        }}
        onSubmit={handleEdit}
      />

      <ConfirmModal
        content="Are you sure you want to delete this role?"
        visible={state.visibleDeleteModal}
        type="warning"
        onOk={handleDelete}
        loading={isDeleting}
        onCancel={() => updateState({ visibleDeleteModal: false })}
        title="Confirm role deletion"
      />
      <div
        style={{
          background: token.colorBgContainer,
          padding: 16,
          marginTop: 16,
        }}
      >
        <CustomGlobalTable<IRole>
          columns={roleColumns({
            onEdit: (record) => {
              handleEditRole(record)
            },
            onDelete: (record) => {
              updateState({
                selectedId: record.id as number,
                visibleDeleteModal: true,
              })
            },
          })}
          data={data?.data?.result || []}
          loading={isLoadingData}
          total={data?.data?.meta?.total || 0}
          page={state.page}
          pageSize={state.pageSize}
          onTableChange={handleTableChange}
        />
      </div>
    </div>
  )
}

export default RoleManageList

