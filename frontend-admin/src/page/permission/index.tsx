import { message, theme } from "antd"
import React from "react"
import { fetchPermissions } from "../../apis/permissionModule"
import CustomHooks from "../../common/hooks/CustomHooks"
import useRefresh from "../../common/hooks/useRefresh"
import { QUERY_KEYS } from "../../common/queryKeys"
import ConfirmModal from "../../components/modal/ConfirmModal"
import CustomGlobalTable from "../../components/table"
import { IBackendPaginateRes, IPermission } from "../../types/backend"
import {
  useCreatePermission,
  useDeletePermission,
  useEditPermission,
  usePermissionState,
} from "./common/hooks"
import CreatePermissionModal from "./components/create/CreatePermissionModal"
import EditPermissionModal from "./components/edit/EditPermissionModal"
import PermissionListHeader from "./components/PermissionListHeader"
import { permissionColumns } from "./components/table/PermissionColumns"

const PermissionManageList: React.FC = () => {
  const { token } = theme.useToken()
  const { state, updateState } = usePermissionState()

  const fetchDataPermissions = async (): Promise<
    IBackendPaginateRes<IPermission[]>
  > => {
    const res = await fetchPermissions({
      page: state.page,
      pageSize: state.pageSize,
    })
    if (res?.statusCode >= 400) {
      message.error(res?.message)
    }
    return res
  }

  const {
    data,
    refetch,
    isLoading: isLoadingData,
  } = CustomHooks.useQuery<IBackendPaginateRes<IPermission[]>>(
    [QUERY_KEYS.PERMISSION_MODULE, state.page, state.pageSize],
    fetchDataPermissions,
  )

  const { isLoading, handleRefresh } = useRefresh(refetch)

  const handleTableChange = (p: number, ps: number) => {
    updateState({ page: p, pageSize: ps })
  }

  const { mutate: createMutate, isPending: isCreating } = useCreatePermission()
  const handleCreate = (values: any) => {
    createMutate(values, {
      onSuccess: (res) => {
        if (res.statusCode >= 400) {
          message.error(res.message)
        } else {
          updateState({ visibleCreateModal: false })
          refetch()
        }
      },
    })
  }

  const { mutate: editMutate, isPending: isEditing } = useEditPermission()
  const handleEdit = (values: IPermission) => {
    editMutate(values, {
      onSuccess: (res) => {
        if (res.statusCode >= 400) {
          message.error(res.message)
        } else {
          updateState({
            visibleEditModal: false,
            selectedRecord: undefined,
          })
          refetch()
        }
      },
    })
  }

  const { mutate: deleteMutate, isPending: isDeleting } = useDeletePermission()
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

  return (
    <div className="container">
      <PermissionListHeader
        onAddPermission={() => updateState({ visibleCreateModal: true })}
        onRefresh={handleRefresh}
        loading={isLoading}
      />

      <CreatePermissionModal
        loading={isCreating}
        open={state.visibleCreateModal}
        onCancel={() => updateState({ visibleCreateModal: false })}
        onSubmit={handleCreate}
      />

      <EditPermissionModal
        loading={isEditing}
        open={state.visibleEditModal}
        record={state.selectedRecord}
        onCancel={() => {
          updateState({
            visibleEditModal: false,
            selectedRecord: undefined,
          })
        }}
        onSubmit={handleEdit}
      />

      <ConfirmModal
        content="Are you sure you want to delete this permission?"
        visible={state.visibleDeleteModal}
        type="warning"
        onOk={handleDelete}
        loading={isDeleting}
        onCancel={() => updateState({ visibleDeleteModal: false })}
        title="Confirm permission deletion"
      />
      <div
        style={{
          background: token.colorBgContainer,
          padding: 16,
          marginTop: 16,
        }}
      >
        <CustomGlobalTable<IPermission>
          columns={permissionColumns({
            onEdit: (record) => {
              updateState({
                selectedRecord: record,
                visibleEditModal: true,
              })
            },
            onDelete: (record) => {
              updateState({
                selectedId: record.id as number,
                visibleDeleteModal: true,
              })
            },
          })}
          data={(() => {
            const raw = data?.data?.result || []
            const map = new Map<string, any>()

            const formatModuleName = (name: string) => {
              if (!name) return ""
              return name
                .toLowerCase()
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            }

            raw.forEach((p) => {
              if (!map.has(p.resource)) {
                map.set(p.resource, {
                  id: `res-${p.resource}`,
                  name: "",
                  apiPath: "",
                  method: "",
                  action: "",
                  resource: formatModuleName(p.resource),
                  children: [],
                })
              }
              map.get(p.resource).children.push(p)
            })
            return Array.from(map.values())
          })()}
          loading={isLoadingData}
          total={data?.data?.meta?.total || 0}
          page={state.page}
          pageSize={state.pageSize}
          isPagination={false}
          onTableChange={handleTableChange}
        />
      </div>
    </div>
  )
}

export default PermissionManageList

