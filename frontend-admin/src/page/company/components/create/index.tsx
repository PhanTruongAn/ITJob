import { theme } from "antd";
import React from "react";
import CreateCompanyHeader from "./components/CreateCompanyHeader";
import CreateCompanyForm from "./components/CreateCompanyForm";

const CreateCompanyPage: React.FC = () => {
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
      <CreateCompanyHeader />
      <div style={defaultStyle}>
        <CreateCompanyForm />
      </div>
    </div>
  );
};

export default CreateCompanyPage;
