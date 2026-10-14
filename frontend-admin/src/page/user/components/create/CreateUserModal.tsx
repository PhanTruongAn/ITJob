import React from "react";
import { Modal, Form, Input, DatePicker, Select, Row, Col, Alert } from "antd";
import { IRole } from "../../../../types/backend";
import { ICreateUser } from "../../common/interface";

interface CreateUserModalProps {
  loading: boolean;
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: ICreateUser) => void;
  roles: IRole[];
  rolesLoading: boolean;
  rolesError: boolean;
}

const { Option } = Select;

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  loading,
  open,
  onCancel,
  onSubmit,
  roles,
  rolesLoading,
  rolesError,
}) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        values.dob = values.dob.format("DD/MM/YYYY");
        onSubmit(values as ICreateUser);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      open={open}
      title="Add New User"
      okText="Submit"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
      loading={loading}
    >
      <Form form={form} layout="vertical">
        {rolesError && (
          <Alert
            type="error"
            showIcon
            message="Unable to load assignable roles. Refresh and try again."
            style={{ marginBottom: 16 }}
          />
        )}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Email is not valid" },
              ]}
            >
              <Input placeholder="johndoe@example.com" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="******" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Please enter full name" }]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input placeholder="0xxxxxxxxxx" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <Input placeholder="123 Main St, Cityville" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="dob"
              label="Date of Birth"
              rules={[
                { required: true, message: "Please select date of birth" },
              ]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select gender" }]}
            >
              <Select placeholder="Select gender">
                <Option value="MALE">Male</Option>
                <Option value="FEMALE">Female</Option>
                <Option value="OTHER">Other</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="roleId"
              label="Role"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select
                placeholder="Select role"
                loading={rolesLoading}
                disabled={rolesLoading || roles.length === 0}
                options={roles.map((role) => ({
                  value: role.id,
                  label: role.name,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
