"use client";

import DataTable from "@/components/common/data-table";
import FiltersForm from "@/components/common/filters-form";
import { useGetList } from "@/hooks/use-get-list";
import { DBName } from "@/utils/db-tables-names";
import { filterInputs } from "@/utils/table-json/clients";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

function Page() {
  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const hookOptions = useMemo(
    () => ({
      tableName: DBName.candidates,
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

  useEffect(() => {
    setFilters({ job_id: search });
  }, []);

  // Memoize complex objects to prevent unnecessary re-renders
  const scrollConfig = useMemo(() => ({ x: 800 }), []);

  const columnsConfig: any[] = [
    {
      label: "Name",
      name: "name",
      filter: true,
      width: 200,
    },
    {
      label: "Email Id",
      name: "email",
      filter: true,
      width: 200,
    },
  ];
  return (
    <div className="shadow-lg rounded-lg p-5 bg-white">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-xl">Responses</span>
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
    </div>
  );
}

export default Page;
