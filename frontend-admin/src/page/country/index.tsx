import { message, theme } from "antd"
import React, { useState } from "react"
import {
  createCountry,
  deleteCountry,
  fetchCountries,
  updateCountry,
} from "../../apis/countryModule"
import CustomHooks from "../../common/hooks/CustomHooks"
import useRefresh from "../../common/hooks/useRefresh"
import { QUERY_KEYS } from "../../common/queryKeys"
import ConfirmModal from "../../components/modal/ConfirmModal"
import CustomGlobalTable from "../../components/table"
import { ICountry } from "../../types/backend"
import CountryListHeader from "./components/CountryListHeader"
import CreateCountryModal from "./components/create/CreateCountryModal"
import EditCountryModal from "./components/edit/EditCountryModal"
import { countryColumns } from "./components/table/CountryColumns"

const CountryManageList: React.FC = () => {
  const { token } = theme.useToken()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [visibleCreateModal, setVisibleCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [visibleEditModal, setVisibleEditModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined,
  )

  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null,
  )
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    data,
    refetch,
    isLoading: isLoadingData,
  } = CustomHooks.useQuery<any>([QUERY_KEYS.COUNTRY_MODULE], fetchCountries)

  const { isLoading, handleRefresh } = useRefresh(refetch)

  const handleTableChange = (p: number, ps: number) => {
    setPage(p)
    setPageSize(ps)
  }

  const handleCreate = async (values: any) => {
    setIsCreating(true)
    const res = await createCountry(values)
    setIsCreating(false)
    if (res.statusCode >= 400) {
      message.error(res.message)
    } else {
      message.success("Country created successfully")
      setVisibleCreateModal(false)
      refetch()
    }
  }

  const handleEdit = async (values: ICountry) => {
    setIsEditing(true)
    const res = await updateCountry(values)
    setIsEditing(false)
    if (res.statusCode >= 400) {
      message.error(res.message)
    } else {
      message.success("Country updated successfully")
      setVisibleEditModal(false)
      setSelectedCountry(undefined)
      refetch()
    }
  }

  const handleDelete = async () => {
    if (selectedCountryId) {
      setIsDeleting(true)
      const res = await deleteCountry({ id: selectedCountryId })
      setIsDeleting(false)
      if (res.statusCode >= 400) {
        message.error(res.message)
      } else {
        message.success("Deleted successfully")
        refetch()
      }
    }
    setVisibleDeleteModal(false)
  }

  return (
    <div className="container">
      <CountryListHeader
        onAddCountry={() => setVisibleCreateModal(true)}
        onRefresh={handleRefresh}
        loading={isLoading}
      />

      <CreateCountryModal
        loading={isCreating}
        open={visibleCreateModal}
        onCancel={() => setVisibleCreateModal(false)}
        onSubmit={handleCreate}
      />

      <EditCountryModal
        loading={isEditing}
        open={visibleEditModal}
        record={selectedCountry}
        onCancel={() => {
          setVisibleEditModal(false)
          setSelectedCountry(undefined)
        }}
        onSubmit={handleEdit}
      />

      <ConfirmModal
        content="Are you sure you want to delete this country?"
        visible={visibleDeleteModal}
        type="warning"
        onOk={handleDelete}
        loading={isDeleting}
        onCancel={() => setVisibleDeleteModal(false)}
        title="Confirm country deletion"
      />
      <div
        style={{
          background: token.colorBgContainer,
          padding: 16,
          marginTop: 16,
        }}
      >
        <CustomGlobalTable<ICountry>
          columns={countryColumns({
            onEdit: (record) => {
              setSelectedCountry(record)
              setVisibleEditModal(true)
            },
            onDelete: (record) => {
              setSelectedCountryId(record.id)
              setVisibleDeleteModal(true)
            },
          })}
          data={data?.data || []}
          loading={isLoadingData}
          total={data?.data?.meta?.total || 0}
          page={page}
          pageSize={pageSize}
          onTableChange={handleTableChange}
        />
      </div>
    </div>
  )
}

export default CountryManageList
