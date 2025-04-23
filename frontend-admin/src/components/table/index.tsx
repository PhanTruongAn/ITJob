import { Table } from "antd";

import type { ColumnsType } from "antd/es/table";
import EmptyData from "../empty/EmptyData";

interface CustomTableProps<T> {
  columns: ColumnsType<T>;
  data: T[];
  loading?: boolean;
  total: number;
  page: number;
  pageSize: number;
  onTableChange: (page: number, pageSize: number, sortBy?: string) => void;
}

const CustomGlobalTable = <T extends { id: string | number }>({
  columns,
  data,
  loading,
  total,
  page,
  pageSize,
  onTableChange,
}: CustomTableProps<T>) => {
  return (
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
      pagination={{
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20"],
        total,
        current: page,
        pageSize,
        responsive: true,
      }}
      locale={{
        emptyText: <EmptyData />,
      }}
    />
  );
};

export default CustomGlobalTable;
