import { updateRecord } from "@/app/dashboard/actions/common/update/action";
import SubmitForm from "@/components/common/submit-form";
import { DBName } from "@/utils/db-tables-names";
import { formInputsJD } from "@/utils/table-json/job-postings";

export interface JobProps {
  data: any;
  current: number;
  setCurrent: (current: number) => void;
  id: string | null;
  refetch: any;
}

function JobDescription({ data, setCurrent, current, id, refetch }: JobProps) {
  const handleSubmit = async (values: Record<string, any>) => {
    console.log(values);
    if (!id) {
      return;
    }
    const result: any = await updateRecord(DBName.jobs, id, {
      ...values,
      step_1: true,
    });
    if (result?.success) {
      refetch().then((_: any) => {
        setCurrent(current + 1);
      });
    }
    return {
      ...result,
      error: result.error
        ? typeof result.error === "string"
          ? result.error
          : result.error.message || "Unknown error"
        : undefined,
    };
  };

  const onClick = () => {};

  return (
    <div>
      <SubmitForm
        btns={[
          {
            label: "Next Step",
            htmlType: "submit",
            type: "primary",
            onClick: onClick,
          },
        ]}
        fields={formInputsJD}
        onSubmit={handleSubmit}
        defaultValues={data}
      />
    </div>
  );
}

export default JobDescription;
