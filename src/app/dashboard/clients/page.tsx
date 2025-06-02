"use client";

import DataTable from "@/components/common/data-table";
import DrawerModal from "@/components/common/drawer-modal";
import FiltersForm from "@/components/common/filters-form";
import SubmitForm from "@/components/common/submit-form";
import { useGetList } from "@/hooks/use-get-list";
import { DBName } from "@/utils/db-tables-names";
import {
  columnsConfig,
  filterInputs,
  formInputs,
} from "@/utils/table-json/clients";
import { Button } from "antd";
import { useCallback, useMemo } from "react";
import { createRecord } from "../actions/common/post/action";

function Page() {
  const hookOptions = useMemo(
    () => ({
      tableName: DBName.clients,
      columnToSort: "name",
      sortDirection: "asc" as const,
      searchColumns: ["name"],
      foreignKeys: {},
      applyUserIdFilter: false,
      profileId: undefined,
    }),
    []
  );

  const {
    currentPage,
    pageSize,
    total,
    data,
    open,
    loading,
    setOpen,
    handlePageChange,
    refetch,
    setCurrentPage,
    setFilters,
  } = useGetList(hookOptions);

  const onFilterChange = useCallback(
    (values: any) => {
      setFilters((prevFilters: { [key: string]: any }) => {
        const newFilters = {
          name: values.name ? { operator: "ilike", value: values.name } : "",
        };
        if (JSON.stringify(prevFilters) === JSON.stringify(newFilters)) {
          return prevFilters;
        }
        return newFilters;
      });
      setCurrentPage(1);
    },
    [setFilters, setCurrentPage]
  );

  const onToggle = useCallback(() => {
    setOpen(!open);
  }, [setOpen, open]);

  const handleSubmit = useCallback(
    async (values: Record<string, any>) => {
      const result = await createRecord(DBName.clients, values);
      if (result?.success) {
        onToggle();
        refetch();
      }
      return {
        ...result,
        error: result.error
          ? typeof result.error === "string"
            ? result.error
            : result.error.message || "Unknown error"
          : undefined,
      };
    },
    [onToggle, refetch]
  );

  // Memoize complex objects to prevent unnecessary re-renders
  const scrollConfig = useMemo(() => ({ x: 800 }), []);

  return (
    <div className="shadow-lg rounded-lg p-5 bg-white">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-xl">Clients</span>
        <Button type="primary" onClick={onToggle}>
          Create New Client
        </Button>
      </div>

      <div className="mb-4">
        <FiltersForm
          fields={filterInputs}
          onFilterChange={onFilterChange}
          liveUpdate={true}
          submitButton={false}
        />
      </div>

      <div>
        <DataTable
          columnsConfig={columnsConfig}
          data={data}
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          loading={loading}
          scroll={scrollConfig}
          bordered
          size="middle"
          sticky
          refetch={refetch}
        />
      </div>

      <div>
        <DrawerModal open={open} title="Create New Client" onClose={onToggle}>
          <div>
            <SubmitForm fields={formInputs} onSubmit={handleSubmit} />
          </div>
        </DrawerModal>
      </div>
    </div>
  );
}

export default Page;
