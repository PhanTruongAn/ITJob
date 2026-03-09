import { Form, Input, Modal, Select } from "antd"
import React from "react"
import { ISkill } from "../../../../types/backend"

interface CreateSubscriberModalProps {
  loading: boolean
  open: boolean
  skillOptions: ISkill[]
  onCancel: () => void
  onSubmit: (values: any) => void
}

const CreateSubscriberModal: React.FC<CreateSubscriberModalProps> = ({
  loading,
  open,
  skillOptions,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit({ ...values })
        form.resetFields()
      })
      .catch((info) => {
        console.log("Validation Failed:", info)
      })
  }

  return (
    <Modal
      open={open}
      title="Add New Subscriber"
      okText="Submit"
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
        <Form.Item name="skillIds" label="Subscribed Skills">
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

export default CreateSubscriberModal
