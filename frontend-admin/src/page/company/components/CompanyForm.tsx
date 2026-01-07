import { UploadOutlined } from "@ant-design/icons"
import MDEditor from "@uiw/react-md-editor"
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Upload,
} from "antd"
import { FormInstance, useWatch } from "antd/es/form/Form"
import { Dispatch, SetStateAction } from "react"
import { useNavigate } from "react-router-dom"
import { ECompanyType } from "../../../types/enum"
import { COMPANY_SIZE, COMPANY_STATUS } from "../common/constants"
import { useGetCountries, usePresignImage } from "../common/hooks"
const { Option } = Select

interface CompanyFormProps {
  type: "create" | "edit" | "view"
  form: FormInstance
  onSubmit: (payload: any) => Promise<void> | void
  previewImage?: string | null
  setPreviewImage: Dispatch<SetStateAction<string | null>>
}

const CompanyForm = ({
  type,
  form,
  onSubmit,
  previewImage,
  setPreviewImage,
}: CompanyFormProps) => {
  const navigate = useNavigate()
  const description = useWatch("description", form)
  const { handleUpload, isUploading } = usePresignImage()
  const { data: countriesData } = useGetCountries()

  const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList)

  const handlePreview = (file: any) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
  const handleFinish = async () => {
    try {
      const values = await form.validateFields()
      const file = values.logo?.[0]

      let imageUrl = ""

      if (file?.originFileObj) {
        imageUrl = await handleUpload(file.originFileObj)
      } else if (file?.url) {
        imageUrl = file.url
      }

      await onSubmit({
        ...values,
        logo: imageUrl,
      })
    } catch (error) {
      console.log("Validation failed:", error)
    }
  }

  const isView = type === "view"

  return (
    <Form form={form} layout="vertical" name="add_company_form">
      <Row gutter={[16, 16]}>
        <Col span={18}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Company Name"
                rules={[
                  { required: true, message: "Please enter company name" },
                ]}
              >
                <Input placeholder="Enter company name" disabled={isView} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="countryId"
                label="Country"
                rules={[{ required: true, message: "Please select a country" }]}
              >
                <Select
                  placeholder="Select a country"
                  optionFilterProp="children"
                  showSearch
                  disabled={type === "edit" || isView}
                >
                  {countriesData?.data.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="industry"
                label="Industry"
                rules={[{ required: true, message: "Please enter industry" }]}
              >
                <Input
                  placeholder="Enter industry (e.g., Banking)"
                  disabled={isView}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="companyType"
                label="Company Type"
                rules={[
                  { required: true, message: "Please select company type" },
                ]}
              >
                <Select placeholder="Select company type" disabled={isView}>
                  {Object.keys(ECompanyType).map((key) => (
                    <Option key={key} value={key}>
                      {ECompanyType[key as keyof typeof ECompanyType]}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="companySize"
                label="Company Size"
                rules={[
                  { required: true, message: "Please select company size" },
                ]}
              >
                <Select placeholder="Select company size" disabled={isView}>
                  {COMPANY_SIZE.map((size) => (
                    <Option key={size.value} value={size.value}>
                      {size.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="overtime"
                label="Overtime"
                valuePropName="checked"
              >
                <Checkbox disabled={isView}>Allow Overtime</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          {(type === "edit" || type === "view") && (
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Company Status"
                  rules={[
                    {
                      required: true,
                      message: "Please select company status",
                    },
                  ]}
                >
                  <Select placeholder="Select company status" disabled={isView}>
                    {COMPANY_STATUS.map((size) => (
                      <Option key={size.value} value={size.value}>
                        {size.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}
        </Col>

        <Col span={6}>
          <Form.Item
            name="logo"
            label="Logo"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Please upload a logo" }]}
          >
            <Upload.Dragger
              //   disabled={isView}
              name="logo"
              listType="picture"
              maxCount={1}
              beforeUpload={(file) => {
                handlePreview(file)
                return false
              }}
              // showUploadList={{
              //   showPreviewIcon: true,
              //   showRemoveIcon: true,
              // }}
              onRemove={() => {
                setPreviewImage(null)
                form.setFieldsValue({ logo: null })
              }}
              style={{ height: "200px", textAlign: "center" }}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ maxWidth: "100%" }}
                />
              ) : (
                <div>
                  <UploadOutlined style={{ fontSize: "24px" }} />
                  <p>Drag & Drop or Click to Upload Logo</p>
                </div>
              )}
            </Upload.Dragger>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item name="workingDays" label="Working Days">
            <Checkbox.Group>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <Checkbox disabled={isView} key={day} value={day.toUpperCase()}>
                  {day}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input placeholder="Enter address" disabled={isView} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <MDEditor
              value={description || ""}
              onChange={(value) => form.setFieldsValue({ description: value })}
              height={400}
            />
            {/* <QuillEditor
              value={form.getFieldValue("description")}
              onChange={(value) => form.setFieldsValue({ description: value })}
            /> */}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24} style={{ textAlign: "right" }}>
          <Space>
            {!isView && (
              <Button
                loading={isUploading}
                variant="outlined"
                type="primary"
                onClick={handleFinish}
              >
                Submit
              </Button>
            )}

            <Button
              onClick={() => {
                navigate(-1)
              }}
            >
              Cancel
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  )
}
export default CompanyForm
