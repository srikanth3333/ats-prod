"use client"; // Use this if you're using Next.js App Router

import { Badge, Pagination, PaginationProps, Table, TableProps } from "antd";
import { ColumnType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import ActionJobPost from "./ui-addons/action-job-post";
import ActionView from "./ui-addons/action-view";
import DateView from "./ui-addons/date-view";
import MapObject from "./ui-addons/map-object";

// Define interfaces for column configuration and data
interface ColumnConfig {
  label: string;
  name: string;
  type?:
    | "text"
    | "badge"
    | "custom"
    | "date"
    | "action"
    | "mapObject"
    | "action-job-post";
  render?: (value: any, record: any, index: number) => React.ReactNode;
  sorter?: boolean | ((a: any, b: any) => number);
  filter?: boolean;
  width?: string | number;
  fixed?: string;
  mapRecord?: any;
  submitData?: any;
}

interface DataTableProps {
  columnsConfig: ColumnConfig[];
  data: any[];
  loading?: boolean;
  rowKey?: string;
  total?: number;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onTableChange?: TableProps<any>["onChange"];
  rowSelection?: TableProps<any>["rowSelection"];
  expandable?: TableProps<any>["expandable"];
  scroll?: TableProps<any>["scroll"];
  bordered?: boolean;
  size?: "large" | "middle" | "small";
  showHeader?: boolean;
  sticky?: boolean;
  refetch?: () => void;
}

// Utility function to render cell based on type
const renderCell = (
  value: any,
  column: ColumnConfig,
  record: any,
  index: number,
  refetch?: () => void
) => {
  if (column.render) {
    return column.render(value, record, index);
  }
  if (column.type === "badge") {
    return <Badge status={value ? "success" : "default"} text={value || "-"} />;
  }
  if (column.type === "date") {
    return <DateView val={value} />;
  }
  if (column.type === "action") {
    return (
      <ActionView
        submitData={column?.submitData}
        val={value}
        refetch={refetch}
      />
    );
  }
  if (column.type === "mapObject") {
    return <MapObject val={value} mapObject={column?.mapRecord} />;
  }
  if (column.type === "action-job-post") {
    return <ActionJobPost val={value} record={record} refetch={refetch} />;
  }

  return value || "-";
};

// Main DataTable component
const DataTable: React.FC<DataTableProps> = ({
  columnsConfig,
  data,
  loading = false,
  rowKey = "id",
  total = 0,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  onTableChange,
  rowSelection,
  expandable,
  scroll,
  bordered = false,
  size = "middle",
  showHeader = true,
  sticky = false,
  refetch,
}) => {
  // State for pagination
  const [pagination, setPagination] = useState<PaginationProps>({
    current: currentPage,
    pageSize,
    total,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  });

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      current: currentPage,
      pageSize,
      total,
    }));
  }, [currentPage, pageSize, total]);

  const handlePaginationChange: PaginationProps["onChange"] = (
    page,
    pageSize
  ) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
    if (onPageChange) {
      onPageChange(page, pageSize);
    }
  };

  // Generate Ant Design Table columns from config
  const columns: ColumnType<any>[] = columnsConfig.map((col) => ({
    title: col.label,
    dataIndex: col.name,
    key: col.name,
    render: (value, record, index) =>
      renderCell(value, col, record, index, refetch),
    sorter: col.sorter,
    filtered: col.filter,
    width: col.width,
    fixed:
      col.fixed === "left" || col.fixed === "right" ? col.fixed : undefined,
  }));

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={rowKey}
        pagination={false}
        onChange={onTableChange}
        rowSelection={rowSelection}
        expandable={expandable}
        scroll={scroll}
        bordered={bordered}
        size={size}
        showHeader={showHeader}
        sticky={sticky}
      />
      <div className="flex justify-end mt-4">
        <Pagination
          {...pagination}
          onChange={handlePaginationChange}
          showQuickJumper
          showLessItems
        />
      </div>
    </div>
  );
};

export default DataTable;
