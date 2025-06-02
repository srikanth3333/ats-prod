export const formInputsLogin: any[] = [
  {
    type: "text",
    name: "email",
    label: "Email Address",
    required: true,
    colSpan: "col-span-12",
    placeholder: "Email Address",
    rules: [
      {
        type: "email",
        message: "Please enter a valid email address",
      },
    ],
  },
  {
    type: "password",
    name: "password",
    label: "Password",
    required: true,
    colSpan: "col-span-12",
    placeholder: "Password",
  },
];
