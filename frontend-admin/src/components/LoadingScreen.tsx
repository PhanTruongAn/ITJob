import { Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

type Props = {
  isDashboard?: boolean;
};

export default function LoadingScreen({ isDashboard }: Props) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
        flexDirection: "column",
      }}
    >
      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 48, color: "#3386D7" }} spin />
        }
        size="large"
      />
      <Typography.Text style={{ marginTop: 16, fontSize: 18, color: "#555" }}>
        {isDashboard ? "Đang tải dữ liệu dashboard..." : "Đang tải..."}
      </Typography.Text>
    </div>
  );
}
