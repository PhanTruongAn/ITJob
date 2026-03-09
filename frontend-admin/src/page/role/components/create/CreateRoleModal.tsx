import { Checkbox, Col, Collapse, Form, Input, Modal, Row, Switch } from "antd"
import React from "react"
import { IPermission } from "../../../../types/backend"

interface CreateRoleModalProps {
  loading: boolean
  open: boolean
  permissionOptions: IPermission[]
  onCancel: () => void
  onSubmit: (values: any) => void
}

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  loading,
  open,
  permissionOptions,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm()

  const groupedPermissions = React.useMemo(() => {
    const map = new Map<string, IPermission[]>()

    const formatModuleName = (name: string) => {
      if (!name) return "";
      return name
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    }

    permissionOptions.forEach((p) => {
      const res = formatModuleName(p.resource || "OTHER")
      if (!map.has(res)) map.set(res, [])
      map.get(res)!.push(p)
    })
    return Array.from(map.entries())
  }, [permissionOptions])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const permissionsDto = (values.permissions || []).map((id: number) => ({
          id,
        }))
        onSubmit({ ...values, permissions: permissionsDto })
        form.resetFields()
      })
      .catch((info) => {
        console.log("Validation Failed:", info)
      })
  }

  return (
    <Modal
      open={open}
      title="Add New Role"
      okText="Submit"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" initialValues={{ active: true }}>
        <Form.Item
          name="name"
          label="Role Name"
          rules={[{ required: true, message: "Please enter role name" }]}
        >
          <Input placeholder="e.g. SUPER_ADMIN" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea placeholder="Role description" />
        </Form.Item>
        <Form.Item name="active" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="permissions" label="Permissions">
          <Checkbox.Group style={{ width: "100%" }}>
            <Collapse
              items={groupedPermissions.map(([resource, perms]) => ({
                key: resource,
                label: resource,
                children: (
                  <Row>
                    {perms.map((p) => (
                      <Col span={12} key={p.id}>
                        <Checkbox value={p.id}>{p.name}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                ),
              }))}
            />
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateRoleModal
