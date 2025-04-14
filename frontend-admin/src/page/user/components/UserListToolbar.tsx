import { Button, Col, Form, Input, Row, Space, theme } from "antd";
import React, { useEffect } from "react";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
export interface UserFilterProps {
  onFilter: (filters: { name?: string; phone?: string }) => void;
  onClear: () => void;
}

export const UserListHeaderToolbar: React.FC<UserFilterProps> = ({
  onFilter,
  onClear,
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const formStyle: React.CSSProperties = {
    maxWidth: "none",
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    padding: 24,
    height: 80,
  };

  const onFinish = (values: any) => {
    const { phone, name } = values;
    onFilter({ name, phone });
  };
  useEffect(() => {
    console.log("Current path:", location.pathname);
  }, [location]);

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item name="name" label="Name">
            <Input placeholder="Input full name" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="phone" label="Phone">
            <Input placeholder="Input phone" />
          </Form.Item>
        </Col>
        <Col span={8} style={{ textAlign: "right" }}>
          <Form.Item label={null}>
            <Space size="small" className="search-button-group">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  onClear();
                }}
                icon={<ClearOutlined />}
              >
                Clear
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
