import { Alert, Button, Form, message, Spin } from "antd"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useParams } from "react-router-dom"
import { IEditCompanyDTO } from "../../../../../types/backend"
import { useEditCompany, useGetCompanyById } from "../../../common/hooks"
import CompanyForm from "../../CompanyForm"
const EditCompany: React.FC = () => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { id } = useParams()
  const location = useLocation()
  const isViewed = location.state?.isView
  const {
    data: companyData,
    isLoading,
    isError,
    refetch,
  } = useGetCompanyById(Number(id))
  const { mutate } = useEditCompany()
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    if (companyData?.data) {
      const { country, logo, ...rest } = companyData.data
      const fileList = logo
        ? [
            {
              uid: "-1",
              name: "logo.png",
              status: "done",
              url: logo,
            },
          ]
        : []

      form.setFieldsValue({ ...rest, logo: fileList, countryId: country.id })
      setPreviewImage(logo)
    }
  }, [companyData])

  const handleEdit = async (payload: IEditCompanyDTO) => {
    mutate(
      { ...payload, id: Number(id) },
      {
        onSuccess: (res) => {
          message.success(res.message)
          setPreviewImage(null)
          form.resetFields()
        },
      }
    )
  }
  return (
    <>
      {isLoading ? (
        <Spin />
      ) : isError ? (
        <Alert
          type="error"
          showIcon
          message={t("common.companyDetailLoadError")}
          action={<Button size="small" onClick={() => void refetch()}>{t("common.retry")}</Button>}
        />
      ) : (
        <CompanyForm
          type={isViewed ? "view" : "edit"}
          form={form}
          onSubmit={handleEdit}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
        />
      )}
    </>
  )
}

export default EditCompany
