import InputSelection from "@/components/common/InputSelection";
import {
  cities,
  compensation,
  countries,
  currency,
  employmentType,
  frequency,
  jobStatus,
  seniorityLevel,
  workplaceType,
} from "@/utils/constants";

export const columnsConfig = [
  { label: "Job Post", name: "role", width: 200 },
  { label: "Questions", name: "interview_expiry", width: 200 },
  { label: "Responses", name: "interview_count", width: 200 },
  { label: "Action", name: "id", width: 200, type: "action-job-post" as const },
];

export const filterInputs = [
  {
    label: "Client Name" as const,
    name: "role" as const,
    inputType: "text" as const,
    colSpan: "col-span-4",
  },
  {
    label: "Status" as const,
    name: "job_status" as const,
    inputType: "select" as const,
    options: jobStatus,
    colSpan: "col-span-4",
  },
];

export const formInputsJobDetails = (skills: any, selected: any) => [
  {
    type: "text" as "text",
    name: "role",
    label: "Job Role",
    required: true,
    colSpan: "col-span-12 lg:col-span-12",
    errorMsg: "Job Role is required",
  },
  {
    type: "number" as "number", // Fix: was "text"
    name: "experience",
    label: "Experience",
    required: true,
    colSpan: "col-span-12 lg:col-span-12",
  },
  {
    type: "select" as "select",
    name: "seniority_level",
    label: "Level",
    required: true,
    options: seniorityLevel,
    colSpan: "col-span-12 lg:col-span-12",
  },
  {
    type: "select" as "select",
    name: "emplyment_type", // Note: this should probably be "employment_type"
    label: "Employment",
    required: true,
    options: employmentType,
    colSpan: "col-span-12 lg:col-span-6",
  },
  {
    type: "select" as "select",
    name: "workplace_type",
    label: "Workplace",
    required: true,
    options: workplaceType,
    colSpan: "col-span-12 lg:col-span-6",
  },
  {
    type: "select" as "select",
    name: "country",
    label: "Country",
    required: true,
    options: countries,
    colSpan: "col-span-12 lg:col-span-6",
    errorMsg: "Country is required", // Fix: was "Job Role is required"
  },
  {
    type: "select" as "select",
    name: "city",
    label: "City",
    required: true,
    options: cities,
    colSpan: "col-span-12 lg:col-span-6",
    errorMsg: "City is required", // Fix: was "Job Role is required"
  },
  {
    type: "select" as "select",
    name: "currency",
    label: "Currency",
    required: true,
    options: currency,
    colSpan: "col-span-12 lg:col-span-3",
  },
  {
    type: "text" as "text",
    name: "from_salary",
    label: "Salary From",
    required: true,
    colSpan: "col-span-12 lg:col-span-3",
  },
  {
    type: "text" as "text",
    name: "to_salary",
    label: "Salary To",
    required: true,
    colSpan: "col-span-12 lg:col-span-3",
  },
  {
    type: "select" as "select",
    name: "frequency",
    label: "Frequency", // Fix: capitalized
    required: true,
    options: frequency,
    colSpan: "col-span-12 lg:col-span-3",
  },
  {
    type: "select" as "select",
    name: "compensation",
    label: "Additional Compensation",
    required: false,
    options: compensation,
    colSpan: "col-span-12 lg:col-span-12",
  },
  {
    type: "textarea" as "textarea",
    name: "job_description_ai",
    label: "AI Job Description", // Fix: capitalized
    required: false,
    colSpan: "col-span-12 lg:col-span-12",
  },
  {
    name: "inputSelection",
    label: "Select Skills",
    colSpan: "col-span-12 lg:col-span-12",
    type: "custom",
    component: InputSelection,
    props: {
      availableOptions: skills || [],
      defaultSelectedOptions: selected || [],
      minOptions: 1,
      maxOptions: 10,
      placeholder: "Search and select skills...",
      allowCustomInput: true,
      showCategories: true,
      searchable: true,
      multiple: true,
    },
    rules: [
      {
        validator: (_: any, value: any) => {
          // Fix: Check the correct structure based on your InputSelection component
          const totalSelected =
            (value?.selectedOptions?.length || 0) +
            (value?.customOptions?.length || 0);

          if (totalSelected === 0) {
            return Promise.reject(
              new Error("Please select at least one skill")
            );
          }
          if (totalSelected < 1) {
            return Promise.reject(new Error("Minimum 1 skill required"));
          }
          if (totalSelected > 10) {
            // Match maxOptions
            return Promise.reject(new Error("Maximum 10 skills allowed"));
          }
          return Promise.resolve();
        },
      },
    ],
  },
];
export const formInputsJD = [
  {
    type: "textarea" as "textarea",
    name: "job_description",
    label: "Job Description",
    required: true,
    colSpan: "col-span-12 lg:col-span-12",
    rows: 15,
    placeholder: "Enter Job Description or paste here",
  },
];

export const formInputsContext = (skillsOptions: any) => [
  {
    type: "skills",
    name: "selectedSkills",
    label: "Select Skills",
    required: true,
    min: 1,
    max: 5,
    placeholder: "Choose your top skills (Max. 5)",
    options: skillsOptions,
    colSpan: "col-span-12",
    showCount: true,
    errorMsg: "Please select at least 1 skill",
  },
];

export const formConfiguration = [
  // {
  //   title: "Pre-Qualifying Questions",
  //   key: "pre_qualifying_questions",
  //   type: "pre_qualifying_questions",
  //   icon: "question",
  //   description:
  //     "Pre-qualifying questions are presented to candidates ahead of interview. The answers to these questions determine if candidate satisfy requirements of the job. Only if all questions are answered as required, they proceed to the tests.",
  //   defaultOpen: true,
  //   preQualifyingConfig: {
  //     responseTypes: [
  //       { label: "Text", value: "text" },
  //       { label: "Number", value: "number" },
  //       { label: "Email", value: "email" },
  //       { label: "Phone", value: "phone" },
  //       { label: "Yes/No", value: "yes_no" },
  //       { label: "Multiple Choice", value: "multiple_choice" },
  //       { label: "Date", value: "date" },
  //     ],
  //     maxQuestions: 5,
  //   },
  // },
  {
    title: "Interview Duration",
    key: "interview_duration",
    type: "chips",
    icon: "clock",
    description:
      "Change the time duration for the interview session as needed.",
    defaultOpen: false,
    defaultValue: "10 mins",
    options: [
      { label: "10 mins", value: "10 mins" },
      { label: "15 mins", value: "15 mins" },
      { label: "20 mins", value: "20 mins" },
      { label: "25 mins", value: "25 mins" },
      { label: "30 mins", value: "30 mins" },
    ],
  },
  {
    title: "Fit Score Weightage",
    key: "fit_score_weightage",
    type: "weight_slider",
    icon: "chart",
    description:
      "Adjust the weight of Technical and Communication scores to define how the Fit Score is calculated. You can modify this anytime based on the job requirements.",
    defaultOpen: false,
    defaultValue: 47,
    options: [
      { label: "Technical", value: "technical" },
      { label: "Communication", value: "communication" },
    ],
  },
  {
    title: "Interview Expiry",
    key: "interview_expiry",
    type: "expiry_options",
    icon: "calendar",
    description:
      "Interview link expires on a specific date or after reaching the responses count.",
    defaultOpen: false,
    options: [
      { label: "Set Date", value: "date" },
      { label: "Set Responses Count", value: "responses" },
      { label: "No Expiry", value: "no_expiry" },
    ],
  },
  {
    title: "Score Privacy",
    key: "score_privacy",
    type: "score_privacy",
    icon: "eye",
    description: "",
    defaultOpen: false,
    options: [
      { label: "Overall score", value: "overall_score" },
      { label: "Individual question score", value: "individual_score" },
      { label: "Communication score", value: "communication_score" },
    ],
  },
  {
    title: "Retake Settings",
    key: "retake_settings",
    type: "retake_settings",
    icon: "setting",
    description: "Candidate can send the retake request",
    defaultOpen: false,
  },
  {
    title: "Remote Proctoring Settings",
    key: "remote_proctoring",
    type: "remote_proctoring",
    icon: "monitor",
    description: "",
    defaultOpen: false,
    children: [
      {
        key: "tab_changes_detection",
        title: "Tab changes detection",
        description:
          "Monitor and detect any unauthorized tab switching during the session",
        type: "switch",
      },
      {
        key: "external_monitor_detection",
        title: "External monitor detection",
        description:
          "Identify the use of external monitors connected to the device",
        type: "switch",
      },
      {
        key: "intermittent_face_detection",
        title: "Intermittent face out of view detection",
        description:
          "Detect when candidate's face is intermittently out of the camera's view",
        type: "switch",
      },
      {
        key: "multiple_faces_detection",
        title: "Multiple faces detection",
        description: "Detect the presence of more than one face in the video",
        type: "switch",
      },
      {
        key: "multiple_voices_detection",
        title: "Multiple voices detection",
        description:
          "Identify when more than one voice is detected in the audio",
        type: "switch",
      },
      {
        key: "plagiarism_check",
        title: "Plagiarism Check",
        description:
          "Detect content originality to ensure responses are authentic",
        type: "switch",
      },
      {
        key: "enable_screen_sharing",
        title: "Enable Screen Sharing",
        description:
          "Ask candidates to allow screen sharing for full-screen access, recording, and screenshot capturing.",
        type: "switch",
      },
    ],
  },
  {
    title: "Lock Interview Link",
    key: "lock_interview_link",
    type: "lock_interview",
    icon: "lock",
    description:
      "Select if you want only invited candidates to take this interview",
    defaultOpen: false,
  },
  {
    title: "Notifications",
    key: "notifications",
    type: "notifications",
    icon: "bell",
    description: "",
    defaultOpen: false,
    children: [
      {
        key: "new_candidate_response",
        title: "New candidate response",
        description: "Every time a candidate submits an assessment",
        type: "checkbox",
        options: [
          { label: "Email", value: "email" },
          { label: "Whatsapp", value: "whatsapp" },
        ],
      },
    ],
  },
];
