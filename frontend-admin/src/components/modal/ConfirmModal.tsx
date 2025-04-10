import React from "react";
import { Modal } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleTwoTone,
} from "@ant-design/icons";

type ModalType = "success" | "error" | "warning";

interface ConfirmModalProps {
  visible: boolean;
  type?: ModalType;
  title?: string;
  content: string;
  onOk: (data?: any) => void;
  onCancel: () => void;
}

const iconMap = {
  success: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
  error: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
  warning: <ExclamationCircleTwoTone twoToneColor="#faad14" />,
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  type = "warning",
  title = "Confirm",
  content,
  onOk,
  onCancel,
}) => {
  return (
    <Modal
      open={visible}
      title={
        <span>
          {iconMap[type]} <span style={{ marginLeft: 8 }}>{title}</span>
        </span>
      }
      onOk={onOk}
      onCancel={onCancel}
      okText="Yes"
      cancelText="No"
    >
      <p>{content}</p>
    </Modal>
  );
};

export default ConfirmModal;
