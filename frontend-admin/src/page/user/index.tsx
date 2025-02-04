import React, { useState } from "react";
import { Button, Col, Form, Input, Row, Space, Table, theme } from "antd";
import "./style.css";
import { columns, data, IDataType } from "./table";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
const AdvancedSearchForm = () => {
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

const User: React.FC = () => {
  const { token } = theme.useToken();
  const [pageSize, setPageSize] = useState<number>(5);
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };
  const listStyle: React.CSSProperties = {
    display: "flex",
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    marginTop: 13,
    flexDirection: "column",
  };

  return (
    <div className="container">
      <AdvancedSearchForm />
      <div style={listStyle}>
        <div className="header-container">
          List users
          <Space className="table-button-group">
            <Button
              type="primary"
              icon={<PlusOutlined style={{ fontSize: "16px" }} />}
            >
              Add User
            </Button>
            <Button
              color="cyan"
              variant="outlined"
              icon={<ReloadOutlined style={{ fontSize: "16px" }} />}
            >
              Refresh
            </Button>
          </Space>
        </div>
        <div className="table-container">
          <Table<IDataType>
            columns={columns}
            dataSource={data}
            size="middle"
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
              onShowSizeChange: (current, size) => handlePageSizeChange(size),
              pageSize: pageSize,
              responsive: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default User;
