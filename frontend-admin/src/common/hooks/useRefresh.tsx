import { message } from "antd"; // Giả sử bạn dùng Ant Design
import { useState } from "react";

const useRefresh = (refetch: any) => {
  const [isLoading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const result = await refetch();
      if (result.status === "error") {
        message.error("Refresh failed");
      } else if (result.data && result.data.statusCode !== 200) {
        message.error(
          `Refresh failed with status code: ${result.data.statusCode}`
        );
      } else {
        message.success("Refresh success");
      }
    } catch (error) {
      message.error("Refresh failed due to an error");
    } finally {
      setLoading(false);
    }
  };

  return { isLoading, handleRefresh };
};

export default useRefresh;
