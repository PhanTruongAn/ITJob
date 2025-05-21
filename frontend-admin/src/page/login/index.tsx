import { Button, Form, Image, Input } from "antd";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/background-login.webp";
import logo from "../../assets/logo.png";
import { useAppSelector } from "../../redux/hooks";
import { PATH_DASHBOARD } from "../../routes/paths";
import { useAuthLogin } from "./common/hooks";
import "./style.css";
type FieldType = {
  email?: string;
  password?: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  const { mutate, isPending } = useAuthLogin();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const callback = params?.get("callback");

  useEffect(() => {
    if (isAuthenticated) {
      navigate(PATH_DASHBOARD.userManage.list);
    }
  }, [isAuthenticated]);

  const onFinish = async (values: any) => {
    const { email, password } = values;
    mutate({ username: email, password });
  };

  return (
    <div className="container-login">
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
            onFinish={onFinish}
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
                loading={isPending}
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
