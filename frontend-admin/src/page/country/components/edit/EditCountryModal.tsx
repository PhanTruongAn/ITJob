import { Form, Input, Modal } from "antd"
import React, { useEffect } from "react"
import { ICountry } from "../../../../types/backend"

interface EditCountryModalProps {
  loading: boolean
  open: boolean
  record?: ICountry
  onCancel: () => void
  onSubmit: (values: ICountry) => void
}

const EditCountryModal: React.FC<EditCountryModalProps> = ({
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
        code: record.code,
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
      title="Edit Country"
      okText="Save changes"
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

export default EditCountryModal
