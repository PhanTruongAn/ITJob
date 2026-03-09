import { Form, Input, Modal, Select } from "antd"
import React, { useEffect } from "react"
import { ISkill, ISubscriber } from "../../../../types/backend"

interface EditSubscriberModalProps {
  loading: boolean
  open: boolean
  record?: ISubscriber
  skillOptions: ISkill[]
  onCancel: () => void
  onSubmit: (values: ISubscriber) => void
}

const EditSubscriberModal: React.FC<EditSubscriberModalProps> = ({
  loading,
  open,
  record,
  skillOptions,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        email: record.email,
        skills: record.skills?.map((s) => s.id) || [],
      })
    }
  }, [record, form])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit({ ...record, ...values, skillIds: values.skills })
      })
      .catch((info) => {
        console.log("Validation Failed:", info)
      })
  }

  return (
    <Modal
      open={open}
      title="Edit Subscriber"
      okText="Save changes"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Invalid email" },
          ]}
        >
          <Input placeholder="johndoe@example.com" />
        </Form.Item>
        <Form.Item name="skills" label="Subscribed Skills">
          <Select
            mode="multiple"
            placeholder="Select skills to subscribe"
            options={skillOptions.map((s) => ({ value: s.id, label: s.name }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditSubscriberModal
