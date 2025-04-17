import { Button, Col, Form, Input, Row, Select, Space, theme } from "antd";
import React from "react";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { ECompanyType } from "../../../types/enum";
import { COMPANY_SIZE } from "../common/constants";
import { useGetCountries } from "../common/services";
import { IFilterCompany } from "../common/interface";

export interface UserFilterProps {
  onFilter: ({
    name,
    address,
    companySize,
    companyType,
    countryId,
  }: IFilterCompany) => void;
  onClear: () => void;
}

export const CompanyListHeaderToolbar: React.FC<UserFilterProps> = ({
  onFilter,
  onClear,
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const { data } = useGetCountries();
  const formStyle: React.CSSProperties = {
    maxWidth: "none",
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    padding: 16,
    paddingBottom: 8,
  };

  const onFinish = (values: any) => {
    onFilter(values);
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={[16, 8]}>
        <Col span={8}>
          <Form.Item name="name" label="Name">
            <Input placeholder="Input company name" size="middle" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="address" label="Address">
            <Input placeholder="Input company address" size="middle" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="companySize" label="Company Size">
            <Select
              placeholder="Select company size"
              size="middle"
              optionFilterProp="children"
              showSearch
            >
              {COMPANY_SIZE.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="companyType" label="Company Type">
            <Select
              placeholder="Select company type"
              size="middle"
              optionFilterProp="children"
              showSearch
            >
              {Object.entries(ECompanyType).map(([key, value]) => (
                <Select.Option key={key} value={value}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="countryId" label="Country">
            <Select
              placeholder="Select country"
              showSearch
              optionFilterProp="children"
              size="middle"
            >
              {data?.data.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} style={{ textAlign: "right" }}>
          <Form.Item>
            <Space size="small">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                size="middle"
                style={{ outline: "none" }}
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  onClear();
                }}
                icon={<ClearOutlined />}
                size="middle"
                style={{ outline: "none" }}
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
