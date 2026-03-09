import { Form, Input, Modal } from "antd"
import React from "react"

interface CreateCountryModalProps {
  loading: boolean
  open: boolean
  onCancel: () => void
  onSubmit: (values: any) => void
}

const CreateCountryModal: React.FC<CreateCountryModalProps> = ({
  loading,
  open,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values)
        form.resetFields()
      })
      .catch((info) => {
        console.log("Validation Failed:", info)
      })
  }

  return (
    <Modal
      open={open}
      title="Add New Country"
      okText="Submit"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="code"
          label="Country Code"
          rules={[{ required: true, message: "Please enter country code" }]}
        >
          <Input placeholder="e.g. VN" />
        </Form.Item>
        <Form.Item
          name="name"
          label="Country Name"
          rules={[{ required: true, message: "Please enter country name" }]}
        >
          <Input placeholder="e.g. Vietnam" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateCountryModal
