import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Upload,
  Button,
  message,
  Row,
  Col,
  Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import MDEditor from "@uiw/react-md-editor";
import { ECompanyType } from "../../../../../types/enum";
import { COMPANY_SIZE } from "../../../common/constants";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "../../../../../routes/paths";
import { useWatch } from "antd/es/form/Form";
import {
  useCreateCompany,
  useGetCountries,
  usePresignImage,
} from "../../../common/hooks";

const { Option } = Select;

interface CreateCompanyForm {
  name: string;
  countryId: number;
  industry: string;
  companyType: string;
  companySize: string;
  overtime: boolean;
  workingDays: string[];
  description: string;
  address: string;
  logo: string;
}

const CreateCompanyForm: React.FC = ({}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const description = useWatch("description", form);
  const { handleUpload, isUploading } = usePresignImage();
  const { mutate } = useCreateCompany();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const file = values.logo[0]?.originFileObj as File;

      const imageUrl = await handleUpload(file);

      if (!imageUrl) {
        message.error("Failed to upload logo");
        return;
      }

      mutate(
        { ...values, logo: imageUrl, country: { id: values.countryId } },
        {
          onSuccess: (res) => {
            if (res.statusCode >= 400) {
              message.error(res.message);
            } else {
              message.success(res.message);
              form.resetFields();
              setPreviewImage(null);
            }
          },
          onError: () => {
            message.error("Error when creating company!");
          },
        }
      );
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  const { data: countriesData } = useGetCountries();

  const handlePreview = (file: any) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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
                <Input placeholder="Enter company name" />
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
                <Input placeholder="Enter industry (e.g., Banking)" />
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
                <Select placeholder="Select company type">
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
                <Select placeholder="Select company size">
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
                <Checkbox>Allow Overtime</Checkbox>
              </Form.Item>
            </Col>
          </Row>
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
              name="logo"
              listType="picture"
              maxCount={1}
              beforeUpload={(file) => {
                handlePreview(file);
                return false;
              }}
              // showUploadList={{
              //   showPreviewIcon: true,
              //   showRemoveIcon: true,
              // }}
              onRemove={() => {
                setPreviewImage(null);
                form.setFieldsValue({ logo: null });
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
                <Checkbox key={day} value={day.toUpperCase()}>
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
            <Input placeholder="Enter address" />
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
              height={300}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24} style={{ textAlign: "right" }}>
          <Space>
            <Button
              loading={isUploading}
              variant="outlined"
              type="primary"
              onClick={handleOk}
            >
              Submit
            </Button>
            <Button
              onClick={() => {
                navigate(PATH_DASHBOARD.companyManage.list);
              }}
            >
              Cancel
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateCompanyForm;
