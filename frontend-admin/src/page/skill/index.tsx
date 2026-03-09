import { message, theme } from "antd"
import React from "react"
import { fetchSkills } from "../../apis/skillModule"
import CustomHooks from "../../common/hooks/CustomHooks"
import useRefresh from "../../common/hooks/useRefresh"
import { QUERY_KEYS } from "../../common/queryKeys"
import ConfirmModal from "../../components/modal/ConfirmModal"
import CustomGlobalTable from "../../components/table"
import { IBackendPaginateRes, ISkill } from "../../types/backend"
import {
  useCreateSkill,
  useDeleteSkill,
  useEditSkill,
  useSkillState,
} from "./common/hooks"
import CreateSkillModal from "./components/create/CreateSkillModal"
import EditSkillModal from "./components/edit/EditSkillModal"
import SkillListHeader from "./components/SkillListHeader"
import { skillColumns } from "./components/table/SkillColumns"

const SkillManageList: React.FC = () => {
  const { token } = theme.useToken()
  const { state, updateState } = useSkillState()

  const fetchDataSkills = async (): Promise<IBackendPaginateRes<ISkill[]>> => {
    const res = await fetchSkills({
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
  } = CustomHooks.useQuery<IBackendPaginateRes<ISkill[]>>(
    [QUERY_KEYS.SKILL_MODULE, state.page, state.pageSize],
    fetchDataSkills,
  )

  const { isLoading, handleRefresh } = useRefresh(refetch)

  const handleTableChange = (p: number, ps: number) => {
    updateState({ page: p, pageSize: ps })
  }

  const { mutate: createMutate, isPending: isCreating } = useCreateSkill()
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

  const { mutate: editMutate, isPending: isEditing } = useEditSkill()
  const handleEdit = (values: ISkill) => {
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

  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteSkill()
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
      <SkillListHeader
        onAddSkill={() => updateState({ visibleCreateModal: true })}
        onRefresh={handleRefresh}
        loading={isLoading}
      />

      <CreateSkillModal
        loading={isCreating}
        open={state.visibleCreateModal}
        onCancel={() => updateState({ visibleCreateModal: false })}
        onSubmit={handleCreate}
      />

      <EditSkillModal
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
        content="Are you sure you want to delete this skill?"
        visible={state.visibleDeleteModal}
        type="warning"
        onOk={handleDelete}
        loading={isDeleting}
        onCancel={() => updateState({ visibleDeleteModal: false })}
        title="Confirm skill deletion"
      />
      <div
        style={{
          background: token.colorBgContainer,
          padding: 16,
          marginTop: 16,
        }}
      >
        <CustomGlobalTable<ISkill>
          columns={skillColumns({
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

export default SkillManageList

