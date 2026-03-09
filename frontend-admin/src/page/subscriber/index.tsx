import { message, theme } from "antd"
import React, { useEffect, useState } from "react"
import { fetchSkills } from "../../apis/skillModule"
import { fetchSubscribers } from "../../apis/subscriberModule"
import CustomHooks from "../../common/hooks/CustomHooks"
import useRefresh from "../../common/hooks/useRefresh"
import { QUERY_KEYS } from "../../common/queryKeys"
import ConfirmModal from "../../components/modal/ConfirmModal"
import CustomGlobalTable from "../../components/table"
import { IBackendPaginateRes, ISkill, ISubscriber } from "../../types/backend"
import { DEFAULT_STATE } from "./common/constants"
import {
  useCreateSubscriber,
  useDeleteSubscriber,
  useEditSubscriber,
  useSubscriberState,
} from "./common/hooks"
import SubscriberListHeader from "./components/SubscriberListHeader"
import CreateSubscriberModal from "./components/create/CreateSubscriberModal"
import EditSubscriberModal from "./components/edit/EditSubscriberModal"
import { subscriberColumns } from "./components/table/SubscriberColumns"

const SubscriberManageList: React.FC = () => {
  const { token } = theme.useToken()
  const { state, updateState } = useSubscriberState()

  const [skillsOptions, setSkillsOptions] = useState<ISkill[]>([])

  useEffect(() => {
    // Fetch skills to populate the dropdowns
    const loadSkills = async () => {
      const res = await fetchSkills({ page: 1, pageSize: 100 })
      if (res?.data?.result) {
        setSkillsOptions(res.data.result)
      }
    }
    loadSkills()
  }, [])

  const fetchDataSubscribers = async (): Promise<
    IBackendPaginateRes<ISubscriber[]>
  > => {
    const res = await fetchSubscribers({
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
  } = CustomHooks.useQuery<IBackendPaginateRes<ISubscriber[]>>(
    [QUERY_KEYS.SUBSCRIBER_MODULE, state.page, state.pageSize],
    fetchDataSubscribers,
  )

  const { isLoading, handleRefresh } = useRefresh(refetch)

  const handleTableChange = (p: number, ps: number) => {
    updateState({ page: p, pageSize: ps })
  }

  const { mutate: createMutate, isPending: isCreating } = useCreateSubscriber()
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

  const { mutate: editMutate, isPending: isEditing } = useEditSubscriber()
  const handleEdit = (values: ISubscriber) => {
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

  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteSubscriber()
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
      <SubscriberListHeader
        onAddSubscriber={() => updateState({ visibleCreateModal: true })}
        onRefresh={handleRefresh}
        loading={isLoading}
      />

      <CreateSubscriberModal
        loading={isCreating}
        open={state.visibleCreateModal}
        skillOptions={skillsOptions}
        onCancel={() => updateState({ visibleCreateModal: false })}
        onSubmit={handleCreate}
      />

      <EditSubscriberModal
        loading={isEditing}
        open={state.visibleEditModal}
        record={state.selectedRecord}
        skillOptions={skillsOptions}
        onCancel={() => {
          updateState({
            visibleEditModal: false,
            selectedRecord: undefined,
          })
        }}
        onSubmit={handleEdit}
      />

      <ConfirmModal
        content="Are you sure you want to delete this subscriber?"
        visible={state.visibleDeleteModal}
        type="warning"
        onOk={handleDelete}
        loading={isDeleting}
        onCancel={() => updateState({ visibleDeleteModal: false })}
        title="Confirm subscriber deletion"
      />
      <div
        style={{
          background: token.colorBgContainer,
          padding: 16,
          marginTop: 16,
        }}
      >
        <CustomGlobalTable<ISubscriber>
          columns={subscriberColumns({
            onEdit: (record) => {
              updateState({
                selectedRecord: record,
                visibleEditModal: true,
              })
            },
            onDelete: (record) => {
              updateState({
                selectedId: record.id,
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

export default SubscriberManageList

