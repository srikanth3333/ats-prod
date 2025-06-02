"use client";

import { updateRecord } from "@/app/dashboard/actions/common/update/action";
import DynamicFormComponent from "@/components/common/DynamicFormComponent";
import { DBName } from "@/utils/db-tables-names";
import { formConfiguration } from "@/utils/table-json/job-postings";
import { Button } from "antd";
import { useState } from "react";

const InterviewConfiguration = ({
  data,
  setCurrent,
  current,
  id,
  refetch,
}: any) => {
  const [submitValues, setSubmitValues] = useState(data?.interview_config);

  const handleSubmit = async () => {
    if (!id) {
      return;
    }
    const result: any = await updateRecord(DBName.jobs, id, {
      interview_config: submitValues,
      step_4: true,
    });
    if (result?.success) {
      refetch().then((_: any) => {
        setCurrent(current + 1);
      });
    }
  };

  return (
    <div className="">
      {/* Main Content */}
      <div className="">
        <DynamicFormComponent
          config={formConfiguration}
          onValuesChange={(changedValues, allValues) => {
            setSubmitValues(allValues);
          }}
          onSubmit={(values) => {}}
          initialValues={submitValues}
        />
        <div className="bg-white shadow-md rounded-xl p-4 mt-4 fixed bottom-0 left-0 right-0">
          <div className="flex justify-end gap-4 mt-4">
            <Button size="middle" onClick={() => setCurrent(current - 1)}>
              Previous
            </Button>
            <Button
              type="primary"
              size="middle"
              className="bg-green-500 border-green-500 hover:bg-green-600"
              onClick={handleSubmit}
            >
              Next Step
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewConfiguration;
