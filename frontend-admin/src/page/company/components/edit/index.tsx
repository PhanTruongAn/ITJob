import { theme } from "antd"
import React from "react"
import EditCompany from "./components/EditCompany"
import EditCompanyHeader from "./components/EditCompanyHeader"

const EditCompanyPage: React.FC = () => {
  const { token } = theme.useToken()
  const defaultStyle: React.CSSProperties = {
    display: "flex",
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    marginTop: 13,
    flexDirection: "column",
    padding: 20,
    overflowY: "auto",
  }
  return (
    <div>
      <EditCompanyHeader />
      <div style={defaultStyle}>
        <EditCompany />
      </div>
    </div>
  )
}

export default EditCompanyPage
