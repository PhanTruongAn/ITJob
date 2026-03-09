import { Form, Input, Modal } from "antd"
import React, { useEffect } from "react"
import { ISkill } from "../../../../types/backend"

interface EditSkillModalProps {
  loading: boolean
  open: boolean
  record?: ISkill
  onCancel: () => void
  onSubmit: (values: ISkill) => void
}

const EditSkillModal: React.FC<EditSkillModalProps> = ({
  loading,
  open,
  record,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        name: record.name,
      })
    }
  }, [record, form])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit({ ...record, ...values })
      })
      .catch((info) => {
        console.log("Validation Failed:", info)
      })
  }

  return (
    <Modal
      open={open}
      title="Edit Skill"
      okText="Save changes"
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

export default EditSkillModal
