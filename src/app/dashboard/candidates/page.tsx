"use client";

import DataTable from "@/components/common/data-table";
import DrawerModal from "@/components/common/drawer-modal";
import FiltersForm from "@/components/common/filters-form";
import SubmitForm from "@/components/common/submit-form";
import { useGetList } from "@/hooks/use-get-list";
import { RootState } from "@/store";
import { DBName } from "@/utils/db-tables-names";
import { filterInputs } from "@/utils/table-json/clients";
import { Button } from "antd";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { createRecordBulk } from "../actions/common/post/action";

function Page() {
  const user = useSelector((state: RootState) => state.user.user);

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

  const onToggle = useCallback(() => {
    setOpen(!open);
  }, [setOpen, open]);

  const handleSubmit = useCallback(
    async (values: Record<string, any>) => {
      console.log(values);
      const updatedData = values?.candidates?.map((record: any) => ({
        ...record,
        user_id: user?.user?.id,
        company_id: user?.company?.id,
        user_profile: user?.userProfile?.id,
      }));
      const result = await createRecordBulk(DBName.candidates, updatedData);
      console.log(result);
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

  const columns = [
    { label: "Name", name: "name" },
    { label: "Email", name: "email" },
    { label: "Experience", name: "exp_max" },
    { label: "CTC", name: "ctc" },
    { label: "Current Company", name: "current_company" },
    // { label: "Resume", name: "resume_url", type: "link" },
    { label: "Job Status", name: "job_status" },
  ];

  const formFields = [
    {
      type: "dynamic",
      name: "candidates",
      label: "Candidates",
      colSpan: "col-span-12",
      nestedFields: [
        {
          type: "text" as "text",
          name: "name",
          label: "Name",
          required: true,
          colSpan: "col-span-3",
          errorMsg: "Name is required",
        },
        {
          type: "text" as "text",
          name: "email",
          label: "Email",
          required: true,
          colSpan: "col-span-3",
          errorMsg: "Email is required",
        },
        {
          type: "number" as "number",
          name: "exp_min",
          label: "Experience min",
          required: true,
          colSpan: "col-span-3",
          errorMsg: "Experience min is required",
        },
        {
          type: "number" as "number",
          name: "exp_max",
          label: "Experience Max",
          required: true,
          colSpan: "col-span-3",
          errorMsg: "Experience Max is required",
        },
        {
          type: "number" as "number",
          name: "ctc",
          label: "CTC",
          required: true,
          colSpan: "col-span-3",
          errorMsg: "CTC is required",
        },
        {
          type: "text" as "text",
          name: "current_company",
          label: "Current Company",
          required: true,
          colSpan: "col-span-3",
          errorMsg: "Current Company is required",
        },
        {
          type: "text" as "text",
          name: "current_location",
          label: "Current Location",
          required: true,
          colSpan: "col-span-3",
          errorMsg: "Current Location is required",
        },
        {
          type: "text" as "text",
          name: "preferred_location",
          label: "Preferred Location",
          required: true,
          colSpan: "col-span-3",
          errorMsg: "Preferred Location is required",
        },
        {
          type: "number" as "number",
          name: "notice_period",
          label: "Notice Period",
          required: true,
          colSpan: "col-span-3",
          errorMsg: "Notice Period is required",
        },
        {
          type: "text" as "text",
          name: "remarks",
          label: "Remarks",
          required: true,
          colSpan: "col-span-3",
          errorMsg: "Remarks is required",
        },
        {
          type: "upload" as "upload",
          name: "resume_url",
          label: "Resume",
          required: true,
          colSpan: "col-span-3",
          errorMsg: "Resume is required",
        },
      ],
    },
  ];

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
          columnsConfig={columns}
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
        <DrawerModal
          open={open}
          className={"80%"}
          title="Create New Candidate"
          onClose={onToggle}
        >
          <div>
            <SubmitForm fields={formFields} onSubmit={handleSubmit} />
          </div>
        </DrawerModal>
      </div>
    </div>
  );
}

export default Page;
