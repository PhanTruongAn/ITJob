import { Button, Col, Form, Input, Row, Space, theme } from "antd";
import { useEffect } from "react";

export const UserListHeaderToolbar = () => {
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
    console.log("Received values of form: ", values);
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
          <Form.Item name="address" label="Adress">
            <Input placeholder="Input address" />
          </Form.Item>
        </Col>
        <Col span={8} style={{ textAlign: "right" }}>
          <Form.Item label={null}>
            <Space size="small" className="search-button-group">
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                }}
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
