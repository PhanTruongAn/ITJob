import React from "react";
import "./style.css";
import { Button, Col, Form, Image, Input, Row, Space } from "antd";
import backgroundImage from "../../assets/background-login.webp";
import logo from "../../assets/logo.png";
type FieldType = {
  email?: string;
  password?: string;
};
const Login: React.FC = () => {
  const [form] = Form.useForm();
  return (
    <div className="container">
      <div className="left-logo">
        <Image width={635} height={480} src={backgroundImage} preview={false} />
      </div>
      <div className="right-form">
        <div className="login-form">
          <div className="header-title">
            <Image width={100} height={40} src={logo} preview={false} />
            <div className="title">CUSTOMER ADMIN SITE</div>
          </div>
          <div className="title-2">Welcome to ITJob Customer</div>

          <Form
            style={{ padding: "30px" }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label={null}
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input placeholder="Email" size="large" />
            </Form.Item>
            <Form.Item<FieldType>
              label={null}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>
            <Form.Item>
              <a style={{ float: "right" }}>Forgot password?</a>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ outline: "none", width: "100%" }}
              >
                Sign in
              </Button>
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              Don't have an account. <a>Sign-up</a>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
