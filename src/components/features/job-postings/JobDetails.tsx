import { updateRecord } from "@/app/dashboard/actions/common/update/action";
import SubmitForm from "@/components/common/submit-form";
import { fetchData } from "@/utils/api";
import { DBName } from "@/utils/db-tables-names";
import { formInputsJobDetails } from "@/utils/table-json/job-postings";
import { useEffect, useState } from "react";

function JobDetails({ data, setCurrent, current, id, loading, refetch }: any) {
  const [defaultValues, setDefaultValues] = useState<any>(data);
  const [defaultSkills, setDefaultSkills] = useState<any>(data?.default_skills);

  const getData = async () => {
    try {
      const result = await fetchData("/api/ai-data-extract", "POST", {
        jd: data?.job_description,
      });
      const { skills_required, ...newObj } = result;
      setDefaultValues(newObj);
      const updatedData = result?.skills_required?.map(
        (record: any, index: number) => ({
          id: index.toString(),
          name: record,
          category: record,
        })
      );
      setDefaultSkills(updatedData);
    } catch (error) {
      console.error("Error extracting AI data:", error);
    }
  };

  useEffect(() => {
    if (!data?.step_2 && !loading && id) {
      getData();
    }
  }, [id, data?.step_2, loading]); // Add dependencies

  const handleSubmit = async (values: Record<string, any>) => {
    if (!id) {
      return {
        success: false,
        error: "No ID provided",
      };
    }

    try {
      const { inputSelection, ...newObj } = values;

      const result: any = await updateRecord(DBName.jobs, id, {
        ...newObj,
        default_skills: defaultSkills,
        selected_skills: [],
        skills_required: [
          ...(inputSelection?.selectedOptions || []),
          ...(inputSelection?.customOptions || []),
          ...(!inputSelection?.selectedOptions && !inputSelection?.customOptions
            ? data?.skills_required || []
            : []),
        ],
        step_2: true,
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
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  const onClick = () => {
    setCurrent(current - 1);
  };

  // Ensure skills_required is properly formatted for the component
  const selectedSkills =
    data?.skills_required?.map((skill: any, index: number) => ({
      id: skill.id || index.toString(),
      name: skill.name || skill,
      category: skill.category || "Default",
    })) || [];

  const formInputs = formInputsJobDetails(defaultSkills, selectedSkills);

  return (
    <div>
      <SubmitForm
        btns={[
          {
            label: "Previous",
            htmlType: "button",
            onClick: onClick,
          },
          {
            label: "Next Step",
            htmlType: "submit",
            type: "primary",
          },
        ]}
        fields={formInputs}
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
      />
    </div>
  );
}

export default JobDetails;
