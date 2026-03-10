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
  const checkedPermissions = Form.useWatch("permissions", form) || []

  const groupedPermissions = React.useMemo(() => {
    const map = new Map<string, IPermission[]>()

    const formatModuleName = (name: string) => {
      if (!name) return ""
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
        onSubmit({ ...record, ...values, permissions: permissionsDto } as IRole)
      })
      .catch((info) => {
        console.log("Validation Failed:", info)
      })
  }

  const renderPermissionItems = () => {
    return groupedPermissions.map(([resource, perms]) => {
      const permIds = perms.map((p) => p.id)
      const isAllChecked = permIds.every((id) =>
        checkedPermissions.includes(id),
      )
      const isIndeterminate =
        permIds.some((id) => checkedPermissions.includes(id)) && !isAllChecked

      return {
        key: resource,
        label: (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ display: "inline-block" }}
          >
            <Checkbox
              indeterminate={isIndeterminate}
              checked={isAllChecked}
              onChange={(e) => {
                let nextPermissions = [...checkedPermissions]
                if (e.target.checked) {
                  // Add all from this group
                  permIds.forEach((id) => {
                    if (!nextPermissions.includes(id)) {
                      nextPermissions.push(id)
                    }
                  })
                } else {
                  // Remove all from this group
                  nextPermissions = nextPermissions.filter(
                    (id) => !permIds.includes(id),
                  )
                }
                form.setFieldsValue({ permissions: nextPermissions })
              }}
            >
              <span style={{ fontWeight: 600, marginLeft: 8 }}>{resource}</span>
            </Checkbox>
          </div>
        ),
        children: (
          <Row gutter={[16, 16]}>
            {perms.map((p) => (
              <Col span={6} key={p.id}>
                <Checkbox value={p.id}>{p.name}</Checkbox>
              </Col>
            ))}
          </Row>
        ),
      }
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
      width={1000}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Role Name"
              rules={[{ required: true, message: "Please enter role name" }]}
            >
              <Input placeholder="e.g. SUPER_ADMIN" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="active" label="Active" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea
            placeholder="Role description"
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>
        <Form.Item name="permissions" label="Permissions">
          <Collapse
            defaultActiveKey={groupedPermissions.map(([res]) => res)}
            items={groupedPermissions.map(([resource, perms]) => {
              const permIds = perms.map((p) => p.id)
              const isAllChecked = permIds.every((id) =>
                checkedPermissions.includes(id),
              )
              const isIndeterminate =
                permIds.some((id) => checkedPermissions.includes(id)) &&
                !isAllChecked

              return {
                key: resource,
                label: (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: "inline-block" }}
                  >
                    <Checkbox
                      indeterminate={isIndeterminate}
                      checked={isAllChecked}
                      onChange={(e) => {
                        let nextPermissions = [...checkedPermissions]
                        if (e.target.checked) {
                          // Add all from this group
                          permIds.forEach((id) => {
                            if (!nextPermissions.includes(id)) {
                              nextPermissions.push(id)
                            }
                          })
                        } else {
                          // Remove all from this group
                          nextPermissions = nextPermissions.filter(
                            (id) => !permIds.includes(id),
                          )
                        }
                        form.setFieldsValue({ permissions: nextPermissions })
                      }}
                    >
                      <span style={{ fontWeight: 600, marginLeft: 8 }}>
                        {resource}
                      </span>
                    </Checkbox>
                  </div>
                ),
                children: (
                  <Row gutter={[16, 16]}>
                    {perms.map((p) => (
                      <Col span={6} key={p.id}>
                        <Checkbox
                          checked={checkedPermissions.includes(p.id)}
                          onChange={(e) => {
                            let next = [...checkedPermissions]
                            if (e.target.checked) {
                              next.push(p.id)
                            } else {
                              next = next.filter((id) => id !== p.id)
                            }
                            form.setFieldsValue({ permissions: next })
                          }}
                        >
                          {p.name}
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                ),
              }
            })}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditRoleModal
