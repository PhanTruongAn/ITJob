import { Form, message } from "antd"
import React, { useState } from "react"
import { ICreateCompanyDTO } from "../../../../../types/backend"
import { useCreateCompany } from "../../../common/hooks"
import CompanyForm from "../../CompanyForm"

const CreateCompany: React.FC = ({}) => {
  const [form] = Form.useForm()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const { mutate } = useCreateCompany()
  const handleCreate = async (payload: ICreateCompanyDTO) => {
    mutate(
      { ...payload },
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
        type="create"
        form={form}
        onSubmit={handleCreate}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
    </>
  )
}

export default CreateCompany
