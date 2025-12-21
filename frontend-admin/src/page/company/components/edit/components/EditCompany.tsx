import { Form, message } from "antd"
import React, { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { IEditCompanyDTO } from "../../../../../types/backend"
import { useEditCompany, useGetCompanyById } from "../../../common/hooks"
import CompanyForm from "../../CompanyForm"
const EditCompany: React.FC = () => {
  const [form] = Form.useForm()
  const { id } = useParams()
  const location = useLocation()
  const isViewed = location.state?.isView
  const { data: companyData } = useGetCompanyById(Number(id))
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
      <CompanyForm
        type={isViewed ? "view" : "edit"}
        form={form}
        onSubmit={handleEdit}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
    </>
  )
}

export default EditCompany
