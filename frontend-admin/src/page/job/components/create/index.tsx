import { theme } from "antd"
import CreateJobForm from "./components/CreateJobForm"
import CreateJobHeader from "./components/CreateJobHeader"

const CreateJobPage: React.FC = () => {
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
      <CreateJobHeader />
      <div style={defaultStyle}>
        <CreateJobForm />
      </div>
    </div>
  )
}

export default CreateJobPage
