import MDEditor from "@uiw/react-md-editor"
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  message,
} from "antd"
import { useWatch } from "antd/es/form/Form"
import React from "react"
import { useNavigate } from "react-router-dom"
import { PATH_DASHBOARD } from "../../../../../routes/paths"
import { IBackendRes } from "../../../../../types/backend"
import { LevelEnum } from "../../../common/enums"
import { useCreateJob } from "../../../common/hooks"
import { IJob } from "../../../common/interfaces"

const { Option } = Select

const CreateJobForm: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { mutate } = useCreateJob()
  // const { data: companies } = useGetCompanyList()

  const description = useWatch("description", form)

  const handleOk = async () => {
    try {
      const values = await form.validateFields()

      const payload = {
        ...values,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
      }

      mutate(payload, {
        onSuccess: (res: IBackendRes<IJob>) => {
          message.success(res.message || "Job created successfully!")
          form.resetFields()
        },
      })
    } catch (error) {
      console.log("Validate Failed:", error)
    }
  }

  return (
    <Form layout="vertical" form={form} name="create_job_form">
      <Row gutter={[16, 16]}>
        <Col span={18}>
          {/* ROW 1 */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Job Title"
                rules={[{ required: true, message: "Please enter job title" }]}
              >
                <Input placeholder="Enter job title" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: "Please enter location" }]}
              >
                <Input placeholder="Enter job location" />
              </Form.Item>
            </Col>
          </Row>

          {/* ROW 2 */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[
                  { required: true, message: "Please enter quantity" },
                  { type: "number", min: 1, message: "Must be >= 1" },
                ]}
              >
                <InputNumber
                  placeholder="Enter quantity"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="salary"
                label="Salary"
                rules={[{ required: true, message: "Please enter salary" }]}
              >
                <InputNumber
                  placeholder="Enter salary"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* ROW 3 */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="level"
                label="Level"
                rules={[{ required: true, message: "Please select level" }]}
              >
                <Select placeholder="Select level">
                  {Object.keys(LevelEnum).map((key) => (
                    <Option key={key} value={key}>
                      {key}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* <Col span={12}>
              <Form.Item
                name="companyId"
                label="Company"
                rules={[{ required: true, message: "Please select company" }]}
              >
                <Select placeholder="Select company">
                  {companies?.map((c: any) => (
                    <Option key={c.id} value={c.id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col> */}
          </Row>

          {/* ROW 4 */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[
                  { required: true, message: "Please select start date" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: true, message: "Please select end date" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Active */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="isActive" valuePropName="checked">
                <Checkbox>Active</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Description */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <MDEditor
              value={description || ""}
              onChange={(val) => form.setFieldsValue({ description: val })}
              height={300}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Submit */}
      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Space>
            <Button type="primary" onClick={handleOk}>
              Submit
            </Button>
            <Button onClick={() => navigate(PATH_DASHBOARD.jobManage.list)}>
              Cancel
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  )
}

export default CreateJobForm
