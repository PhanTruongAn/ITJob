import { Form, Input, Modal } from "antd"
import React from "react"

interface CreateSkillModalProps {
  loading: boolean
  open: boolean
  onCancel: () => void
  onSubmit: (values: any) => void
}

const CreateSkillModal: React.FC<CreateSkillModalProps> = ({
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
      title="Add New Skill"
      okText="Submit"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Skill Name"
          rules={[{ required: true, message: "Please enter skill name" }]}
        >
          <Input placeholder="e.g. Java" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateSkillModal
