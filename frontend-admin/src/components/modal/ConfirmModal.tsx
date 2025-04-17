import React from "react";
import { Modal, Button } from "antd";
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  ExclamationCircleTwoTone,
} from "@ant-design/icons";

type ModalType = "success" | "error" | "warning";

interface ConfirmModalProps {
  visible: boolean;
  loading?: boolean;
  type?: ModalType;
  title?: string;
  content: string;
  onOk?: (data?: any) => void;
  onCancel?: () => void;
  customFooter?: React.ReactNode;
}

const iconMap = {
  success: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
  error: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
  warning: <ExclamationCircleTwoTone twoToneColor="#faad14" />,
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  loading = false,
  type = "warning",
  title = "Confirm",
  content,
  onOk,
  onCancel,
  customFooter,
}) => {
  return (
    <Modal
      open={visible}
      title={
        <span>
          {iconMap[type]} <span style={{ marginLeft: 8 }}>{title}</span>
        </span>
      }
      onCancel={onCancel}
      footer={
        customFooter ?? [
          <Button key="cancel" onClick={onCancel} icon={<CloseOutlined />}>
            No
          </Button>,
          <Button
            key="ok"
            type="primary"
            loading={loading}
            onClick={onOk}
            icon={<CheckOutlined />}
          >
            Yes
          </Button>,
        ]
      }
    >
      <p>{content}</p>
    </Modal>
  );
};

export default ConfirmModal;
