import { Checkbox, Col, Collapse, Form, Input, Modal, Row, Switch } from "antd"
import React, { useEffect } from "react"
import { IPermission, IRole } from "../../../../types/backend"

interface EditRoleModalProps {
  loading: boolean
  open: boolean
  record?: IRole
  permissionOptions: IPermission[]
  onCancel: () => void
  onSubmit: (values: IRole) => void
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  loading,
  open,
  record,
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

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        name: record.name,
        description: record.description,
        active: record.active,
        permissions: record.permissions?.map((p) => p.id) || [],
      })
    }
  }, [record, form])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const permissionsDto = (values.permissions || []).map((id: number) => ({
          id,
        }))
        onSubmit({ ...record, ...values, permissions: permissionsDto })
      })
      .catch((info) => {
        console.log("Validation Failed:", info)
      })
  }

  return (
    <Modal
      open={open}
      title="Edit Role"
      okText="Save changes"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
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

export default EditRoleModal
