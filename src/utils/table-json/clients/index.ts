import { contractTypes } from "@/utils/constants";

export const formInputs = [
  {
    type: "text",
    name: "name",
    label: "Client Name",
    required: true,
    colSpan: "col-span-12",
    placeholder: "client name",
    errorMsg: "Client name is required",
  },
  {
    type: "date",
    name: "start_date",
    label: "Start Date",
    required: true,
    colSpan: "col-span-12",
    placeholder: "Start Date",
  },
  {
    type: "select",
    name: "contract_type",
    label: "Contract Type",
    options: contractTypes,
    required: true,
    colSpan: "col-span-12",
  },
];

export const filterInputs = [
  {
    label: " Name" as const,
    name: "name" as const,
    inputType: "text" as const,
    colSpan: "col-span-4",
  },
];

export const columnsConfig: any[] = [
  {
    label: "Name",
    name: "name",
    filter: true,
    width: 200,
  },
  {
    label: "Contract Type",
    name: "contract_type",
    filter: true,
    width: 200,
    type: "mapObject",
    mapData: true,
    mapRecord: contractTypes,
  },
  {
    label: "Joining Date",
    name: "start_date",
    type: "date",
    filter: true,
    width: 200,
  },
  {
    label: "Action",
    name: "id",
    type: "action",
    filter: true,
    width: 100,
    fixed: "right",
    submitData: formInputs,
  },
];
