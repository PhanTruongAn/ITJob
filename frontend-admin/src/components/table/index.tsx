import { Alert, Button, Table } from "antd";
import { useTranslation } from "react-i18next";

import type { ColumnsType } from "antd/es/table";
import EmptyData from "../empty/EmptyData";

interface CustomTableProps<T> {
  columns: ColumnsType<T>;
  data: T[];
  loading?: boolean;
  total: number;
  page: number;
  pageSize: number;
  isPagination?: boolean;
  onTableChange: (page: number, pageSize: number, sortBy?: string) => void;
  isError?: boolean;
  onRetry?: () => void;
}

const CustomGlobalTable = <T extends { id: string | number }>({
  columns,
  data,
  loading,
  total,
  page,
  pageSize,
  isPagination,
  onTableChange,
  isError = false,
  onRetry,
}: CustomTableProps<T>) => {
  const { t } = useTranslation();
  return (
    <>
    {isError && data.length > 0 && (
      <Alert
        type="error"
        showIcon
        message={t("common.loadError")}
        action={<Button size="small" onClick={onRetry}>{t("common.retry")}</Button>}
        style={{ marginBottom: 12 }}
      />
    )}
    <Table<T>
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={(record) => record.id}
      size="middle"
      onChange={(pagination, filters, sorter) => {
        const { order, field } = sorter as {
          order?: "ascend" | "descend";
          field?: string;
        };

        let sortBy = undefined;
        if (order && field) {
          sortBy = `${field},${order === "ascend" ? "asc" : "desc"}`;
        }

        onTableChange(pagination.current!, pagination.pageSize!, sortBy);
      }}
      pagination={
        isPagination !== false
          ? {
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
              total,
              current: page,
              pageSize,
              responsive: true,
            }
          : false
      }
      locale={{
        emptyText: isError ? (
          <Alert
            type="error"
            showIcon
            message={t("common.loadError")}
            action={<Button size="small" onClick={onRetry}>{t("common.retry")}</Button>}
          />
        ) : <EmptyData />,
      }}
    />
    </>
  );
};

export default CustomGlobalTable;
