import {
  updateJobPostingByIds,
  updateRecord,
} from "@/app/dashboard/actions/common/update/action";
import { useGetList } from "@/hooks/use-get-list";
import { DBName } from "@/utils/db-tables-names";
import { Button, Select } from "antd";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import DrawerModal from "../drawer-modal";

function ActionJobPost({ val, record, refetch }: any) {
  console.log(record);
  const [open, setOpen] = useState(false);
  const [ids, setIds] = useState([]);
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
  const router = useRouter();
  const {
    currentPage,
    pageSize,
    total,
    data,
    loading,
    handlePageChange,
    setCurrentPage,
    setFilters,
  } = useGetList(hookOptions);
  const handleUpdate = async () => {
    const result = await updateRecord(DBName.jobs, val, {
      job_status: "active",
    });
    if (result?.success) {
      refetch();
    }
  };

  const handleNavigate = () => {
    router.push(`/dashboard/job-postings/post-detail/?id=${val}`);
  };

  const onToggle = () => {
    setOpen(!open);
  };

  const options = data?.map((record: any) => ({
    label: `${record?.name} - (${record?.email})`,
    value: record?.id,
  }));

  const handleChange = (items: any) => {
    console.log("items", items);
    setIds(items);
  };

  const submitData = async () => {
    const { data, error } = await updateJobPostingByIds(ids, val);
    console.log("error", ids, error, val);
    if (error) {
      alert("something went wrong");
    }
    onToggle();
    console.log(data);
  };

  return (
    <div>
      {record?.job_status === "draft" ? (
        <Button onClick={handleUpdate} type="primary">
          Publish
        </Button>
      ) : (
        <div className="space-y-2">
          <Button onClick={handleNavigate}>View Responses</Button>
          <Button onClick={onToggle}>Respond</Button>
        </div>
      )}
      <div>
        <DrawerModal open={open} title="Add Candidates" onClose={onToggle}>
          <div>
            {/* <SubmitForm fields={formInputs} onSubmit={handleSubmit} /> */}
            <Select
              // defaultValue="lucy"
              style={{ width: "100%" }}
              onChange={handleChange}
              options={options}
              mode="multiple"
              filterOption={(input, option) => {
                var _a;
                return (
                  (_a =
                    option === null || option === void 0
                      ? void 0
                      : option.label) !== null && _a !== void 0
                    ? _a
                    : ""
                )
                  .toLowerCase()
                  .includes(input.toLowerCase());
              }}
            />
            <div className="mt-4">
              <Button onClick={submitData} className="mt-10">
                Submit Data
              </Button>
            </div>
          </div>
        </DrawerModal>
      </div>
    </div>
  );
}

export default ActionJobPost;
