// "use client";

// import DynamicFormComponent from "@/components/common/DynamicFormComponent";
// import React from "react";

// const HomePage: React.FC = () => {
//   const formConfig = [
//     {
//       title: "Pre-Qualifying Questions",
//       key: "pre_qualifying_questions",
//       type: "pre_qualifying_questions",
//       icon: "question",
//       description:
//         "Pre-qualifying questions are presented to candidates ahead of interview. The answers to these questions determine if candidate satisfy requirements of the job. Only if all questions are answered as required, they proceed to the tests.",
//       defaultOpen: true,
//       preQualifyingConfig: {
//         responseTypes: [
//           { label: "Text", value: "text" },
//           { label: "Number", value: "number" },
//           { label: "Email", value: "email" },
//           { label: "Phone", value: "phone" },
//           { label: "Yes/No", value: "yes_no" },
//           { label: "Multiple Choice", value: "multiple_choice" },
//           { label: "Date", value: "date" },
//         ],
//         maxQuestions: 5,
//       },
//     },
//     {
//       title: "Interview Duration",
//       key: "interview_duration",
//       type: "chips",
//       icon: "clock",
//       description:
//         "Change the time duration for the interview session as needed.",
//       defaultOpen: true,
//       defaultValue: "10 mins",
//       options: [
//         { label: "10 mins", value: "10 mins" },
//         { label: "15 mins", value: "15 mins" },
//         { label: "20 mins", value: "20 mins" },
//         { label: "25 mins", value: "25 mins" },
//         { label: "30 mins", value: "30 mins" },
//       ],
//     },
//     {
//       title: "Fit Score Weightage",
//       key: "fit_score_weightage",
//       type: "weight_slider",
//       icon: "chart",
//       description:
//         "Adjust the weight of Technical and Communication scores to define how the Fit Score is calculated. You can modify this anytime based on the job requirements.",
//       defaultOpen: true,
//       defaultValue: 47,
//       options: [
//         { label: "Technical", value: "technical" },
//         { label: "Communication", value: "communication" },
//       ],
//     },
//     {
//       title: "Interview Expiry",
//       key: "interview_expiry",
//       type: "expiry_options",
//       icon: "calendar",
//       description:
//         "Interview link expires on a specific date or after reaching the responses count.",
//       defaultOpen: true,
//       options: [
//         { label: "Set Date", value: "date" },
//         { label: "Set Responses Count", value: "responses" },
//         { label: "No Expiry", value: "no_expiry" },
//       ],
//     },
//     {
//       title: "Score Privacy",
//       key: "score_privacy",
//       type: "score_privacy",
//       icon: "eye",
//       description: "",
//       defaultOpen: true,
//       options: [
//         { label: "Overall score", value: "overall_score" },
//         { label: "Individual question score", value: "individual_score" },
//         { label: "Communication score", value: "communication_score" },
//       ],
//     },
//     {
//       title: "Retake Settings",
//       key: "retake_settings",
//       type: "retake_settings",
//       icon: "setting",
//       title: "Full Interview Retake Request",
//       description: "Candidate can send the retake request",
//       defaultOpen: false,
//     },
//     {
//       title: "Remote Proctoring Settings",
//       key: "remote_proctoring",
//       type: "remote_proctoring",
//       icon: "monitor",
//       description: "",
//       defaultOpen: false,
//       children: [
//         {
//           key: "tab_changes_detection",
//           title: "Tab changes detection",
//           description:
//             "Monitor and detect any unauthorized tab switching during the session",
//           type: "switch",
//         },
//         {
//           key: "external_monitor_detection",
//           title: "External monitor detection",
//           description:
//             "Identify the use of external monitors connected to the device",
//           type: "switch",
//         },
//         {
//           key: "intermittent_face_detection",
//           title: "Intermittent face out of view detection",
//           description:
//             "Detect when candidate's face is intermittently out of the camera's view",
//           type: "switch",
//         },
//         {
//           key: "multiple_faces_detection",
//           title: "Multiple faces detection",
//           description: "Detect the presence of more than one face in the video",
//           type: "switch",
//         },
//         {
//           key: "multiple_voices_detection",
//           title: "Multiple voices detection",
//           description:
//             "Identify when more than one voice is detected in the audio",
//           type: "switch",
//         },
//         {
//           key: "plagiarism_check",
//           title: "Plagiarism Check",
//           description:
//             "Detect content originality to ensure responses are authentic",
//           type: "switch",
//         },
//         {
//           key: "enable_screen_sharing",
//           title: "Enable Screen Sharing",
//           description:
//             "Ask candidates to allow screen sharing for full-screen access, recording, and screenshot capturing.",
//           type: "switch",
//         },
//       ],
//     },
//     {
//       title: "Lock Interview Link",
//       key: "lock_interview_link",
//       type: "lock_interview",
//       icon: "lock",
//       title: "Disable public visibility",
//       description:
//         "Select if you want only invited candidates to take this interview",
//       defaultOpen: false,
//     },
//     {
//       title: "Notifications",
//       key: "notifications",
//       type: "notifications",
//       icon: "bell",
//       description: "",
//       defaultOpen: false,
//       children: [
//         {
//           key: "new_candidate_response",
//           title: "New candidate response",
//           description: "Every time a candidate submits an assessment",
//           type: "checkbox",
//           options: [
//             { label: "Email", value: "email" },
//             { label: "Whatsapp", value: "whatsapp" },
//           ],
//         },
//       ],
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="container mx-auto px-4 py-6">
//           <div className="text-center">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               Interview Configuration Form
//             </h1>
//             <p className="text-gray-600">
//               Configure your interview settings, questions, and proctoring
//               options
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         <DynamicFormComponent
//           config={formConfig}
//           onValuesChange={(changedValues, allValues) => {
//             console.log("Values changed:", changedValues);
//             console.log("All values:", allValues);
//           }}
//           onSubmit={(values) => {
//             console.log("Form submitted:", values);

//             // Show detailed submission summary
//             const summary = {
//               preQualifyingQuestions:
//                 values.preQualifyingQuestions?.length || 0,
//               interviewDuration: values.interview_duration,
//               fitScoreWeight: values.fit_score_weightage,
//               expiryType: values.interview_expiry,
//               privacySettings: Object.keys(values).filter((key) =>
//                 key.includes("score_privacy")
//               ),
//               retakeEnabled: values.retake_settings,
//               proctoring: Object.keys(values).filter((key) =>
//                 key.includes("remote_proctoring")
//               ).length,
//               isPrivate: values.lock_interview_link,
//               notifications: Object.keys(values).filter((key) =>
//                 key.includes("notifications")
//               ),
//             };

//             console.log("📊 Configuration Summary:", summary);

//             alert(`
// 🎉 Interview Configuration Saved!

// 📋 Summary:
// - Pre-qualifying Questions: ${summary.preQualifyingQuestions}
// - Interview Duration: ${summary.interviewDuration}
// - Technical Weight: ${values.fit_score_weightage || 50}%
// - Expiry Setting: ${summary.expiryType}
// - Retake Enabled: ${summary.retakeEnabled ? "Yes" : "No"}
// - Proctoring Features: ${summary.proctoring} enabled
// - Private Interview: ${summary.isPrivate ? "Yes" : "No"}

// Check console for complete details!
//            `);
//           }}
//           initialValues={{
//             interview_duration: "10 mins",
//             fit_score_weightage: 47,
//             interview_expiry: "responses",
//             score_privacy_overall_score: true,
//             score_privacy_individual_score: true,
//             score_privacy_communication_score: true,
//             retake_settings: true,
//             notifications_new_candidate_response_email: true,
//             notifications_new_candidate_response_whatsapp: false,
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default HomePage;

function page() {
  return <div></div>;
}

export default page;
