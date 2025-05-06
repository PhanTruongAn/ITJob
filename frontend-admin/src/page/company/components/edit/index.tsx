import { theme } from "antd";
import React from "react";
import EditCompanyHeader from "./components/EditCompanyHeader";
import EditCompanyForm from "./components/EditCompanyForm";

const EditCompanyPage: React.FC = () => {
  const { token } = theme.useToken();
  const defaultStyle: React.CSSProperties = {
    display: "flex",
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    marginTop: 13,
    flexDirection: "column",
    padding: 20,
    overflowY: "auto",
  };
  return (
    <div>
      <EditCompanyHeader />
      <div style={defaultStyle}>
        <EditCompanyForm />
      </div>
    </div>
  );
};

export default EditCompanyPage;
