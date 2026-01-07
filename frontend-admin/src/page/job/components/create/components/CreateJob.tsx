import { Form, Select, message } from "antd"
import React from "react"
import { useCreateJob } from "../../../common/hooks"
import { CreateJobReqDTO } from "../../../common/interfaces"
import JobForm from "../../JobForm"

const { Option } = Select

const CreateJob: React.FC = () => {
  const [form] = Form.useForm()
  const { mutate } = useCreateJob()
  const handleCreate = async (payload: CreateJobReqDTO) => {
    mutate(
      { ...payload },
      {
        onSuccess: (res) => {
          message.success(res.message)
          form.resetFields()
        },
      }
    )
  }

  return (
    <>
      <JobForm form={form} type="create" onSubmit={handleCreate} />
    </>
  )
}

export default CreateJob
