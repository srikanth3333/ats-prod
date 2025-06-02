import { getListDataById } from "@/app/dashboard/actions/common/get/action";
import { updateRecord } from "@/app/dashboard/actions/common/update/action";
import { DBName } from "@/utils/db-tables-names";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import DrawerModal from "../drawer-modal";
import SubmitForm from "../submit-form";

function ActionView({ val, submitData, refetch }: any) {
  const [open, setOpen] = useState(false);
  const [defaultValues, setDefaultValues] = useState<Record<
    string,
    any
  > | null>(null);
  const [dataId, setDataId] = useState<string | null>(null);
  const onToggle = () => {
    setOpen(!open);
  };

  const getData = async (id: string | null) => {
    if (id === null) {
      return;
    }
    setDataId(id);
    const data = await getListDataById(DBName.clients, "*", id);
    if (data?.success) {
      setDefaultValues(data?.data ?? null);
      onToggle();
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    if (!dataId) {
      return { success: false, error: "Invalid dataId", data: null };
    }
    const result = await updateRecord(DBName.clients, dataId, values);
    if (result) {
      onToggle();
      refetch();
      return {
        success: result.success,
        error:
          result.error && typeof result.error === "object"
            ? result.error.message
            : result.error ?? undefined,
        data: result.data,
      };
    }
    return { success: false, error: "Unknown error", data: null };
  };

  return (
    <div className="flex gap-3 justify-around">
      <Button
        type="default"
        onClick={() => getData(val)}
        icon={<EditFilled />}
        size="large"
      />
      <Button type="default" icon={<DeleteFilled />} size="large" />
      <div>
        <DrawerModal open={open} title="Create New Client" onClose={onToggle}>
          <div>
            <SubmitForm
              defaultValues={defaultValues ?? undefined}
              fields={submitData}
              onSubmit={handleSubmit}
            />
          </div>
        </DrawerModal>
      </div>
    </div>
  );
}

export default ActionView;
