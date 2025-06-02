"use client";

import DataTable from "@/components/common/data-table";
import FiltersForm from "@/components/common/filters-form";
import { useGetList } from "@/hooks/use-get-list";
import { RootState } from "@/store";
import { DBName } from "@/utils/db-tables-names";
import { columnsConfig, filterInputs } from "@/utils/table-json/job-postings";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { createRecord } from "../actions/common/post/action";

function Page() {
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();
  const hookOptions = useMemo(
    () => ({
      tableName: DBName.jobs,
      columnToSort: "created_at",
      sortDirection: "asc" as const,
      searchColumns: [""],
      foreignKeys: {},
      filters: { job_status: "draft" },
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
    loading,
    handlePageChange,
    refetch,
    setCurrentPage,
    setFilters,
  } = useGetList(hookOptions);

  const onFilterChange = useCallback(
    (values: any) => {
      setFilters((prevFilters: { [key: string]: any }) => {
        const newFilters = {
          role: values.role ? { operator: "ilike", value: values.role } : "",
          job_status: values.job_status
            ? { operator: "eq", value: values.job_status }
            : "",
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

  const onToggle = async () => {
    const result: any = await createRecord(DBName.jobs, {
      user_id: user?.user?.id,
      company_id: user?.company?.id,
      profile_id: user?.userProfile?.id,
    });
    if (result?.success) {
      router.push(
        `/dashboard/job-postings/interview-setup?id=${result?.data?.id}`
      );
    }
  };
  const scrollConfig = useMemo(() => ({ x: 800 }), []);

  return (
    <div className="shadow-lg rounded-lg p-5 bg-white">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-xl">Clients</span>
        <Button type="default" onClick={onToggle}>
          Create New Job Posting
        </Button>
      </div>

      <div className="mb-4">
        <FiltersForm
          fields={filterInputs}
          onFilterChange={onFilterChange}
          liveUpdate={true}
          submitButton={false}
          defaultValues={{ job_status: "active" }}
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
