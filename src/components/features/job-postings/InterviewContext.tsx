import { updateRecord } from "@/app/dashboard/actions/common/update/action";
import SkillsConceptsComponent from "@/components/common/SkillsConceptsComponent";
import { DBName } from "@/utils/db-tables-names";
import { Button } from "antd";
import { useState } from "react";

export interface JobProps {
  data: any;
  current: number;
  setCurrent: (current: number) => void;
  id: string | null;
  loading: boolean;
  refetch: any;
}

function InterviewContext({
  data,
  setCurrent,
  current,
  id,
  refetch,
}: JobProps) {
  const [selectedSkills, setSelectedSkills] = useState<any[]>([]);
  const [selectedConcepts, setSelectedConcepts] = useState<any[]>([]);

  const handleSkillsChange = (skills: any[]) => {
    setSelectedSkills(skills);
  };

  const handleConceptsChange = (concepts: any[], addedConceptsData: any[]) => {
    const record = concepts?.map((item) => {
      const missingFromSuggestions =
        item.originalSuggestions?.filter(
          (original: string) => !item.suggestions?.includes(original)
        ) || [];
      const manuallyAdded = addedConceptsData
        .filter((concept) => concept.parentConceptId === item.id)
        .map((concept) => concept.conceptName);
      const selectedConcepts = [
        ...new Set([...missingFromSuggestions, ...manuallyAdded]),
      ];

      return {
        [item.name]: {
          ...item,
          selected: selectedConcepts,
          selectedFromSuggestions: missingFromSuggestions,
          manuallyAdded: manuallyAdded,
          totalSelected: selectedConcepts.length,
        },
      };
    });

    setSelectedConcepts(record);
    // setAddedConcepts(addedConceptsData);
  };

  const handleSubmit = async () => {
    if (!id) {
      return;
    }
    const result: any = await updateRecord(DBName.jobs, id, {
      selected_skills: selectedSkills,
      selected_concepts: selectedConcepts,
      step_3: true,
    });
    if (result?.success) {
      refetch().then((_: any) => {
        setCurrent(current + 1);
      });
    }
  };

  return (
    <div>
      <SkillsConceptsComponent
        availableSkills={data?.skills_required || []}
        defaultSelectedSkills={data?.selected_skills || []}
        skillSuggestions={{}}
        minSkills={1}
        maxSkills={5}
        onSkillsChange={handleSkillsChange}
        onConceptsChange={handleConceptsChange}
        className="my-component"
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
  );
}

export default InterviewContext;
