import { Spin, Typography } from "antd";
import Lottie from "lottie-react";
import loadingAnimation from "../lotties/waiting.json";

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
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            style={{ width: 150, height: 150 }}
          />
        }
        size="large"
      />
      <Typography.Text style={{ fontSize: 18, color: "#555" }}>
        {isDashboard ? "Đang tải dữ liệu dashboard..." : "Đang tải..."}
      </Typography.Text>
    </div>
  );
}
