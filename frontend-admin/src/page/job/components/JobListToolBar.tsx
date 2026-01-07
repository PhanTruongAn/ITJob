import { ClearOutlined, SearchOutlined } from "@ant-design/icons"
import { Button, Col, Form, Input, Row, Select, Space, theme } from "antd"
import React from "react"
import { LevelEnum } from "../common/enums"
import { JobFilter } from "../common/interfaces"
export interface JobFilterProps {
  onFilter: ({
    companyId,
    level,
    location,
    maxSalary,
    minSalary,
    name,
    skillId,
  }: JobFilter) => void
  onClear: () => void
}

export const JobListHeaderToolbar: React.FC<JobFilterProps> = ({
  onFilter,
  onClear,
}) => {
  const { token } = theme.useToken()
  const [form] = Form.useForm()
  const formStyle: React.CSSProperties = {
    maxWidth: "none",
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    padding: 16,
    paddingBottom: 5,
  }

  const onFinish = (values: any) => {
    onFilter(values)
  }

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={16} justify="end">
        <Col span={8}>
          <Form.Item name="companyId" label="Company Name">
            <Input placeholder="Input company name" size="middle" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="level" label="Job Level">
            <Select
              placeholder="Select job level"
              size="middle"
              optionFilterProp="children"
              showSearch
            >
              {Object.entries(LevelEnum).map(([key, value]) => (
                <Select.Option key={key} value={key}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="name" label="Job Name">
            <Input placeholder="Input job name" size="middle" />
          </Form.Item>
        </Col>
        {/* <Col span={8}>
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
        </Col> */}
      </Row>

      <Row gutter={16} justify="start">
        <Col span={8}>
          <Form.Item name="skillId" label="Skill Name">
            {/* <Select
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
            </Select> */}
            <Input placeholder="Input skill name" size="middle" />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item name="location" label="Location">
            <Input placeholder="Input location" size="middle" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16} justify="end">
        <Col span={8}>
          <Form.Item name="maxSalary" label="Max Salary">
            <Input placeholder="Input max salary" size="middle" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="minSalary" label="Min Salary">
            <Input placeholder="Input min salary" size="middle" />
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
                  form.resetFields()
                  onClear()
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
  )
}
