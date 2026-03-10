import { Form, Select, message } from "antd"
import React, { useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"
import { useEditJob, useGetJobById } from "../../../common/hooks"
import { CreateJobReqDTO } from "../../../common/interfaces"
import JobForm from "../../JobForm"

const { Option } = Select

import dayjs from "dayjs"

const EditJob: React.FC = () => {
  const [form] = Form.useForm()
  const { mutate } = useEditJob()
  const { id } = useParams()
  const location = useLocation()
  const isViewed = location.state?.isView
  const { data: jobData } = useGetJobById(Number(id))

  useEffect(() => {
    if (jobData?.data) {
      const data = jobData.data
      form.setFieldsValue({
        ...data,
        companyId: data.companyId || data.company?.id,
        startDate: data.startDate ? dayjs(data.startDate) : null,
        endDate: data.endDate ? dayjs(data.endDate) : null,
      })
    }
  }, [jobData, form])
  const handleEdit = async (payload: CreateJobReqDTO) => {
    mutate(
      { ...payload, id: Number(id) },
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
      <JobForm
        form={form}
        type={isViewed ? "view" : "edit"}
        onSubmit={handleEdit}
      />
    </>
  )
}

export default EditJob
