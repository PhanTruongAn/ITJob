import { message } from "antd"; // Giả sử bạn dùng Ant Design
import { useCallback, useRef, useState } from "react";

const useRefresh = (refetch: () => Promise<any>, isFetching = false) => {
  const [isRefreshing, setRefreshing] = useState(false);
  const requestInFlight = useRef(false);

  const runRefetch = useCallback(async (showNotification: boolean) => {
    if (isFetching || requestInFlight.current) return;
    requestInFlight.current = true;
    setRefreshing(true);
    try {
      const result = await refetch();
      if (showNotification) {
        if (result.status === "error") {
          message.error("Refresh failed");
        } else if (result.data && result.data.statusCode !== 200) {
          message.error(`Refresh failed with status code: ${result.data.statusCode}`);
        } else {
          message.success("Refresh success");
        }
      }
    } catch (error) {
      if (showNotification) message.error("Refresh failed due to an error");
    } finally {
      requestInFlight.current = false;
      setRefreshing(false);
    }
  }, [isFetching, refetch]);

  const handleRefresh = useCallback(() => runRefetch(true), [runRefetch]);
  const handleRetry = useCallback(() => runRefetch(false), [runRefetch]);

  return { isLoading: isFetching || isRefreshing, handleRefresh, handleRetry };
};

export default useRefresh;
