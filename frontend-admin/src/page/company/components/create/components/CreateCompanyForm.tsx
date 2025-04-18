import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  Upload,
  Button,
  message,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import MDEditor from "@uiw/react-md-editor";
import { ECompanyType } from "../../../../../types/enum";
import { COMPANY_SIZE } from "../../../common/constants";
import { useGetCountries } from "../../../common/services";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "../../../../../common/constants";
import axios from "axios";

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
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const handleUploadChange = (info: any) => {
    const file = info.file.originFileObj;
    const reader = new FileReader();

    reader.onloadend = () => {
      // Lưu ảnh tạm thời trên local
      setLogoPreview(reader.result as string);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleOk = async () => {
    form
      .validateFields()
      .then(async (values) => {
        let logoUrl = logoPreview; // Lấy URL của ảnh từ state

        // Nếu có logo, ta sẽ upload ảnh lên Cloudinary
        if (logoPreview) {
          setUploading(true);
          const formData = new FormData();
          const file = values.logo[0].originFileObj;
          formData.append("file", file);
          formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
          formData.append("folder", "Company");

          try {
            const response = await axios.post(
              `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
              formData
            );
            if (response.status === 200) {
              logoUrl = response.data.secure_url; // Lấy URL ảnh sau khi upload thành công
            } else {
              message.error("Upload to Cloudinary failed");
            }
          } catch (error) {
            message.error(
              "Upload failed. Please check your network and try again."
            );
            console.error(error);
          } finally {
            setUploading(false);
          }
        }

        console.log("Check data: ", values);
        form.resetFields();
        setLogoPreview(null); // Reset logoPreview
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  const { data } = useGetCountries();
  return (
    <Form form={form} layout="vertical" name="add_company_form">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Company Name"
            rules={[{ required: true, message: "Please enter company name" }]}
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
            <Select placeholder="Select a country">
              {data?.data.map((item) => (
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
            rules={[{ required: true, message: "Please select company type" }]}
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
            rules={[{ required: true, message: "Please select company size" }]}
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
          <Form.Item name="overtime" label="Overtime" valuePropName="checked">
            <Checkbox>Allow Overtime</Checkbox>
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
              value={form.getFieldValue("description") || ""}
              onChange={(value) => form.setFieldsValue({ description: value })}
              height={300} // Tăng chiều cao để lớn hơn
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            name="logo"
            label="Logo"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Please upload a logo" }]}
          >
            <Upload
              name="logo"
              listType="picture"
              maxCount={1}
              // beforeUpload={() => false} // Ngăn tải lên server, xử lý local
              onChange={handleUploadChange}
            >
              <Button icon={<UploadOutlined />}>Upload Logo</Button>
            </Upload>
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo Preview"
                style={{
                  width: "100%",
                  maxWidth: "200px",
                  marginTop: "10px",
                }}
              />
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateCompanyForm;
