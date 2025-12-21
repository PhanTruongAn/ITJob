import { theme } from "antd"
import React from "react"
import EditJobForm from "./components/EditJobForm"
import EditJobHeader from "./components/EditJobHeader"

const EditJobPage: React.FC = () => {
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
      <EditJobHeader />
      <div style={defaultStyle}>
        <EditJobForm />
      </div>
    </div>
  )
}

export default EditJobPage
