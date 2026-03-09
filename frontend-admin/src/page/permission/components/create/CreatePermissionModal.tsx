import { Form, Input, Modal, Select } from "antd"
import React from "react"

interface CreatePermissionModalProps {
  loading: boolean
  open: boolean
  onCancel: () => void
  onSubmit: (values: any) => void
}

const CreatePermissionModal: React.FC<CreatePermissionModalProps> = ({
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
      title="Add New Permission"
      okText="Submit"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="e.g. Create User" />
        </Form.Item>
        <Form.Item
          name="apiPath"
          label="API Path"
          rules={[{ required: true, message: "Please enter apiPath" }]}
        >
          <Input placeholder="e.g. /api/v1/users" />
        </Form.Item>
        <Form.Item
          name="method"
          label="Method"
          rules={[{ required: true, message: "Please select method" }]}
        >
          <Select placeholder="Select Method">
            <Select.Option value="GET">GET</Select.Option>
            <Select.Option value="POST">POST</Select.Option>
            <Select.Option value="PUT">PUT</Select.Option>
            <Select.Option value="DELETE">DELETE</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="action"
          label="Action"
          rules={[{ required: true, message: "Please enter action" }]}
        >
          <Input placeholder="e.g. CREATE, READ, UPDATE, DELETE" />
        </Form.Item>
        <Form.Item
          name="resource"
          label="Resource"
          rules={[{ required: true, message: "Please enter resource" }]}
        >
          <Input placeholder="e.g. USERS, ROLE" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreatePermissionModal
