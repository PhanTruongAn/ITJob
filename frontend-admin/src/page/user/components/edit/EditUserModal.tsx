import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Row, Col } from "antd";
import { IUser } from "../../../../types/backend";
import dayjs from "dayjs";

interface UserModalProps {
  record?: IUser;
  option?: "edit" | "view";
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const { Option } = Select;

const EditUserModal: React.FC<UserModalProps> = ({
  open,
  onCancel,
  onSubmit,
  option,
  record,
}) => {
  const [form] = Form.useForm();
  const isViewDetail = option === "view" ? true : false;
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        values.dob = values.dob.format("DD/MM/YYYY");
        onSubmit(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };
  useEffect(() => {
    if (record && open) {
      const { dob, ...rest } = record;
      form.setFieldsValue({
        ...rest,
        dob: dob ? dayjs(dob) : null,
      });
    }
  }, [record, open]);
  return (
    <Modal
      open={open}
      title={isViewDetail ? "User Detail" : "Edit User"}
      okText="Submit"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={5}>
            <Form.Item name="id" label="Id">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={19}>
            <Form.Item name="email" label="Email">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="phone" label="Phone">
              <Input disabled={isViewDetail} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Please enter full name" }]}
            >
              <Input placeholder="John Doe" disabled={isViewDetail} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <Input
                placeholder="123 Main St, Cityville"
                disabled={isViewDetail}
              />
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
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                disabled={isViewDetail}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select gender" }]}
            >
              <Select placeholder="Select gender" disabled={isViewDetail}>
                <Option value="MALE">Male</Option>
                <Option value="FEMALE">Female</Option>
                <Option value="OTHER">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
