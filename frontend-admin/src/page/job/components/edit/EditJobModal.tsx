import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd"
import dayjs from "dayjs"
import React, { useEffect } from "react"
import { ICompany, ISkill } from "../../../../types/backend"
import { LevelEnum } from "../../common/enums"
import { Job } from "../../common/interfaces"

interface EditJobModalProps {
  loading: boolean
  open: boolean
  record?: Job
  companyOptions: ICompany[]
  skillOptions: ISkill[]
  onCancel: () => void
  onSubmit: (values: any) => void
}

const EditJobModal: React.FC<EditJobModalProps> = ({
  loading,
  open,
  record,
  companyOptions,
  skillOptions,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        name: record.name,
        companyId: record.companyId || record.company?.id,
        level: record.level,
        location: record.location,
        salary: record.salary,
        quantity: record.quantity,
        dateRange: [
          record.startDate ? dayjs(record.startDate) : null,
          record.endDate ? dayjs(record.endDate) : null,
        ],
        skillIds: record.jobSkills?.map((js) => js.skill?.id) || [],
        description: record.description,
      })
    }
  }, [record, form])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          ...record,
          ...values,
          startDate: values.dateRange?.[0]?.toISOString(),
          endDate: values.dateRange?.[1]?.toISOString(),
        }
        delete payload.dateRange
        onSubmit(payload)
      })
      .catch((info) => {
        console.log("Validation Failed:", info)
      })
  }

  return (
    <Modal
      open={open}
      title="Edit Job"
      okText="Save changes"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Job Title"
          rules={[{ required: true, message: "Please enter title" }]}
        >
          <Input placeholder="e.g. Senior Frontend Engineer" />
        </Form.Item>

        <div style={{ display: "flex", gap: 16 }}>
          <Form.Item
            name="companyId"
            label="Company"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Please select company" }]}
          >
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={companyOptions.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              placeholder="Select company"
            />
          </Form.Item>
          <Form.Item
            name="level"
            label="Level"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Please select level" }]}
          >
            <Select placeholder="Select level">
              {Object.values(LevelEnum).map((lvl) => (
                <Select.Option key={lvl} value={lvl}>
                  {lvl}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <Form.Item
            name="location"
            label="Location"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input placeholder="e.g. Ho Chi Minh" />
          </Form.Item>
          <Form.Item
            name="salary"
            label="Salary"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Please enter salary" }]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="e.g. 2000" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              placeholder="e.g. 5"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="dateRange"
          label="Start - End Date"
          rules={[{ required: true, message: "Please select date range" }]}
        >
          <DatePicker.RangePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="skillIds" label="Skills">
          <Select
            mode="multiple"
            placeholder="Select required skills"
            options={skillOptions.map((s) => ({ value: s.id, label: s.name }))}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea rows={4} placeholder="Job description..." />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditJobModal
